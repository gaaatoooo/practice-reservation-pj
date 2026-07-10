<?php

namespace App\Http\Controllers;

use App\Models\RoomAvailability;
use App\Models\Room; // Room モデルを使えるようにインポートします
use Illuminate\Http\Request;

class RoomAvailabilityController extends Controller
{
    /**
     * 空室状況のデータをJSON形式で返すAPI
     */
    public function getAvailability()
    {
        // 1. ホテル全体の「総部屋数」の合計値を計算（例：シングル10室 ＋ ツイン5室 ＝ 計15室）
        $totalHotelRooms = Room::where('status', true)->sum('total_rooms');

        // 2. 日付ごとの「予約確定数」の合計をデータベースから集計
        $dailyReservations = RoomAvailability::select('date')
            ->selectRaw('COUNT(*) as total_reserved')
            ->groupBy('date')
            ->get();

        $formattedData = [];
        foreach ($dailyReservations as $reservation) {
            // 残り部屋数の計算（ホテル総数 − その日の予約数）
            $remaining = $totalHotelRooms - (int)$reservation->total_reserved;

            // 条件判定ロジック
            if ($remaining <= 0) {
                $statusNum = config('constants.ReservationAvailability.Status.Full'); // × 満室
            } elseif ($remaining <= 5) {
                $statusNum = config('constants.ReservationAvailability.Status.Limited'); // △ 残り5室以下
            } else {
                $statusNum = config('constants.ReservationAvailability.Status.Available'); // ○ 空室あり
            }

            $formattedData[$reservation->date] = $statusNum;
        }

        // フロントエンドにJSONデータとして返却
        return response()->json($formattedData);
    }

    /**
     * 指定された日付の空室（満室以外）の部屋一覧を返すAPI
     */
    public function getRoomsByDate(Request $request)
    {
        $date = $request->query('date');

        if (!$date) {
            return response()->json([], 400);
        }

        // 1. 公開されているすべての部屋タイプを取得
        $rooms = Room::where('status', true)->get();

        // 2. 指定された日付の各部屋の予約数を取得
        $reservedCounts = RoomAvailability::where('date', $date)
            ->select('room_id')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('room_id')
            ->get()
            ->keyBy('room_id'); // 部屋IDをキーにした連想配列にして扱いやすくします

        $availableRooms = [];

        foreach ($rooms as $room) {
            // その日のこの部屋の予約数を取得（データがなければ 0 件）
            $reservedCount = isset($reservedCounts[$room->id]) ? $reservedCounts[$room->id]->count : 0;

            // 残り部屋数の計算（総部屋数 − 現在の予約数）
            $remaining = $room->total_rooms - $reservedCount;

            // 残り部屋数が 0 より大きい（空室がある）場合だけ一覧に追加します！
            if ($remaining > 0) {
                // カレンダー側の表示に合わせるため、ステータス数値をリアルタイム計算
                $statusNum = 1; // ○ 空室あり
                if ($remaining <= 5) {
                    $statusNum = config('constants.ReservationAvailability.Status.Limited'); // △ 残りわずか
                }

                $availableRooms[] = [
                    'id' => $room->id,
                    'name' => $room->name,
                    'price' => $room->price,
                    'capacity' => $room->capacity,
                    'description' => $room->description,
                    'status' => $statusNum, // 1 または 2 を React へ渡す
                ];
            }
        }

        return response()->json($availableRooms);
    }
}
