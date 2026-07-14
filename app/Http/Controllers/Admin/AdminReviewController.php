<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Http\Requests\Admin\StoreReviewRequest; // ⭕️ 追記
use Illuminate\Http\RedirectResponse; // ⭕️ 追記
use Inertia\Inertia;
use Inertia\Response;

use Illuminate\Support\Facades\Log;

class AdminReviewController extends Controller
{
    /**
     * 管理側：口コミ一覧画面の表示
     */
    public function index(): Response
    {
        // ⭕️ N+1問題を防止するため、部屋・プラン・ユーザーを一括ロード
        $reviews = Review::with(['room', 'plan', 'user'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/ReviewList', [
            'reviews' => $reviews
        ]);
    }

    /**
     * ⭕️ 新規追記：口コミへの公式返信登録処理
     */
    public function reply(StoreReviewRequest $request, int $id): RedirectResponse
    {
        // 2. 対象のレビューをデータベースから検索
        $review = Review::findOrFail($id);

        // 1. フロントから送られてきた返信内容を厳格にバリデーション
        $validated = $request->validated();

        $review->update($validated);

        // 4. 前の画面にフラッシュメッセージ付きで安全にリダイレクトバック
        return redirect()->back()->with('status', 'レビューへの公式返信を登録しました。');
    }
}