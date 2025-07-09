<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Reservation;
use App\Models\Repetiteur;
use App\Models\Eleve;
use App\Models\Cours;
use App\Models\Paiement;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AdminController extends Controller
{
    // // Statistiques optimisées pour le dashboard
    public function getStats(Request $request)
    {
        // Dates de filtrage
        $startDate = $request->input('start_date')
            ? Carbon::parse($request->input('start_date'))
            : Carbon::now()->subMonth();

        $endDate = $request->input('end_date')
            ? Carbon::parse($request->input('end_date'))
            : Carbon::now();

        // Calcul des statistiques
        $stats = [
            'users_count' => User::count(),
            'eleves_count' => Eleve::count(),
            'repetiteurs_count' => Repetiteur::count(),
            'reservations_count' => Reservation::whereBetween('created_at', [$startDate, $endDate])->count(),
            'completed_sessions' => Reservation::where('statut', 'acceptee')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->count(),
            'revenue' => Paiement::where('statut', 'complet')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->sum('montant'),
            'pending_reservations' => Reservation::where('statut', 'en_attente')->count(),
        ];

        return response()->json($stats);
    }


    public function getLatestReservations(Request $request)
    {
        // Dates de filtrage
        $startDate = $request->input('start_date')
            ? Carbon::parse($request->input('start_date'))
            : Carbon::now()->subMonth();

        $endDate = $request->input('end_date')
            ? Carbon::parse($request->input('end_date'))
            : Carbon::now();

        $reservations = Reservation::with(['eleve', 'repetiteur'])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json($reservations);
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

    //     public function stats()
    // {
    //     return response()->json([
    //         'eleves' => User::where('role', 'eleve')->count(),
    //         'repetiteurs' => User::where('role', 'repetiteur')->count(),
    //         'cours' => Cours::count(),
    //         'paiements' => Paiement::count()
    //     ]);
    // }

    public function recentUsers()
    {
        return User::orderBy('created_at', 'desc')
            ->limit(10)
            ->get(['id', 'nom', 'prenom', 'email', 'telephone', 'role', 'created_at']);
    }

    private function getAIFeedback(string $bio): array
    {
        $client = new \GuzzleHttp\Client();
        $response = $client->post('https://api.openai.com/v1/chat/completions', [
            'headers' => [
                'Authorization' => 'Bearer ' . env('OPENAI_API_KEY'),
                'Content-Type' => 'application/json'
            ],
            'json' => [
                'model' => 'gpt-3.5-turbo',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => "Analyse cette biographie de professeur. Identifie 3 points forts et 3 points à améliorer. Sois concis."
                    ],
                    [
                        'role' => 'user',
                        'content' => $bio
                    ]
                ],
                'temperature' => 0.7
            ]
        ]);

        return json_decode($response->getBody(), true);
    }
}
