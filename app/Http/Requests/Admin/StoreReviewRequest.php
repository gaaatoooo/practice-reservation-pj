<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; 
    }

    public function rules(): array
    {
        return [
            'reply_content' => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'reply_content.max' => '返信内容は255文字以内で入力してください。',
        ];
    }
}
