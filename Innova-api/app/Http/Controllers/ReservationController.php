<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Reservation;
use App\Models\Cours;
use App\Models\Eleve;
use App\Models\User;
use App\Http\Middleware\CheckRole;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ReservationController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index']);
        $this->middleware(CheckRole::class . ':eleve')->only(['store']);
    }
    /**
     * Lister toutes les réservations.
     */
    // Dans votre ReservationController.php
    public function index()
    {
        try {
            $user = Auth::user();

            if ($user->role === 'admin') {
                $reservations = Reservation::with(['eleve.user', 'repetiteur.user'])->get();
            } else {
                $reservations = Reservation::where('eleve_id', $user->id)
                    ->with(['eleve.user', 'repetiteur.user'])
                    ->get();
            }

            return response()->json([
                'success' => true,
                'data' => [
                    "id" => $user->id,
                    "user" => $user,
                    "reservation" => $reservations,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('ReservationController Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur'
            ], 500);
        }
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'cours_id' => 'required|exists:cours,id', // Assurez-vous que le cours existe
            'date' => 'required|date|after_or_equal:today', // Assurez-vous que la date est aujourd'hui ou dans le futur
            'heure' => 'required|date_format:H:i', // Assurez-vous que l'heure est au format H:i
            'prix' => 'required|numeric', // Assurez-vous que le prix est supérieur à 20
            'statut' => 'sometimes|in:en_attente,acceptee,refusee,annulee'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = Auth::user();
            $eleve = Eleve::where('user_id', $user->id)->first();

            if (!$eleve) {
                return response()->json([
                    'success' => false,
                    'message' => 'Profil élève non trouvé'
                ], 403);
            }

            $cours = Cours::findOrFail($request->cours_id);

            $reservation = Reservation::create([
                'eleve_id' => $eleve->id,
                'repetiteur_id' => $cours->repetiteur_id,
                'prix' => $request->prix,
                'date_reservation' => $request->date . ' ' . $request->heure,
                'statut' => $request->statut ?? 'en_attente', // Correction ici
            ]);

            return response()->json([
                'success' => true,
                'data' => $reservation, // ->load(['eleve.user', 'repetiteur.user']),
                'message' => 'Réservation créée avec succès'
            ], 201);
        } catch (\Exception $e) {
            Log::error('Erreur création réservation: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création: ' . (env('APP_DEBUG') ? $e->getMessage() : ''),
                'error' => env('APP_DEBUG') ? $e->getTrace() : null
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $reservation = Reservation::with(['eleve.user', 'repetiteur.user'])->find($id);

            if (!$reservation) {
                return response()->json([
                    'success' => false,
                    'message' => 'Réservation non trouvée'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $reservation
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur affichage réservation: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération'
            ], 500);
        }
    }

    /**
     * Mettre à jour une réservation.
     */
    public function update(Request $request, $id)
    {
        $reservation = Reservation::find($id);

        if (!$reservation) {
            return response()->json(['message' => 'Réservation non trouvée.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'date' => 'sometimes|date',
            'heure' => 'sometimes|date_format:H:i',
            'statut' => 'sometimes|in:en_attente,acceptee,refusee,annulee',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $updateData = [];

            if ($request->has('date') && $request->has('heure')) {
                $updateData['date_reservation'] = $request->date . ' ' . $request->heure;
            } elseif ($request->has('date')) {
                // Garder l'heure existante
                $existingTime = date('H:i', strtotime($reservation->date_reservation));
                $updateData['date_reservation'] = $request->date . ' ' . $existingTime;
            } elseif ($request->has('heure')) {
                // Garder la date existante
                $existingDate = date('Y-m-d', strtotime($reservation->date_reservation));
                $updateData['date_reservation'] = $existingDate . ' ' . $request->heure;
            }

            if ($request->has('statut')) {
                $updateData['statut'] = $request->statut;
            }

            $reservation->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Réservation mise à jour.',
                'data' => $reservation->fresh(['eleve', 'repetiteur'])
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur mise à jour réservation: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour',
                'error' => env('APP_DEBUG') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Supprimer une réservation.
     */
    public function destroy($id)
    {
        try {
            $reservation = Reservation::find($id);

            if (!$reservation) {
                return response()->json([
                    'success' => false,
                    'message' => 'Réservation non trouvée.'
                ], 404);
            }

            $reservation->delete();

            return response()->json([
                'success' => true,
                'message' => 'Réservation supprimée avec succès.'
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur suppression réservation: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression',
                'error' => env('APP_DEBUG') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Mettre à jour uniquement le statut d'une réservation.
     */
    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'statut' => 'required|in:en_attente,acceptee,refusee,annulee',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $reservation = Reservation::find($id);

            if (!$reservation) {
                return response()->json([
                    'success' => false,
                    'message' => 'Réservation non trouvée.'
                ], 404);
            }

            $reservation->update(['statut' => $request->statut]);

            return response()->json([
                'success' => true,
                'message' => 'Statut de la réservation mis à jour.',
                'data' => $reservation->fresh(['eleve', 'repetiteur'])
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur mise à jour statut: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du statut',
                'error' => env('APP_DEBUG') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function getLatestReservations(Request $request)
    {
        $startDate = $request->input('start_date')
            ? Carbon::parse($request->input('start_date'))
            : Carbon::now()->subMonth();

        $endDate = $request->input('end_date')
            ? Carbon::parse($request->input('end_date'))
            : Carbon::now();

        $reservations = Reservation::with(['eleve.user', 'repetiteur.user'])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $reservations
        ]);
    }
}
