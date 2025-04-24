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
use App\Http\Controllers\EleveController;
use App\Http\Controllers\RepetiteurController;
use App\Http\Controllers\CoursController;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/


// Authentification
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware(['auth:sanctum'])->group(function () {
    // Route pour récupérer les données de base de l'utilisateur
    Route::get('/user', [AuthController::class, 'getUser'])->middleware('auth:sanctum');



    // Routes spécifiques aux rôles
    Route::prefix('eleves')->group(function () {
        Route::get('/{id}', [EleveController::class, 'show']);
        // Ajoutez d'autres routes élèves ici...
    });

    Route::prefix('repetiteurs')->group(function () {
        Route::get('/{id}', [RepetiteurController::class, 'show']);
        // routes/api.php
        Route::put('/{id}', [RepetiteurController::class, 'update']);
    });

    Route::prefix('admins')->group(function () {
        Route::get('/{id}', [AdminController::class, 'show']);
        // Ajoutez d'autres routes admin ici...
    });
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user-with-profile', [AuthController::class, 'getUserWithProfile'])->middleware('auth:sanctum');
    // ... autres routes
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});

// Route::middleware('auth:sanctum')->get('/user-with-profile', function (Request $request) {
//     return response()->json([
//         'user' => $request->user(),
//         'profile' => $request->user()->repetiteur ?? $request->user()->eleve,
//     ]);
    
// });

//route de deconnexion
 Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');



// Routes protégées par Sanctum et vérification admin
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {

    // Dashboard
    Route::get('/stats', [AdminController::class, 'getStats']);
    Route::get('/recent-users', [AdminController::class, 'recentUsers']);

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
//Routes pour les cours

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/mes-cours', [CoursController::class, 'mesCours']);
    Route::get('/cours', [CoursController::class, 'index']);
    Route::post('/cours', [CoursController::class, 'store']);
    Route::get('/cours/{id}', [CoursController::class, 'show']);
    Route::put('/cours/{id}', [CoursController::class, 'update']);
    Route::delete('/cours/{id}', [CoursController::class, 'destroy']);
});
