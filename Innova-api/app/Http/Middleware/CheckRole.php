<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    public function handle(Request $request, Closure $next, string $role){
        if (!Auth::check()) {
            return response()->json(['message' => 'Authentification requise'], 401);
        }

        if (Auth::user()->role !== $role) {
            return response()->json(['message' => 'Accès non autorisé pour votre rôle'], 403);
        }
        

        return $next($request);
    }
}