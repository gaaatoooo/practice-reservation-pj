<?php

namespace App\Services;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use App\Mail\ReservationCompletedMail;
use App\Mail\ReservationCancelledMail;
use App\Models\RoomAvailability;
use App\Models\Reservation;
use App\Models\Room;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class ReservationService
{
    /**
     * 宿泊日数と合計金額を計算する
     * 
     * @param int $roomId
     * @param string $startDate
     * @param string $endDate
     * @return array [泊数, 合計金額]
     */
    public function calculateTotalPrice(int $roomId, int $number, string $startDate, string $endDate): array
    {
        $start = Carbon::parse($startDate);
        $end = Carbon::parse($endDate);
        
        // 泊数の計算
        $nights = $start->diffInDays($end);

        // ⭕️ 安全対策：もし同日や逆転した日付が入ってきた場合は、最低「1泊」として扱う
        if ($nights < 1) {
            $nights = 1;
        }

        $room = Room::findOrFail($roomId);
        $totalPrice = $room->price * $nights * $number;

        return [
            'nights' => $nights,
            'total_price' => $totalPrice,
        ];
    }

    /**
     * 2. ⭕️ 新設：予約データをDBに保存し、同時に予約完了メールを自動送信する
     */
    public function createReservation(array $validated, array $calculation, ?bool $isOtherGuest): Reservation
    {
        // DBへの保存オブジェクトを作成
        $reservation = new Reservation();
        $reservation->fill($validated);
        
        // 別予約者のチェックがOFFの場合は、安全のため各項目をnullクリア
        if (!$isOtherGuest) {
            $reservation->guest_name = null;
            $reservation->guest_email = null;
            $reservation->guest_tel = null;
            $reservation->guest_zip = null;
            $reservation->guest_address = null;
            $reservation->guest_birthday = null;
        }

        $reservation->user_id = auth()->id();
        $reservation->total_price = $calculation['total_price'];
        $reservation->status = 1; // 1:予約済み
        
        // データベースに保存
        $reservation->save();

        // ② ⭕️ 連動処理：宿泊期間中の全日程の予約数（reserved_count）を ＋1 加算する
        // 例：7/1 から 7/3 の予約（2泊）の場合、7/1 と 7/2 の2日間をループで回します
        $period = CarbonPeriod::create($reservation->reservation_start_date, $reservation->reservation_end_date . ' -1 day');

        foreach ($period as $date) {
            $dateStr = $date->format('Y-m-d');

            // 1日につき「1行」のレコードを追加（これにより行数そのものが予約カウンターになります）
            RoomAvailability::create([
                'room_id' => $reservation->room_id,
                'date'    => $dateStr
            ]);
        }

        // ーーー 📨 ここからメール送信ロジック ーーー
        try {
            // 送信先のメールアドレスを判定（別予約者がいればそのアドレス、いなければログインユーザー本人）
            $sendToEmail = $isOtherGuest && !empty($validated['guest_email']) 
                ? $validated['guest_email'] 
                : auth()->user()->email;

            // Mailファサードを使って、作成したMailableクラスを発射！
            Mail::to($sendToEmail)->send(new ReservationCompletedMail($reservation));
            
        } catch (\Exception $e) {
            // 万が一、メール送信設定（SMTP等）の不具合でエラーが起きても、
            // ユーザーの画面がクラッシュして予約自体が失敗扱いにならないよう、
            // エラーを安全にログに記録してスルーします（安全設計の定石です）
            logger()->error('予約完了メールの送信に失敗しました: ' . $e->getMessage());
        }

        return $reservation;
    }

    /**
     * 予約キャンセル処理のビジネスロジック
     */
    public function cancelReservation(Reservation $reservation): void
    {
        DB::transaction(function () use ($reservation) {
            // 1. 予約ステータスを「2: キャンセル済」に更新
            $reservation->update(['status' => 2, 'cancel_date' => Carbon::now()]);

            // 2. 宿泊期間の日付リストを作成
            $start = Carbon::parse($reservation->reservation_start_date);
            $end = Carbon::parse($reservation->reservation_end_date);
            
            $dates = [];
            // チェックアウト日当日は空室カウント（履歴行）に含まれないため、lt($end) で前日までループ
            for ($date = $start; $date->lt($end); $date->addDay()) {
                $dates[] = $date->toDateString();
            }

            // 3. 該当する部屋・日付の空室管理レコードを1予約分（1行分）ずつ削除して部屋を開放
            foreach ($dates as $dateStr) {
                DB::table('room_availabilities')
                    ->where('room_id', $reservation->room_id)
                    ->where('date', $dateStr)
                    ->limit(1) // 1行=1予約カウントのため、確実にこの予約の1件分のみを削除
                    ->delete();
            }

            // 4. ーーー 📨 ⭕️ ここからキャンセル完了メール送信ロジックを追加 ーーー
            try {
                // 送信先メールアドレスを判定（別予約者がいればそのアドレス、いなければログインユーザー本人）
                $sendToEmail = !empty($reservation->guest_email) 
                    ? $reservation->guest_email 
                    : auth()->user()->email;

                // Mailファサードを使って発射！
                Mail::to($sendToEmail)->send(new ReservationCancelledMail($reservation));
                
            } catch (\Exception $e) {
                // メール送信の不具合で予約キャンセル処理自体が失敗（ロールバック）しないよう安全にログ記録してスルー
                logger()->error('予約キャンセルメールの送信に失敗しました: ' . $e->getMessage());
            }
        });
    }
}