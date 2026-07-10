<?php

namespace App\Http\Requests\Admin;

use App\Concerns\PasswordValidationRules;
use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    use PasswordValidationRules;

    /**
     * リクエストの実行権限チェック
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * バリデーションルール
     */
    public function rules(): array
    {
        // 2. フロントの hidden 欄（name="isSelf"）からフラグを取得
        $isSelf = $this->input('is_self');

        // 3. パスワードのバリデーションを適用するかどうかのフラグ
        // 条件：新規登録（POST）である、または、自分の編集画面かつパスワードが入力されている
        $hasPasswordInput = !blank($this->input('password'));
        $shouldValidatePassword = $this->isMethod('post') || ($isSelf && $hasPasswordInput);

        // 4. 条件に応じてパスワードのルールを動的に切り替え
        if ($shouldValidatePassword) {
            $passwordRules = $this->passwordRules();
            $passwordConfirmationRules = ['required', 'string'];
        } else {
            $this->offsetUnset('password');
            $this->offsetUnset('password_confirmation');
            
            // ルール自体も空にして検証を完全にスキップ
            $passwordRules = [];
            $passwordConfirmationRules = [];
        }

        if ($this->isMethod('post')) {
            // 新規登録時：単純な重複チェック
            $emailRules = ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email'];
        } else {
            // 編集時：現在のユーザーIDをルートから取得して重複チェックから除外
            $userId = $this->route('user')?->id ?? $this->route('user');
            $emailRules = ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email,' . $userId];
        }

        return [
            'name'     => ['required', 'string', 'max:255'],
            'email'    => $emailRules,
            'password' => $passwordRules,
            'password_confirmation' => $passwordConfirmationRules,
        ];
    }

    /**
     * エラーメッセージの日本語化
     */
    public function messages(): array
    {
        return [
            'name.required'  => '管理者名は必須項目です。',
            'name.max'       => '管理者名は255文字以内で入力してください。',
            'email.required' => 'メールアドレスを入力してください。',
            'email.email'    => '有効なメールアドレスを入力してください。',
            'email.max'      => 'メールアドレスは255文字以内で入力してください。',
            'password.required'  => 'パスワードを入力してください。',
            'password.confirmed' => 'パスワード（確認用）と一致しません。',
            'password_confirmation.required' => 'パスワード（確認用）を入力してください。',
        ];
    }
}
