<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Mail\ContactReceiptMail;
use App\Http\Requests\StoreContactRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    /**
     * 1. お問い合わせ入力画面を表示する
     */
    public function showForm(Request $request)
    {
        // 確認画面から「戻る」ボタンを押した際に、以前の入力値をフォームに復元する
        return Inertia::render('User/ContactForm', [
            'inputs' => [
                'title' => $request->input('title', ''),
                'email'   => $request->input('email', ''),
                'content' => $request->input('content', ''),
            ]
        ]);
    }

    /**
     * 2. 入力内容を受け取って「お問い合わせ確認画面」を表示する
     */
    public function showConfirm(StoreContactRequest $request)
    {
        // FormRequestのバリデーションを通過した安全なデータをそのまま確認画面のPropsへ引き渡す
        return Inertia::render('User/ContactConfirm', [
            'inputs' => $request->validated()
        ]);
    }

    /**
     * 3. 確認画面から「送信する」ボタンが押された時に、DBへ最終保存＆メール送信を行う処理
     */
    public function store(StoreContactRequest $request)
    {
        $validated = $request->validated();

        $validated['type'] = 1; // ユーザー

        // 1. contactsテーブルに保存
        $contact = Contact::create($validated);

        // 2. メール送信の実行
        Mail::to($contact->email)->send(new ContactReceiptMail($contact));

        // 3. 完了画面（サンクスページ）ヘリダイレクト
        return redirect()->route('contact.thanks')->with('from_store', true);
    }

    /**
     * 4. お問い合わせ完了画面（サンクスページ）を表示する
     */
    public function showThanks()
    {
        if (!session('from_store')) {
            return redirect()->route('contact.form'); 
        }

        return Inertia::render('User/ContactThanks');
    }
}
