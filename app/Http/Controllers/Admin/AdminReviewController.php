<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Inertia\Inertia;
use Inertia\Response;

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
}