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
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DisponibiliteController;
use App\Http\Controllers\DataController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\LieuController;




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
Route::apiResource('matieres', MatiereController::class)->only(['show']);
Route::get('/matieres', [MatiereController::class, 'index']);

// Recherche de répétiteurs
Route::get('/repetiteurs/search', [MatiereController::class, 'searchRep']);
Route::get('/repetiteurs', [UserController::class, 'getRepetiteurs']);
Route::get('/repetiteurs/${user.id}/cours', [RepetiteurController::class, 'getcours']);

// Affichage public d'un répétiteur
Route::get('/repetiteurs/{id}/public', [RepetiteurController::class, 'publicShow']);

Route::group(['middleware' => ['auth:sanctum']], function () {
    // Disponibilités
    Route::get('/repetiteurs/{user}/disponibilites', [DisponibiliteController::class, 'index']);
    Route::post('/disponibilites', [DisponibiliteController::class, 'store']);
    Route::delete('/disponibilites/{id}', [DisponibiliteController::class, 'destroy']);
});

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin/stats', [AdminController::class, 'getStats']);
    Route::get('/admin/reservations/latest', [AdminController::class, 'getLatestReservations']);
});
Route::post('/transactions', [TransactionController::class, 'create'])->middleware('auth:sanctum');
Route::post('/transactions/{id}/confirm', [TransactionController::class, 'confirm'])->middleware('auth:sanctum');

Route::group(['middleware' => 'auth:sanctum'], function() {
    // Récupérer tous les lieux de l'utilisateur
    Route::get('/lieux', [LieuController::class, 'index']);
    
    // Créer un nouveau lieu
    Route::post('/lieux', [LieuController::class, 'store']);
    
    // Récupérer un lieu spécifique
    Route::get('/lieux/{id}', [LieuController::class, 'show']);
    
    // Mettre à jour un lieu
    Route::put('/lieux/{id}', [LieuController::class, 'update']);
    
    // Supprimer un lieu
    Route::delete('/lieux/{id}', [LieuController::class, 'destroy']);
});
// ---------------------------
// Routes Protégées (Authentifiées)
// ---------------------------
Route::middleware(['auth:sanctum'])->group(function () {

    // Gestion utilisateur connecté
    Route::get('/user', [AuthController::class, 'getUser']);
    Route::get('/user-with-profile', [AuthController::class, 'getUserWithProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/user/{id}/role', [AuthController::class, 'updateRole']);

    // Élèvesp
    Route::prefix('eleves')->group(function () {
        Route::get('/{id}', [EleveController::class, 'showWithReservations']);
        Route::put('/{id}', [EleveController::class, 'update']);
        Route::delete('/{id}', [EleveController::class, 'destroy']);
        Route::post('/', [EleveController::class, 'store']);
        Route::get('/', [EleveController::class, 'index']);
        Route::get('/{id}/reservations', [EleveController::class, 'getUserReservations']);
    });
    // Profil de l'utilisateur connecté
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::get('/profile/eleve', [ProfileController::class, 'showEleve']);
    Route::get('/profile/repetiteur', [ProfileController::class, 'showRepetiteur']);
    Route::get('/profile/admin', [ProfileController::class, 'showAdmin']);
    Route::put('/profile', [ProfileController::class, 'update']);


    // Répétiteurs
    Route::prefix('repetiteurs')->group(function () {
        Route::get('/{id}', [RepetiteurController::class, 'show']);
        Route::put('/{id}', [RepetiteurController::class, 'update']);
        Route::get('/{id}/search', [RepetiteurController::class, 'search']);
        Route::post('/', [RepetiteurController::class, 'store']);
        Route::get('/', [RepetiteurController::class, 'index']);
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
    Route::get('/reservations/latest', [ReservationController::class, 'getLatestReservations']);
    Route::apiResource('reservations', ReservationController::class);
    Route::patch('/reservations/{id}/status', [ReservationController::class, 'updateStatus']);


    // Paiements
    Route::apiResource('paiements', PaiementController::class)->only(['show']);
    Route::patch('/paiements/{id}/status', [PaiementController::class, 'updateStatus']);
    Route::get('/paiements', [PaiementController::class, 'index']);
    Route::get('/paiements/summary', [PaiementController::class, 'summary']);
    Route::post('/paiements/process', [PaiementController::class, 'processPayment']);

    // Feedbacks
    Route::apiResource('feedbacks', FeedbackController::class)->except(['update', 'destroy']);


    // Admin 
    Route::prefix('admin')->middleware('can:admin')->group(function () {
        // Route::get('/stats', [AdminController::class, 'getStats']);
        Route::get('/recent-users', [AdminController::class, 'recentUsers']);
        // Route::get('/reservations/latest', [AdminController::class, 'getLatestReservations']);
        Route::get('/{id}', [AdminController::class, 'show']);


        // Rapports
        Route::prefix('reports')->group(function () {
            Route::get('/reservations', [AdminController::class, 'reservationsReport']);
            Route::get('/paiements', [AdminController::class, 'paiementsReport']);
            Route::get('/utilisateurs', [AdminController::class, 'usersReport']);
        });
    });

    Route::middleware(['auth:sanctum'])->group(function () {
        Route::get('/users', [DataController::class, 'getUsers']);
        Route::get('/eleves', [DataController::class, 'getEleves']);
        Route::get('/repetiteurs', [DataController::class, 'getRepetiteurs']);
        Route::get('/cours', [DataController::class, 'getCours']);
        Route::get('/reservations', [DataController::class, 'getReservations']);
        Route::get('/paiements', [DataController::class, 'getPaiements']);
    });
});
