<?php

namespace App\Concerns;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait ProfileValidationRules
{
    /**
     * Get the validation rules used to validate user profiles.
     *
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function profileRules(?int $userId = null): array
    {
        return [
            'name' => $this->nameRules(),
            'email' => $this->emailRules($userId),

            'tel' => ['required', 'string', 'max:20', 'regex:/^[0-9-]+$/'], // 電話番号（数字とハイフンのみ）
            'zip' => ['required', 'string', 'max:10', 'regex:/^\d{3}-\d{4}$|^\d{7}$/'], // 郵便番号（ハイフンあり・なし両対応）
            'address' => ['required', 'string', 'max:500'], // 住所
            'sex' => ['required', 'integer', 'in:1,2,3'], // 性別（1:男性, 2:女性, 3:その他）
            'birthday' => ['required', 'date', 'before:today'], // 生年月日（本日以前の日付）
        ];
    }

    /**
     * Get the validation rules used to validate user names.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function nameRules(): array
    {
        return ['required', 'string', 'max:255'];
    }

    /**
     * Get the validation rules used to validate user emails.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function emailRules(?int $userId = null): array
    {
        return [
            'required',
            'string',
            'email',
            'max:255',
            $userId === null
                ? Rule::unique(User::class)
                : Rule::unique(User::class)->ignore($userId),
        ];
    }
}
