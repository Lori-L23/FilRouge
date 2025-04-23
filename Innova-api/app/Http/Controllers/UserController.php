<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function show($id)
    {
        $user = User::with(['eleve', 'repetiteur', 'admin'])->findOrFail($id);
        
        return response()->json([
            'user' => $user,
            'profile' => $user->{$user->role} // Retourne la relation correspondante
        ]);
    }}
