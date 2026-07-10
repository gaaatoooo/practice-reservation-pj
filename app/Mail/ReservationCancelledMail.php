<?php

namespace App\Mail;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReservationCancelledMail extends Mailable
{
    use Queueable, SerializesModels;

    public $reservation;

    /**
     * コンストラクタで予約モデルを受け取る
     */
    public function __construct(Reservation $reservation)
    {
        // 関連する room と plan も確実に読み込んでおく
        $this->reservation = $reservation->load(['room', 'plan']);
    }

    /**
     * メールの件名（サブジェクト）を設定
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '【ご予約キャンセル】手続き完了のお知らせ',
        );
    }

    /**
     * 使用するブレードテンプレートの指定
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.reservation_cancelled',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
