<?php

namespace App\Http\Controllers;

use App\Models\Notice;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NoticeController extends Controller
{
    /**
     * 公開状態（status=2）のお知らせ一覧を新着順で返すAPI
     */
    public function index()
    {
        // ステータスが「2（公開）」のものだけを抽出し、登録日時の新しい順に取得
        $notices = Notice::where('status', config('constants.Notice.Status.Published'))
            ->orderBy('created_at', 'desc')
            ->get();

        // React がそのまま fetch できるように JSON 形式で返却
        return response()->json($notices);
    }
    
    /**
     * お知らせの詳細画面を表示する
     */
    public function show(int $id)
    {
        // データベースから対象のお知らせを1件取得（無ければ404画面へ）
        $notice = Notice::findOrFail($id);

        // 新設する React 画面（User/NoticeDetail）を起動し、データを渡す
        return Inertia::render('User/NoticeDetail', [
            'notice' => $notice
        ]);
    }
}
