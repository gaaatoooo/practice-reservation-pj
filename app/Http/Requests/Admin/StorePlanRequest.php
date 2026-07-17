<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StorePlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; 
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:1000', // ⭕️ description に修正
            'price' => 'required|integer',
            'status' => 'required|integer|in:1,2,3',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'プラン名は必須項目です。',
            'name.max' => 'プラン名は255文字以内で入力してください。',
            'description.required' => '内容は必須項目です。',
            'description.max' => '内容は1000文字以内で入力してください。',
            'price.required' => '価格は必須項目です。',
            'price.integer' => '価格は数字を入力してください。',
            'status.required' => 'ステータスは必須項目です。'
        ];
    }
}
