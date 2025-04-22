<?php

use App\Http\Controllers\MatiereController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RepetiteurController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
// Route::get('/user', fn(): Authenticatable|null => auth()->user())->middleware('auth:sanctum');
// Route::get('/details/{id}'[]);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Trouver un professeur
Route::get('/repetiteurs', [RepetiteurController::class, 'index']);
Route::get('/repetiteurs/search', [RepetiteurController::class, 'search']);

// Devenir professeur
Route::post('/repetiteurs/register', [RepetiteurController::class, 'register'])->middleware('auth:sanctum');
Route::get('/matieres', [MatiereController::class, 'index']);
