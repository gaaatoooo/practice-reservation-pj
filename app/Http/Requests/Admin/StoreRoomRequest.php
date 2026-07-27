<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreRoomRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; 
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'price' => 'required|integer',
            'capacity' => 'required|integer',
            'status' => 'required|integer|in:1,2',
            'description' => 'required|string|max:1000', // ⭕️ description に修正
            'url' =>'nullable|string|url',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:20480', // ⭕️ 画像バリデーションを追加(20MB以内)
            'total_rooms' => 'required|integer',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => '部屋名は必須項目です。',
            'name.max' => '部屋名は255文字以内で入力してください。',
            'price.required' => '価格を入力してください。',
            'price.integer' => '価格は数字を入力してください。',
            'capacity.required' => '宿泊可能人数を入力してください。',
            'capacity.integer' => '宿泊可能人数は数字を入力してください。',
            'status.required' => '公開状況を選択してください。',
            'description.required' => '部屋内容は必須項目です。',
            'description.max' => '内容は1000文字以内で入力してください。',
            'url.url' => 'URL形式で入力してください。',
            'image.image' => '指定されたファイルは画像ではありません。',
            'image.mimes' => '画像の形式は jpeg, png, jpg, webp のいずれかにしてください。',
            'image.max' => '画像サイズは 20MB 以内にしてください。',
            'public_start_date.date' => '公開開始日は日付を入力してください。',
            'public_end_date.date' => '公開終了日は日付を入力してください。',
            'public_end_date.after' => '公開終了日は公開開始日以降の日付を入力してください。',
            'total_rooms.required' => '総部屋数を入力してください。',
            'total_rooms.integer' => '総部屋数は数字で入力してください。'
        ];
    }
}
