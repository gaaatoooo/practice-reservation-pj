<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class BasicAuthMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->getUser();
        $password = $request->getPassword();

        if ($user !== env('BASIC_AUTH_USER') || $password !== env('BASIC_AUTH_PASSWORD')) {
            return response('Unauthorized.', 401, [
                'WWW-Authenticate' => 'Basic realm="Restricted Area"',
            ]);
        }

        return $next($request);
    }
}