<?php

namespace App\Http\Requests;

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
            'room_id' => ['required', 'exists:rooms,id'],
            'plan_id' => ['required', 'exists:plans,id'],
            'rating'  => ['required', 'integer', 'between:1,5'],
            'comment' => ['required', 'string', 'min:10', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'room_id.required' => '宿泊したお部屋を選択してください。',
            'plan_id.required' => '利用したプランを選択してください。',
            'rating.required'  => '評価の星マークを選択してください。',
            'rating.between'   => '評価は1から5の間で選択してください。',
            'comment.required' => '口コミ内容を入力してください。',
            'comment.min'      => '口コミ内容は10文字以上で入力してください。',
            'comment.max'      => '口コミ内容は1000文字以内で入力してください。',
        ];
    }
}
