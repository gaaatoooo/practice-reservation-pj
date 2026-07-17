<?php

namespace App\Concerns;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait ProfileValidationRules
{
    /**
     * Get the validation rules used to validate user profiles.
     *
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function profileRules(?int $userId = null): array
    {
        return [
            'name' => $this->nameRules(),
            'email' => $this->emailRules($userId),

            'tel' => ['required', 'string', 'max:20', 'regex:/^[0-9]+$/'], // 電話番号（数字のみ）
            'zip' => ['required', 'string', 'max:10', 'regex:/^\d{7}$/'], // 郵便番号（ハイフンなし）
            'address' => ['required', 'string', 'max:500'], // 住所
            'sex' => ['required', 'integer', 'in:1,2,3'], // 性別（1:男性, 2:女性, 3:その他）
            'birthday' => ['required', 'date', 'before:today'], // 生年月日（本日以前の日付）
        ];
    }

    /**
     * Get the validation rules used to validate user names.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function nameRules(): array
    {
        return ['required', 'string', 'max:255'];
    }

    /**
     * Get the validation rules used to validate user emails.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function emailRules(?int $userId = null): array
    {
        return [
            'required',
            'string',
            'email',
            'max:255',
            $userId === null
                ? Rule::unique(User::class)
                : Rule::unique(User::class)->ignore($userId),
        ];
    }

    /**
     * エラーメッセージの日本語化
     */
    public function messages(): array
    {
        return [
            // 名前
            'name.required'  => '名前は必須項目です。',
            'name.string'    => '名前は文字列で入力してください。',
            'name.max'       => '名前は255文字以内で入力してください。',

            // メールアドレス
            'email.required' => 'メールアドレスを入力してください。',
            'email.string'   => 'メールアドレスは文字列で入力してください。',
            'email.email'    => '有効なメールアドレスを入力してください。',
            'email.max'      => 'メールアドレスは255文字以内で入力してください。',
            'email.unique'   => 'このメールアドレスは既に登録されています。',

            // 電話番号
            'tel.required' => '電話番号を入力してください。',
            'tel.string'   => '電話番号は文字列で入力してください。',
            'tel.max'      => '電話番号は20文字以内で入力してください。',
            'tel.regex'    => '電話番号は数字のみで入力してください。',

            // 郵便番号
            'zip.required' => '郵便番号を入力してください。',
            'zip.string'   => '郵便番号は文字列で入力してください。',
            'zip.max'      => '郵便番号は10文字以内で入力してください。',
            'zip.regex'    => '郵便番号はハイフンなしの7桁の数字で入力してください。',

            // 住所
            'address.required' => '住所を入力してください。',
            'address.string'   => '住所は文字列で入力してください。',
            'address.max'      => '住所は500文字以内で入力してください。',

            // 性別
            'sex.required' => '性別を選択してください。',
            'sex.integer'  => '性別の値が不正です。',
            'sex.in'       => '性別の値が不正です。',

            // 生年月日
            'birthday.required' => '生年月日を入力してください。',
            'birthday.date'     => '生年月日は正しい日付形式で入力してください。',
            'birthday.before'   => '生年月日は本日より前の日付を入力してください。',

            // パスワード
            'password.required'  => 'パスワードを入力してください。',
            'password.confirmed' => 'パスワード（確認用）と一致しません。',
            'password_confirmation.required' => 'パスワード（確認用）を入力してください。',
        ];
    }
}
