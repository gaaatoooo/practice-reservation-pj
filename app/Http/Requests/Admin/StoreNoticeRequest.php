<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;

class StoreNoticeRequest extends FormRequest
{
    /**
     * リクエストの実行権限チェック
     */
    public function authorize(): bool
    {
        return true; // ⭕️ true に変更（ミドルウェア等でガードしているため）
    }

    /**
     * バリデーションルール
     */
    public function rules(): array
    {
        log::alert($this->input());

        return [
            'title' => 'required|string|max:255',
            'category' => 'required|integer|in:1,2,3', // 1=重要, 2=イベント, 3=案内
            'status' => 'required|integer|in:1,2,3',   // 1=下書き, 2=公開, 3=非公開
            'content' => 'required|string|max:10000',
            'public_start_date' => 'nullable|date',
            'public_end_date' => 'nullable|date|after:public_start_date',
        ];
    }

    /**
     * エラーメッセージの日本語化カスタム
     */
    public function messages(): array
    {
        return [
            'title.required' => 'タイトルは必須項目です。',
            'title.max' => 'タイトルは255文字以内で入力してください。',
            'category.required' => 'カテゴリを選択してください。',
            'status.required' => '公開ステータスを選択してください。',
            'content.required' => '本文は必須項目です。',
            'public_start_date.date' => '公開開始日は日付を入力してください。',
            'public_end_date.date' => '公開終了日は日付を入力してください。',
            'public_end_date.after' => '公開終了日は公開開始日以降の日付を入力してください。',
        ];
    }
}
