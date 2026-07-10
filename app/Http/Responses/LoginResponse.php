<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class LoginResponse implements LoginResponseContract
{
    /**
     * ⭕️ ログイン成功時のリダイレクト先を権限に応じて動的に制御する
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function toResponse($request)
    {
        // 1. ログインしたユーザーオブジェクトを取得
        $user = Auth::user();

        // 2. 権限(role)による条件分岐
        if ($user && $user->role === 2) {
            // 管理者(2)の場合は、管理側ダッシュボードへリダイレクト
            return redirect()->intended(route('admin.dashboard'));
        }

        // 一般ユーザー(1)、またはそれ以外の場合はユーザー用マイページへリダイレクト
        return redirect()->intended(route('user.dashboard'));
    }
}