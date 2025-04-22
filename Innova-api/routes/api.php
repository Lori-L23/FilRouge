<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MatiereController;
use App\Http\Controllers\PaiementController;
use App\Http\Controllers\FeedbackController;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Authentification
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Routes protégées par Sanctum et vérification admin
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    
    // Dashboard
    Route::get('/stats', [AdminController::class, 'getStats']);
    Route::get('/reservations/latest', [AdminController::class, 'getLatestReservations']);
    
    // Utilisateurs
    // Route::apiResource('users', UserController::class)->except(['store']);
    // Route::get('/users/search', [UserController::class, 'search']);
    // Route::put('/users/{id}', [UserController::class, 'update']);
    // Route::delete('/users/{id}', [UserController::class, 'destroy']);
    // Route::get('/users/search', [UserController::class, 'search']);
    
// Réservations
Route::apiResource('reservations', ReservationController::class);
Route::patch('/reservations/{id}/status', [ReservationController::class, 'updateStatus']);
    
 // Paiements
 Route::apiResource('paiements', PaiementController::class)->only(['index', 'show']);
 Route::patch('/paiements/{id}/status', [PaiementController::class, 'updateStatus']);
 Route::get('/paiements/summary', [PaiementController::class, 'summary']);
 
 // Matières
 Route::apiResource('matieres', MatiereController::class);
 
 // Rapports
 Route::prefix('reports')->group(function () {
     Route::get('/reservations', [AdminController::class, 'reservationsReport']);
     Route::get('/paiements', [AdminController::class, 'paiementsReport']);
     Route::get('/utilisateurs', [AdminController::class, 'usersReport']);
});

// Routes publiques
Route::get('/matieres/list', [MatiereController::class, 'publicList']);
// Route::get('/repetiteurs', [UserController::class, 'getRepetiteurs']);

//feedbacks
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/feedbacks', [FeedbackController::class, 'store']);
    Route::get('/feedbacks', [FeedbackController::class, 'index']);
});
});


