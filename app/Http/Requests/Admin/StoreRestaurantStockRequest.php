<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreRestaurantStockRequest extends FormRequest
{
    /**
     * リクエストの実行権限を判定（管理者は常にtrue、必要に応じて認証チェックを追加）
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * バリデーションルールの定義
     */
    public function rules(): array
    {
        return [
            'date'      => ['required', 'date'],
            'times'     => ['required', 'array', 'min:1'],
            'times.*'   => ['string', 'in:' . implode(',', config('constants.Restaurant.Times'))],
            'capacity'  => ['required', 'integer', 'min:1'],
        ];
    }

    /**
     * エラーメッセージの日本語カスタマイズ
     */
    public function messages(): array
    {
        return [
            'date.required' => '日付を選択してください。',
            'date.date'     => '日付の形式が正しくありません。',

            'times.required' => '時間を1つ以上選択してください。',
            'times.array'    => '時間の形式が正しくありません。',
            'times.min'      => '時間を1つ以上選択してください。',

            'capacity.required' => '人数を入力してください。',
            'capacity.integer'  => '人数は数値で入力してください。',
            'capacity.min'      => '人数は1以上で入力してください。',
        ];
    }
}