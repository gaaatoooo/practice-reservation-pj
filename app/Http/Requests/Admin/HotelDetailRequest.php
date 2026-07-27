<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class HotelDetailRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; 
    }

    public function rules(): array
{
    return [
        'postal_code'     => ['required', 'string', 'max:10', 'regex:/^\d{3}-\d{4}$/'], // 郵便番号（ハイフンあり 例: 123-4567）
        'address'         => ['required', 'string', 'max:500'],
        'tel'             => ['required', 'string', 'max:20', 'regex:/^0\d{1,4}-\d{1,4}-\d{4}$/'], // 電話番号（ハイフンあり 例: 03-1234-5678）
        'email'           => ['required', 'string', 'email', 'max:255'],
        'check_in_time'   => ['required', 'date_format:H:i'],
        'check_out_time'  => ['required', 'date_format:H:i'],
        'description'     => ['required', 'string', 'max:1000'],
        'amenities'       => ['nullable', 'string', 'max:1000'],
        'access_info'     => ['nullable', 'string', 'max:1000'],
        'child_policy'    => ['nullable', 'string', 'max:1000'],
        'parking_info'    => ['nullable', 'string', 'max:1000'],
        'cancel_policy'   => ['nullable', 'string', 'max:1000'],
    ];
}

public function messages(): array
{
    return [
        'postal_code.required' => '郵便番号を入力してください。',
        'postal_code.max'      => '郵便番号は10文字以内で入力してください。',
        'postal_code.regex'    => '郵便番号は「123-4567」の形式（ハイフンあり）で入力してください。',

        'address.required' => '住所を入力してください。',
        'address.max'      => '住所は500文字以内で入力してください。',

        'tel.required' => '電話番号を入力してください。',
        'tel.max'      => '電話番号は20文字以内で入力してください。',
        'tel.regex'    => '電話番号は「03-1234-5678」のようなハイフン区切りの形式で入力してください。',

        'email.required' => 'メールアドレスを入力してください。',
        'email.email'    => '有効なメールアドレスを入力してください。',
        'email.max'      => 'メールアドレスは255文字以内で入力してください。',

        'check_in_time.required'    => 'チェックイン時間を入力してください。',
        'check_in_time.date_format' => 'チェックイン時間はHH:MM形式で入力してください。',

        'check_out_time.required'    => 'チェックアウト時間を入力してください。',
        'check_out_time.date_format' => 'チェックアウト時間はHH:MM形式で入力してください。',

        'description.required' => '施設説明は必須項目です。',
        'description.max'      => '施設説明は1000文字以内で入力してください。',

        'amenities.max'     => '設備・アメニティは1000文字以内で入力してください。',
        'access_info.max'   => 'アクセス情報は1000文字以内で入力してください。',
        'child_policy.max'  => '子供に関するポリシーは1000文字以内で入力してください。',
        'parking_info.max'  => '駐車場情報は1000文字以内で入力してください。',
        'cancel_policy.max' => 'キャンセルポリシーは1000文字以内で入力してください。',
    ];
}
}
