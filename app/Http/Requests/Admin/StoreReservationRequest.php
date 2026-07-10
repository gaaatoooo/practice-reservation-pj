<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreReservationRequest extends FormRequest
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
            'user_id'                => ['required', 'exists:users,id'],
            'room_id'                => ['required', 'exists:rooms,id'],
            'plan_id'                => ['required', 'exists:plans,id'],
            'reservation_start_date' => ['required', 'date'],
            // チェックアウト日はチェックイン日より後の日付であることを保証
            'reservation_end_date'   => ['required', 'date', 'after:reservation_start_date'],
            'status'                 => ['required', 'in:1,2'], // 1: 確定, 2: キャンセル済
            'total_price'            => ['required', 'integer', 'min:0'],
            'admin_memo'             => ['nullable', 'string', 'max:5000'],
            'number'                 => ['required', 'integer', 'min:1'],
        ];
    }

    /**
     * エラーメッセージの日本語カスタマイズ
     */
    public function messages(): array
    {
        return [
            'user_id.required'                => '顧客アカウントを選択してください。',
            'user_id.exists'                  => '選択された顧客アカウントは無効です。',
            'room_id.required'                => 'お部屋を選択してください。',
            'room_id.exists'                  => '選択されたお部屋は無効です。',
            'plan_id.required'                => '宿泊プランを選択してください。',
            'plan_id.exists'                  => '選択されたプランは無効です。',
            'reservation_start_date.required' => 'チェックイン日を入力してください。',
            'reservation_start_date.date'     => 'チェックイン日は正しい日付形式で入力してください。',
            'reservation_end_date.required'   => 'チェックアウト日を入力してください。',
            'reservation_end_date.date'       => 'チェックアウト日は正しい日付形式で入力してください。',
            'reservation_end_date.after'      => 'チェックアウト日はチェックイン日より後の日付にしてください。',
            'total_price.required'            => '合計金額を入力してください。',
            'total_price.integer'             => '合計金額は数値で入力してください。',
            'total_price.min'                 => '合計金額は0円以上にしてください。',
            'admin_memo.max'                  => '管理者メモは5000文字以内で入力してください。',
            'number.required'                 => '人数を入力してください。',
            'number.integer'                  => '人数は数値で入力してください。',
        ];
    }
}
