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
        $fairs = Fair::where('status', config('constants.Fair.Status.Published'))
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
