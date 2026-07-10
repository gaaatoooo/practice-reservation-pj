<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;

class StoreRoomRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; 
    }

    public function rules(): array
    {
        log::alert($this->input());

        return [
            'name' => 'required|string|max:255',
            'price' => 'required|integer',
            'capacity' => 'required|integer',
            'status' => 'required|integer|in:1,2',
            'description' => 'required|string|max:10000', // ⭕️ description に修正
            'url' =>'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:20480', // ⭕️ 画像バリデーションを追加(2MB以内)
            'total_rooms' => 'required|integer',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'フェアタイトルは必須項目です。',
            'name.max' => 'フェアタイトルは255文字以内で入力してください。',
            'price.required' => '価格を入力してください。',
            'capacity.required' => '宿泊可能人数を入力してください。',
            'status.required' => '公開状況を選択してください。',
            'description.required' => 'フェア内容（本文）は必須項目です。',
            'image.image' => '指定されたファイルは画像ではありません。',
            'image.mimes' => '画像の形式は jpeg, png, jpg, webp のいずれかにしてください。',
            'image.max' => '画像サイズは 2MB 以内にしてください。',
            'public_start_date.date' => '公開開始日は日付を入力してください。',
            'public_end_date.date' => '公開終了日は日付を入力してください。',
            'public_end_date.after' => '公開終了日は公開開始日以降の日付を入力してください。',
            'tootal_rooms.required' => '総部屋数を入力してください。'
        ];
    }
}
