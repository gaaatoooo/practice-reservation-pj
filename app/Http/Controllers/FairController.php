<?php

namespace App\Http\Controllers;

use App\Models\Fair;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class FairController extends Controller
{
    /**
     * フロントエンドのスライダー向けに公開中のフェア情報を取得
     */
    public function index(): JsonResponse
    {
        $today = now()->toDateString();
        
        $fairs = Fair::where('status', config('constants.Fair.Status.Published'))
            ->where(function ($query) use ($today) {
                $query->whereNull('public_start_date')
                    ->orWhereDate('public_start_date', '<=', $today);
            })
            // 公開終了日：未登録(null)なら無条件でOK、登録されていればシステム日付がその日以前であること
            ->where(function ($query) use ($today) {
                $query->whereNull('public_end_date')
                    ->orWhereDate('public_end_date', '>=', $today);
            })
            ->orderBy('sort_order', 'asc')
            ->get();

        return response()->json($fairs);
    }

    /**
     * 新設：フェア詳細画面の表示
     */
    public function show(int $id): InertiaResponse
    {
        // 該当するフェアを取得（存在しない場合は404エラー）
        $fair = Fair::where('status', config('constants.Fair.Status.Published'))->findOrFail($id);

        return Inertia::render('User/FairDetail', [
            'fair' => $fair
        ]);
    }
}
