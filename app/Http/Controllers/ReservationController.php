<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReservationRequest;
use App\Models\Room;
use App\Models\Plan;
use App\Services\ReservationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReservationController extends Controller
{
    protected $reservationService;

    public function __construct(ReservationService $reservationService)
    {
        $this->reservationService = $reservationService;
    }

    /**
     * 1. 予約入力フォーム画面を表示する
     */
    public function showForm(Request $request)
    {
        // カレンダーからの日付がない場合は、安全に本日の日付を初期値に適用
        $date = $request->input('date') ?? $request->query('date') ?? now()->toDateString();
        
        // 部屋IDを取得
        $roomId = $request->input('room_id') ?? $request->query('room_id');

        // 全ての公開客室マスタを取得（ユーザーがフォーム内で選択できるようにするため）
        $rooms = Room::where('status', true)->get();

        // 部屋IDが指定されている場合のみ単一の部屋を特定、なければ空のモデルを用意してエラーを防ぐ
        if (!empty($roomId)) {
            $room = Room::findOrFail($roomId);
            $currentRoomId = $room->id;
            $currentRoomName = $room->name;
            $currentRoomPrice = $room->price;
        } else {
            $currentRoomId = '';
            $currentRoomName = '';
            $currentRoomPrice = 0;
        }

        $user = auth()->user();
        $plans = Plan::all();

        return Inertia::render('User/ReservationForm', [
            'date' => $date,
            'roomId' => $currentRoomId,      // 部屋が未指定なら空文字が渡る
            'roomName' => $currentRoomName,  // 部屋が未指定なら空文字が渡る
            'roomPrice' => $currentRoomPrice,
            'rooms' => $rooms,               // すべての部屋マスタをReactへ渡す
            'plans' => $plans,
            // 本人のログイン情報は「100%固定」
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'tel' => $user->tel,
                'zip' => $user->zip,
                'address' => $user->address,
            ],
            // 戻ってきた入力値の箱
            'inputs' => [
                'plan_id' => $request->input('plan_id'),
                'reservation_end_date' => $request->input('reservation_end_date'),
                'number' => $request->input('number'),
                'is_other_guest' => $request->input('is_other_guest') === 'true' || $request->input('is_other_guest') === true,
                'guest_name' => $request->input('guest_name'),
                'guest_email' => $request->input('guest_email'), 
                'guest_tel' => $request->input('guest_tel'),
                'guest_zip' => $request->input('guest_zip'),
                'guest_address' => $request->input('guest_address'),
                'guest_birthday' => $request->input('guest_birthday'),
            ]
        ]);
    }

    /**
     * 2. 入力内容を受け取って「予約内容確認画面」を表示する
     */
    public function showConfirm(StoreReservationRequest $request)
    {
        // フォームリクエストでのチェックに合格したデータを取得
        $validated = $request->validated();

        // サービスを使って、宿泊日数と合計金額を計算
        $calculation = $this->calculateTotalPrice($validated);

        $room = Room::findOrFail($validated['room_id']);
        $plan = Plan::findOrFail($validated['plan_id']);

        // 画面に入力された情報＋計算結果を乗せて、新設する「ReservationConfirm」画面を起動
        return Inertia::render('User/ReservationConfirm', [
            'inputs' => $validated, // 入力されたお名前や日付のセット
            'roomName' => $room->name,
            'planName' => $plan->name,
            'roomPrice' => $room->price,
            'nights' => $calculation['nights'],
            'totalPrice' => $calculation['total_price'],
            // フォームに直接入力された顧客情報を引き継ぐ
            'guestName' => $request->input('guest_name'),
            'guestEmail' => $request->input('guest_email'),
            'guestTel' => $request->input('guest_tel'),
            'guestZip' => $request->input('guest_zip'),
            'guestAddress' => $request->input('guest_address'),
            'guestBirthday' => $request->input('guest_birthday'),
        ]);
    }

    /**
     * 3. 確認画面から「確定ボタン」が押された時に、DBへ最終保存する処理
     */
    public function store(StoreReservationRequest $request)
    {
        $validated = $request->validated();

        // 改ざん防止のため、裏側（Service）で再度金額を正確に再計算
        $calculation = $this->calculateTotalPrice($validated);

        // 2. 保存とメール送信の一連の重い処理を、丸ごとサービスへ委託します
        $this->reservationService->createReservation(
            $validated,
            $calculation,
            $request->input('is_other_guest')
        );

        // ダッシュボードではなく、新設する「予約完了画面（サンクスページ）」へリダイレクト
        return redirect()->route('user.reservation.thanks')->with('from_store', true);
    }

    /**
     * 4. 予約完了画面（サンクスページ）を表示する
     */
    public function showThanks()
    {
        if (!session('from_store')) {
            return redirect()->route('user.reservation'); 
        }

        return Inertia::render('User/ReservationThanks');
    }

    /**
     * 5. 金額計算処理
     */
    private function calculateTotalPrice($validated): array
    {
        return $this->reservationService->calculateTotalPrice(
            $validated['room_id'],
            $validated['number'],
            $validated['reservation_start_date'],
            $validated['reservation_end_date']
        );
    }
}
