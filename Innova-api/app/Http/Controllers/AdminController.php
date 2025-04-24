<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Reservation;
use App\Models\Cours;
use App\Models\Paiement;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AdminController extends Controller
{
    // Statistiques optimisées pour le dashboard
    public function getStats(Request $request)
    {
        $period = $request->only(['start_date', 'end_date']);
        
        return response()->json([
            'stats' => [
                'users' => [
                    'total' => User::count(),
                    'eleves' => User::where('role', 'eleve')->count(),
                    'repetiteurs' => User::where('role', 'repetiteur')->count(),
                    'admins' => User::where('role', 'admin')->count(),
                ],
                'reservations' => $this->getReservationStats($period),
                'paiements' => $this->getPaiementStats($period),
            ],
            'latest_reservations' => Reservation::with(['eleve.user', 'repetiteur.user'])
                ->latest()
                ->take(5)
                ->get()
        ]);
    }

    protected function getReservationStats($period)
    {
        return [
            'total' => Reservation::filterByPeriod($period)->count(),
            'completed' => Reservation::where('statut', 'completed')
                ->filterByPeriod($period)
                ->count(),
            'pending' => Reservation::where('statut', 'pending')
                ->filterByPeriod($period)
                ->count(),
        ];
    }

    protected function getPaiementStats($period)
    {
        return [
            'total' => Paiement::filterByPeriod($period)->count(),
            'completed' => Paiement::where('statut', 'completed')
                ->filterByPeriod($period)
                ->sum('montant'),
            'pending' => Paiement::where('statut', 'pending')
                ->filterByPeriod($period)
                ->count(),
        ];
    }

    public function stats()
{
    return response()->json([
        'eleves' => User::where('role', 'eleve')->count(),
        'repetiteurs' => User::where('role', 'repetiteur')->count(),
        'cours' => Cours::count(),
        'paiements' => Paiement::count()
    ]);
}

public function recentUsers()
{
    return User::orderBy('created_at', 'desc')
               ->limit(10)
               ->get(['id', 'nom', 'prenom', 'email', 'telephone', 'role', 'created_at']);
}
}