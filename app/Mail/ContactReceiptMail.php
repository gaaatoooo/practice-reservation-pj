<?php

namespace App\Mail;

use App\Models\Contact;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactReceiptMail extends Mailable
{
    use Queueable, SerializesModels;

    public $contact; // 💡 テンプレートに渡す変数

    public function __construct(Contact $contact)
    {
        $this->contact = $contact;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '【自動配信】お問い合わせを受け付けいたしました',
        );
    }

    public function content(): Content
    {
        return new Content(
            // 💡 テキストメールのテンプレートを指定
            text: 'emails.contact_receipt', 
        );
    }
}
