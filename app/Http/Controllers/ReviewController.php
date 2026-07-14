<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreReviewRequest;
use App\Models\Room;
use App\Models\Plan;
use App\Models\Review;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

use Illuminate\Support\Facades\Log;

class ReviewController extends Controller
{
    /**
     * 口コミ一覧画面の表示
     */
    public function index(): Response
    {
        log::alert('到着');

        $reviews = Review::with(['room', 'plan'])
            ->where('user_id', Auth::id()) // 自分が投稿したものだけ
            ->latest()                     // 投稿日時の新しい順
            ->get();

        log::alert($reviews);

        return Inertia::render('User/ReviewList', [
            'reviews' => $reviews
        ]);
    }

    /**
     * 口コミ投稿画面の表示
     */
    public function create(): Response
    {
        return Inertia::render('User/ReviewCreate', [
            'rooms' => Room::select('id', 'name')->get(),
            'plans' => Plan::select('id', 'name')->get(),
        ]);
    }

    /**
     * 口コミの保存実行
     */
    public function store(StoreReviewRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        
        // ログインユーザーのIDを付与して作成
        $validated['user_id'] = auth()->id();
        Review::create($validated);

        return redirect()->back()
            ->with('success', '口コミを投稿しました。ご協力ありがとうございました！');
    }
}
