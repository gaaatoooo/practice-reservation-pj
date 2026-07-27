<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * roleが管理者(2)でないユーザーのアクセスを拒否する
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user() || $request->user()->role !== 2) {
            abort(403, 'このページへのアクセス権限がありません。');
        }

        return $next($request);
    }
}