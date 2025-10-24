<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Eleve;
use App\Models\Repetiteur;
use App\Models\Cours;
use App\Models\Reservation;
use App\Models\Paiement;
use App\Models\Matiere;
use Illuminate\Http\Request;

class DataController extends Controller
{
    public function getUsers()
    {
        $users = User::all();
        return response()->json($users);
    }

    public function getEleves()
    {
        $eleves = Eleve::with('user')->get();
        return response()->json($eleves);
    }

    public function getRepetiteurs()
    {
        $repetiteurs = Repetiteur::with('user')->get();
        return response()->json($repetiteurs);
    }

    public function getCours()
    {
        $cours = Cours::with(['matiere', 'repetiteur.user'])->get();
        return response()->json($cours);
    }

    public function getReservations()
    {
        $reservations = Reservation::with(['eleve.user', 'repetiteur.user'])->get();
        return response()->json($reservations);
    }

    public function getPaiements()
{
    try {
        $paiements = Paiement::with([
            'reservation.eleve.user',
            'reservation.repetiteur.user', 
            'reservation.cours',
            'eleve.user'
        ])
        ->select([
            'id',
            'reservation_id', 
            'user_id',
            'montant',
            'methode',
            'statut',
            'transaction_id',
            'date_paiement',
            'created_at',
            'updated_at'
        ])
        ->orderBy('created_at', 'desc')
        ->get();

        // Formater la réponse pour inclure les données structurées
        $paiementsFormatted = $paiements->map(function ($paiement) {
            return [
                'id' => $paiement->id,
                'reservation_id' => $paiement->reservation_id,
                'eleve' => $paiement->eleve ? [
                    'id' => $paiement->eleve->id,
                    'user' => [
                        'id' => $paiement->eleve->user->id,
                        'prenom' => $paiement->eleve->user->prenom,
                        'nom' => $paiement->eleve->user->nom,
                        'email' => $paiement->eleve->user->email,
                        'telephone' => $paiement->eleve->user->telephone,
                    ],
                    'niveau_scolaire' => $paiement->eleve->niveau_scolaire,
                ] : null,
                'reservation' => $paiement->reservation ? [
                    'id' => $paiement->reservation->id,
                    'date_reservation' => $paiement->reservation->date_reservation,
                    'statut' => $paiement->reservation->statut,
                    'eleve' => $paiement->reservation->eleve ? [
                        'id' => $paiement->reservation->eleve->id,
                        'user' => [
                            'prenom' => $paiement->reservation->eleve->user->prenom,
                            'nom' => $paiement->reservation->eleve->user->nom,
                            'email' => $paiement->reservation->eleve->user->email,
                        ],
                        'niveau_scolaire' => $paiement->reservation->eleve->niveau_scolaire,
                    ] : null,
                    'repetiteur' => $paiement->reservation->repetiteur ? [
                        'id' => $paiement->reservation->repetiteur->id,
                        'user' => [
                            'prenom' => $paiement->reservation->repetiteur->user->prenom,
                            'nom' => $paiement->reservation->repetiteur->user->nom,
                            'email' => $paiement->reservation->repetiteur->user->email,
                        ],
                        'matieres' => $paiement->reservation->repetiteur->matieres,
                        'tarif_horaire' => $paiement->reservation->repetiteur->tarif_horaire,
                    ] : null,
                    'cours' => $paiement->reservation->cours ? [
                        'id' => $paiement->reservation->cours->id,
                        'titre' => $paiement->reservation->cours->titre,
                        'matiere' => $paiement->reservation->cours->matiere,
                        'niveau_scolaire' => $paiement->reservation->cours->niveau_scolaire,
                        'tarif_horaire' => $paiement->reservation->cours->tarif_horaire,
                    ] : null,
                ] : null,
                'montant' => $paiement->montant,
                'methode' => $paiement->methode,
                'statut' => $paiement->statut,
                'transaction_id' => $paiement->transaction_id,
                'date_paiement' => $paiement->date_paiement,
                'created_at' => $paiement->created_at,
                'updated_at' => $paiement->updated_at,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $paiementsFormatted,
            'count' => $paiements->count(),
            'statistiques' => [
                'total' => $paiements->count(),
                'payes' => $paiements->where('statut', 'paye')->count(),
                'en_attente' => $paiements->where('statut', 'en_attente')->count(),
                'echoues' => $paiements->where('statut', 'echoue')->count(),
                'rembourses' => $paiements->where('statut', 'rembourse')->count(),
                'total_montant' => $paiements->where('statut', 'paye')->sum('montant'),
            ]
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de la récupération des paiements',
            'error' => $e->getMessage()
        ], 500);
    }
}
}