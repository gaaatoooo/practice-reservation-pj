<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreReservationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'room_id' => 'required|exists:rooms,id',
            'plan_id' => 'required|exists:plans,id',
            'reservation_start_date' => 'required|date|after_or_equal:today', // ⭕️ 今日以降の日付のみ許可
            'reservation_end_date' => 'required|date|after:reservation_start_date', // チェックイン日より後の日付のみ許可
            'number' => 'required|integer|min:1',
            'is_other_guest' => 'required|boolean',
            'guest_name' => 'required_if:is_other_guest,true|nullable|string|max:255',
            'guest_tel' => 'required_if:is_other_guest,true|nullable|string|max:20',
            'guest_zip' => 'nullable|string|max:10',
            'guest_address' => 'nullable|string|max:255',
            'guest_birthday' => 'nullable|date',
        ];
    }

    /**
     * ⭕️ 追記：エラーメッセージを分かりやすい日本語にカスタマイズ
     */
    public function messages(): array
    {
        return [
            'room_id.required' => 'お部屋タイプが選択されていません。一覧からご希望のお部屋をお選びください。',
            'room_id.exists'   => '選択されたお部屋は無効、または現在公開されていません。',
        ];
    }
}
