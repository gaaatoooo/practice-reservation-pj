<?php

namespace App\Mail;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReservationCompletedMail extends Mailable
{
    use Queueable, SerializesModels;

    // メールの本文（Blade）の中で自由に使い回せるように、予約データを保持します
    public $reservation;

    /**
     * コンストラクタで、作成された予約データを受け取ります
     */
    public function __construct(Reservation $reservation)
    {
        // 部屋情報（room）とプラン情報（plan）をあらかじめガッチャンコして保持
        $this->reservation = $reservation->load(['room', 'plan']);
    }

    /**
     * メールの封筒（件名などの設定）
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '【当ホテル】ご宿泊予約が完了いたしました', // ⭕️ メールの件名
        );
    }

    /**
     * メールの本文（デザインテンプレートの指定）
     */
    public function content(): Content
    {
        return new Content(
            // ⭕️ 次のステップで作る、メール本文用のHTML（Blade）の場所を指定します
            view: 'emails.reservation_completed',
        );
    }
}
