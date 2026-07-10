<?php

namespace App\Mail;

use App\Models\Contact;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactReplyMail extends Mailable
{
    use Queueable, SerializesModels;

    public $contact;
    public $replyContent;

    public function __construct(Contact $contact, string $replyContent)
    {
        $this->contact = $contact;
        $this->replyContent = $replyContent;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '【当施設より】お問合せ内容についてのご回答',
        );
    }

    public function content(): Content
    {
        return new Content(
            text: 'emails.contact_reply', // テキスト版メールテンプレート
        );
    }
}
