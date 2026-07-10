<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Inertia\Inertia;
use Inertia\Response;

class RoomController extends Controller
{
    public function index(): Response
    {
        // 部屋一覧を取得（必要に応じて画像パスや基本アメニティも網羅）
        $rooms = Room::withAvg('reviews', 'rating')
            ->orderBy('id', 'asc')
            ->get();

        return Inertia::render('User/RoomList', [
            'rooms' => $rooms
        ]);
    }

    public function show(Room $room): Response
    {
        $room->loadAvg('reviews', 'rating');

        // 小数点第1位で綺麗に四捨五入してフォーマット（例: 4.3333... ➔ 4.3）
        $averageRating = $room->reviews_avg_rating 
            ? round($room->reviews_avg_rating, 1) 
            : 0;

        return Inertia::render('User/RoomDetail', [
            'room' => $room,
            'averageRating'  => $averageRating,
        ]);
    }
}
