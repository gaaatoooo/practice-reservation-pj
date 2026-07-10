<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReviewRequest;
use App\Models\Room;
use App\Models\Plan;
use App\Models\Review;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ReviewController extends Controller
{
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
