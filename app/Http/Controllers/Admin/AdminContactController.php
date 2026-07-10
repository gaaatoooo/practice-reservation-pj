<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Mail\ContactReplyMail;
use Illuminate\Support\Facades\Mail;

class AdminContactController extends Controller
{
    const PAGINATION_COUNT = 10;

    /**
     * お問合せ一覧画面を表示する
     */
    public function index(Request $request): Response
    {
        $title = $request->query('title');
        $email = $request->query('email');

        $query = Contact::query()->with('target');

        // 🔍 検索フィルター処理
        if (!empty($title)) {
            $pat = '%' . addcslashes($title, '%_\\') . '%';
            $query->where('title', 'like', '%' . $pat . '%');
        }
        if (!empty($email)) {
            $pat = '%' . addcslashes($title, '%_\\') . '%';
            $query->where('email', 'like', '%' . $pat . '%');
        }

        // 💡 最新順に10件ずつページング（検索クエリを引き継ぐ）
        $contacts = $query->latest()->paginate(self::PAGINATION_COUNT)->withQueryString();

        // ⭕️ ページネーション構造を維持したまま、フロント用に別名プロパティをマッピング
        $contacts->through(function ($contact) {
            // リレーション経由で親のオブジェクトを安全に取得
            $targetContact = $contact->target;

            // フロントに渡すオブジェクトへ、指定の別名で値をインジェクト
            $contact->target_title   = $targetContact ? $targetContact->title : null;
            $contact->target_content = $targetContact ? $targetContact->content : null;

            return $contact;
        });

        return Inertia::render('Admin/ContactList', [
            'contacts' => $contacts,
            'filters'  => $request->only(['title', 'email']),
        ]);
    }

    /**
     * お問合せに対する返信メール送信処理
     */
    public function sendReply(Request $request, Contact $contact)
    {
        $validated = $request->validate([
            'reply_content' => 'required|string',
        ]);

        // 💡 1. 元のユーザーのお問合せを「返信済み(1)」に更新
        $contact->update([
            'is_replied' => 1
        ]);

        // 💡 2. 管理者からの返信内容を新しいレコード（type = 2）としてDBに履歴保存
        Contact::create([
            'type'       => 2, // 2: 管理者からの送信
            'email'      => $contact->email, // 送信先（ユーザー）のメアド
            'title'    => 'Re: ' . $contact->title, // 件名はそのまま（またはRe:を付与）
            'content'    => $validated['reply_content'],
            'is_replied' => 1, // 管理者発信なので最初から1
            'target_id'  => $contact->id, // 返信対象の問い合わせID
        ]);

        // 💡 3. 実際のメール送信を実行
        Mail::to($contact->email)->send(new ContactReplyMail($contact, $validated['reply_content']));

        // フラッシュメッセージでお知らせ（フロントエンドでのチェックマーク表示用）
        return redirect()->back()->with('success', '返信メールを送信しました。');
    }
}
