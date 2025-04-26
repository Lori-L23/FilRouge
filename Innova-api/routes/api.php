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
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ---------------------------
// Routes Publiques
// ---------------------------

// Authentification
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Matières (publiques)
Route::get('/matieres/list', [MatiereController::class, 'publicList']);
Route::apiResource('matieres', MatiereController::class)->only(['index', 'show']);

// Recherche de répétiteurs
Route::get('/repetiteurs/search', [MatiereController::class, 'searchRep']);
Route::get('/repetiteurs', [UserController::class, 'getRepetiteurs']);

// Affichage public d'un répétiteur
Route::get('/repetiteurs/{id}/public', [RepetiteurController::class, 'publicShow']);

// ---------------------------
// Routes Protégées (Authentifiées)
// ---------------------------
Route::middleware(['auth:sanctum'])->group(function () {

    // Gestion utilisateur connecté
    Route::get('/user', [AuthController::class, 'getUser']);
    Route::get('/user-with-profile', [AuthController::class, 'getUserWithProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Élèves
    Route::prefix('eleves')->group(function () {
        Route::get('/{id}', [EleveController::class, 'show']);
        Route::put('/{id}', [EleveController::class, 'update']);
        Route::delete('/{id}', [EleveController::class, 'destroy']);
        Route::post('/', [EleveController::class, 'store']);
        Route::get('/', [EleveController::class, 'index']);
    });

    // Répétiteurs
    Route::prefix('repetiteurs')->group(function () {
        Route::get('/{id}', [RepetiteurController::class, 'show']);
        Route::put('/{id}', [RepetiteurController::class, 'update']);
        Route::get('/{id}/search', [RepetiteurController::class, 'search']);
    });

    // Admins
    Route::prefix('admins')->group(function () {
        Route::get('/{id}', [AdminController::class, 'show']);
    });

    // Gestion des Cours
    Route::prefix('cours')->group(function () {
        Route::get('/mes-cours', [CoursController::class, 'mesCours']);
        Route::get('/', [CoursController::class, 'index']);
        Route::post('/', [CoursController::class, 'store']);
        Route::get('/{id}', [CoursController::class, 'show']);
        Route::put('/{id}', [CoursController::class, 'update']);
        Route::delete('/{id}', [CoursController::class, 'destroy']);
    });

    // Réservations
    Route::apiResource('reservations', ReservationController::class);
    Route::patch('/reservations/{id}/status', [ReservationController::class, 'updateStatus']);

    // Paiements
    Route::apiResource('paiements', PaiementController::class)->only(['index', 'show']);
    Route::patch('/paiements/{id}/status', [PaiementController::class, 'updateStatus']);
    Route::get('/paiements/summary', [PaiementController::class, 'summary']);

    // Feedbacks
    Route::apiResource('feedbacks', FeedbackController::class)->except(['update', 'destroy']);

    // Dashboard Admin (protégé par Policy can:admin)
    Route::prefix('admin')->middleware('can:admin')->group(function () {
        Route::get('/stats', [AdminController::class, 'getStats']);
        Route::get('/recent-users', [AdminController::class, 'recentUsers']);
        Route::get('/reservations/latest', [AdminController::class, 'getLatestReservations']);

        // Rapports
        Route::prefix('reports')->group(function () {
            Route::get('/reservations', [AdminController::class, 'reservationsReport']);
            Route::get('/paiements', [AdminController::class, 'paiementsReport']);
            Route::get('/utilisateurs', [AdminController::class, 'usersReport']);
        });
    });
});
