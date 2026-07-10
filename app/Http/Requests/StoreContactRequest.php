<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreContactRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'email'   => 'required|email|max:255',
            'content' => 'required|string',
        ];
    }

    /**
     * エラーメッセージを分かりやすい日本語にカスタマイズ
     */
    public function messages(): array
    {
        return [
            'title.required' => 'お問合せ件名を入力してください。',
            'title.max'   => 'お問合せ件名は255文字以内で入力してください。',
            'email.required' => 'メールアドレスを入力してください。',
            'email.email' => '有効なメールアドレスを入力してください。',
            'email.max' => 'メールアドレスは255文字以内で入力してください。',
            'content.required' => 'お問合せ内容を入力してください。',
        ];
    }
}
