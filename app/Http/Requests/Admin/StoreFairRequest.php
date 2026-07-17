<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreFairRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; 
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'category' => 'required|integer',
            'status' => 'required|integer|in:1,2,3',
            'description' => 'required|string|max:1000', // ⭕️ description に修正
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:20480', // ⭕️ 画像バリデーションを追加(2MB以内)
            'public_start_date' => 'nullable|date',
            'public_end_date' => 'nullable|date|after:public_start_date',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'タイトルは必須項目です。',
            'title.max' => 'タイトルは255文字以内で入力してください。',
            'category.required' => 'カテゴリを選択してください。',
            'status.required' => '公開状況を選択してください。',
            'description.required' => '内容は必須項目です。',
            'description.max' => '内容は1000文字以内で入力してください。',
            'image.image' => '指定されたファイルは画像ではありません。',
            'image.mimes' => '画像の形式は jpeg, png, jpg, webp のいずれかにしてください。',
            'image.max' => '画像サイズは 20MB 以内にしてください。',
            'public_start_date.date' => '公開開始日は日付を入力してください。',
            'public_end_date.date' => '公開終了日は日付を入力してください。',
            'public_end_date.after' => '公開終了日は公開開始日以降の日付を入力してください。',
        ];
    }
}
