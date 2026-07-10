<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class CategoryRequest extends FormRequest
{
    /**
     * リクエストの実行権限チェック
     */
    public function authorize(): bool
    {
        return true; // ⭕️ 認証ガードを通過していれば全員許可するため true に変更
    }

    /**
     * バリデーションルール
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:50',
        ];
    }

    /**
     * エラーメッセージの日本語化
     */
    public function messages(): array
    {
        return [
            'name.required' => 'カテゴリ名は必須項目です。',
            'name.max' => 'カテゴリ名は50文字以内で入力してください。',
        ];
    }
}
