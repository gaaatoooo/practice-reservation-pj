<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRestaurantStockRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date'   => ['required', 'date'],
            'time'   => ['required', 'string'],
            'capacity' => ['required', 'integer', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'date.required' => '日付を選択してください。',
            'date.date'     => '日付の形式が正しくありません。',

            'time.required' => '時間を選択してください。',

            'capacity.required' => '人数を入力してください。',
            'capacity.integer'  => '人数は数値で入力してください。',
            'capacity.min'      => '人数は1以上で入力してください。',
        ];
    }
}