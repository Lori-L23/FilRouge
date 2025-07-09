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
use App\Http\Controllers\TutorValidationControlleur;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ContributorController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ====================
// Routes Publiques
// ====================

// Authentification
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/validate-tutor', [TutorValidationControlleur::class, 'validateTutor']);
//contact
Route::post('/contact', [ContactController::class, 'submit']);
// Contributeurs
Route::post('/contributors', [ContributorController::class, 'store']);

// Ressources publiques
Route::prefix('matieres')->group(function () {
    Route::get('/', [MatiereController::class, 'index']);
    Route::get('/list', [MatiereController::class, 'publicList']);
    Route::get('/{id}', [MatiereController::class, 'show']);
});


Route::prefix('repetiteurs')->group(function () {
    Route::get('/', [UserController::class, 'getRepetiteurs']);
    Route::get('/search', [MatiereController::class, 'searchRep']);
    Route::get('/public/{id}', [RepetiteurController::class, 'publicShow']);
    Route::get('/{id}/cours', [RepetiteurController::class, 'getCoursByRepetiteur']);
});

// ====================
// Routes Authentifiées
// ====================
Route::middleware(['auth:sanctum'])->group(function () {

    // Gestion utilisateur
    Route::prefix('user')->group(function () {
        Route::get('/', [AuthController::class, 'getUser']);
        Route::get('/with-profile', [AuthController::class, 'getUserWithProfile']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });

    //contact
    Route::post('/contact', [ContactController::class, 'submit']);


    // Profil
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'show']);
        Route::put('/', [ProfileController::class, 'update']);
        Route::get('/eleve', [ProfileController::class, 'showEleve']);
        Route::get('/repetiteur', [ProfileController::class, 'showRepetiteur']);
        Route::get('/admin', [ProfileController::class, 'showAdmin']);
    });

    // Élèves
    Route::prefix('eleves')->group(function () {
        Route::get('/', [EleveController::class, 'index']);
        Route::post('/', [EleveController::class, 'store']);
        Route::get('/{id}', [EleveController::class, 'showWithReservations']);
        Route::put('/{id}', [EleveController::class, 'update']);
        Route::delete('/{id}', [EleveController::class, 'destroy']);
        Route::get('/{id}/reservations', [EleveController::class, 'getUserReservations']);
    });

    // Répétiteurs
    Route::prefix('repetiteurs')->group(function () {
        Route::get('/', [RepetiteurController::class, 'index']);
        Route::post('/', [RepetiteurController::class, 'store']);
        Route::get('/{id}', [RepetiteurController::class, 'show']);
        Route::put('/{id}', [RepetiteurController::class, 'update']);
        Route::get('/{id}/search', [RepetiteurController::class, 'search']);
        Route::get('/{id}/matieres', [RepetiteurController::class, 'getMatieresByRepetiteur']);
    });

    // Cours
    Route::prefix('cours')->group(function () {
        Route::get('/', [CoursController::class, 'index']);
        Route::post('/', [CoursController::class, 'store']);
        Route::get('/mes-cours', [CoursController::class, 'mesCours']);
        Route::get('/rep/{id}', [CoursController::class, 'show']);
        Route::put('/{id}', [CoursController::class, 'update']);
        Route::delete('/{id}', [CoursController::class, 'destroy']);
    });

    // Réservations
    Route::prefix('reservations')->group(function () {
        Route::get('/', [ReservationController::class, 'index']);
        Route::post('/', [ReservationController::class, 'store']);
        Route::get('/latest', [ReservationController::class, 'getLatestReservations']);
        Route::get('/{id}', [ReservationController::class, 'show']);
        Route::put('/{id}', [ReservationController::class, 'update']);
        Route::delete('/{id}', [ReservationController::class, 'destroy']);
        Route::patch('/{id}/status', [ReservationController::class, 'updateStatus']);
    });

    // Paiements
    Route::prefix('paiements')->group(function () {
        Route::get('/', [PaiementController::class, 'index']);
        Route::get('/summary', [PaiementController::class, 'summary']);
        Route::post('/process', [PaiementController::class, 'processPayment']);
        Route::get('/{id}', [PaiementController::class, 'show']);
        Route::patch('/{id}/status', [PaiementController::class, 'updateStatus']);
    });

    // Transactions
    Route::prefix('transactions')->group(function () {
        Route::post('/', [TransactionController::class, 'create']);
        Route::post('/{id}/confirm', [TransactionController::class, 'confirm']);
    });

    // Feedbacks
    Route::prefix('feedbacks')->group(function () {
        Route::get('/', [FeedbackController::class, 'index']);
        Route::post('/', [FeedbackController::class, 'store']);
        Route::get('/{id}', [FeedbackController::class, 'show']);
    });

    // Lieux
    Route::prefix('lieux')->group(function () {
        Route::get('/', [LieuController::class, 'index']);
        Route::post('/', [LieuController::class, 'store']);
        Route::get('/{id}', [LieuController::class, 'show']);
        Route::put('/{id}', [LieuController::class, 'update']);
        Route::delete('/{id}', [LieuController::class, 'destroy']);
    });

    // Disponibilités
    Route::prefix('disponibilites')->group(function () {
        Route::get('/repetiteurs/{user_id}/disponibilites', [DisponibiliteController::class, 'index']);
        Route::post('/', [DisponibiliteController::class, 'store']);
        Route::delete('/{id}', [DisponibiliteController::class, 'destroy']);
    });

    // Données
    Route::prefix('data')->group(function () {
        Route::get('/users', [DataController::class, 'getUsers']);
        Route::get('/eleves', [DataController::class, 'getEleves']);
        Route::get('/repetiteurs', [DataController::class, 'getRepetiteurs']);
        Route::get('/cours', [DataController::class, 'getCours']);
        Route::get('/reservations', [DataController::class, 'getReservations']);
        Route::get('/paiements', [DataController::class, 'getPaiements']);
    });

    // ====================
    // Routes Admin
    // ====================
    Route::middleware('can:admin')->prefix('admin')->group(function () {
        Route::get('/stats', [AdminController::class, 'getStats']);
        Route::get('/recent-users', [AdminController::class, 'recentUsers']);
        Route::get('/{id}', [AdminController::class, 'show']);

        // Rapports
        Route::prefix('reports')->group(function () {
            Route::get('/reservations', [AdminController::class, 'reservationsReport']);
            Route::get('/paiements', [AdminController::class, 'paiementsReport']);
            Route::get('/utilisateurs', [AdminController::class, 'usersReport']);
        });
    });
});
