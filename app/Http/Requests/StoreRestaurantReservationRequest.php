<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRestaurantReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date'   => ['required', 'date', 'after_or_equal:today'],
            'time'   => ['required', 'string'],
            'number' => ['required', 'integer', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'date.required'        => '日付を選択してください。',
            'date.date'            => '日付の形式が正しくありません。',
            'date.after_or_equal'  => '過去の日付は選択できません。',

            'time.required' => '時間を選択してください。',

            'number.required' => '人数を入力してください。',
            'number.integer'  => '人数は数値で入力してください。',
            'number.min'      => '人数は1以上で入力してください。',
        ];
    }
}