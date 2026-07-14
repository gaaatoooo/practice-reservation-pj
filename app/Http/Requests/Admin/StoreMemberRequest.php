<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMemberRequest extends FormRequest
{
    /**
     * リクエストの実行権限チェック
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * バリデーションルール
     */
    public function rules(): array
    {
        // ルートパラメータから編集対象の会員IDを取得（/admin/members/{member} の値）
        $memberId = $this->route('member');

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users,email,' . $memberId
            ],
            'tel' => ['nullable', 'string', 'max:20'],
            'zip' => ['nullable', 'string', 'max:10'],
            'address' => ['nullable', 'string', 'max:255'],
            'sex' => ['nullable', 'string', 'in:1,2'],
            'birthday' => ['nullable', 'date'],
        ];
    }

    /**
     * エラーメッセージの日本語化
     */
    public function messages(): array
    {
        return [
            'name.required'  => '会員名は必須項目です。',
            'name.max'       => '会員名は255文字以内で入力してください。',
            'email.required' => 'メールアドレスを入力してください。',
            'email.email'    => '有効なメールアドレスを入力してください。',
            'email.max'      => 'メールアドレスは255文字以内で入力してください。',
            'tel.max'        => '電話番号は20文字以内で入力してください。',
            'zip.max'        => '郵便番号は10文字以内で入力してください。',
            'address.max'    => '住所は255文字以内で入力してください。',
        ];
    }
}
