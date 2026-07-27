<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRestaurantReservationRequest;
use App\Models\RestaurantReservation;
use App\Models\RestaurantStock;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class RestaurantReservationController extends Controller
{
    /**
     * レストラン予約画面（フォーム＋自分の予約一覧）
     */
    public function index(): Response
    {
        $reservations = RestaurantReservation::where('user_id', Auth::id())
            ->orderByDesc('reservation_date')
            ->orderByDesc('reservation_time')
            ->get();

        return Inertia::render('User/RestaurantReservation', [
            'reservations' => $reservations,
            'times' => config('constants.Restaurant.Times'),
        ]);
    }

    /**
     * レストラン予約の登録
     */
    public function store(StoreRestaurantReservationRequest $request)
    {
        $validated = $request->validated();

        // 指定の日付・時間が「公開中の予約枠」として存在するか確認
        $stock = RestaurantStock::where('date', $validated['date'])
            ->where('time', $validated['time'])
            ->first();

        if (! $stock) {
            return back()->withErrors(['time' => '指定の日時は予約を受け付けていません。'])->withInput();
        }

        // 既存予約人数の合計（キャンセル済みは除く）を都度計算
        $reservedCount = RestaurantReservation::where('restaurant_stock_id', $stock->id)
            ->where('status', 1)
            ->sum('number');

        if ($reservedCount + $validated['number'] > $stock->capacity) {
            return back()->withErrors(['number' => '指定の人数分の空きがありません。'])->withInput();
        }

        RestaurantReservation::create([
            'user_id' => Auth::id(),
            'restaurant_stock_id' => $stock->id,
            'number' => $validated['number'],
            'reservation_date' => $validated['date'],
            'reservation_time' => $validated['time'],
            'status' => 1,
        ]);

        return redirect()->route('user.restaurant_reservation.index')
            ->with('success', 'レストランの予約を受け付けました。');
    }

    /**
     * レストラン予約のキャンセル（自分の予約のみ）
     */
    public function destroy(RestaurantReservation $reservation)
    {
        // 他ユーザーの予約を操作できないようにする認可チェック
        if ($reservation->user_id !== Auth::id()) {
            abort(403);
        }

        $reservation->update(['status' => 2]);

        return redirect()->route('user.restaurant_reservation.index')
            ->with('success', 'ご予約をキャンセルしました。');
    }
}