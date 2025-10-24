<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Reservation;
use App\Models\Cours;
use App\Models\Eleve;
use App\Models\Matiere;
use App\Models\Transaction;
use App\Models\Repetiteur;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ReservationController extends Controller
{
    /**
     * Vérification de l'authentification
     */
    private function checkAuth()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non authentifié'
            ], 401);
        }

        return $user;
    }

    /**
     * Vérification du rôle utilisateur
     */
    private function checkRole($allowedRoles)
    {
        $user = $this->checkAuth();

        if ($user instanceof \Illuminate\Http\JsonResponse) {
            return $user;
        }

        if (!in_array($user->role, $allowedRoles)) {
            return response()->json([
                'success' => false,
                'message' => 'Rôle utilisateur non autorisé'
            ], 403);
        }

        return $user;
    }

    /**
     * Récupère la liste des réservations selon le rôle utilisateur
     */
    public function index(Request $request)
    {
        try {
            $user = $this->checkAuth();

            if ($user instanceof \Illuminate\Http\JsonResponse) {
                return $user;
            }

            $query = Reservation::with([
                'eleve.user',
                'repetiteur.user',
                'cours',
                'matiere',
                'transaction'
            ]);

            // Filtrage selon le rôle
            switch ($user->role) {
                case 'admin':
                    // Admin peut voir toutes les réservations
                    break;
                case 'eleve':
                    $eleve = Eleve::where('user_id', $user->id)->first();
                    if (!$eleve) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Profil élève non trouvé'
                        ], 404);
                    }
                    $query->where('eleve_id', $eleve->id);
                    break;
                case 'repetiteur':
                    $repetiteur = Repetiteur::where('user_id', $user->id)->first();
                    if (!$repetiteur) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Profil répétiteur non trouvé'
                        ], 404);
                    }
                    $query->where('repetiteur_id', $repetiteur->id);
                    break;
                default:
                    return response()->json([
                        'success' => false,
                        'message' => 'Rôle utilisateur non autorisé'
                    ], 403);
            }

            // Pagination et tri
            $perPage = $request->get('per_page', 15);
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');

            $reservations = $query->orderBy($sortBy, $sortOrder)
                ->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $reservations->items(),
                'pagination' => [
                    'current_page' => $reservations->currentPage(),
                    'last_page' => $reservations->lastPage(),
                    'per_page' => $reservations->perPage(),
                    'total' => $reservations->total(),
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('ReservationController@index Error: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des réservations'
            ], 500);
        }
    }

    /**
     * Crée une nouvelle réservation
     */
    // public function store(Request $request)
    // {
    //     try {
    //         // Vérification que seuls les élèves peuvent créer des réservations
    //         $user = $this->checkRole(['eleve']);

    //         if ($user instanceof \Illuminate\Http\JsonResponse) {
    //             return $user;
    //         }
    //         // Récupérer l'élève associé à l'utilisateur connecté
    //     $eleve = Eleve::where('user_id', $user->id)->first();

    //     if (!$eleve) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Aucun profil élève trouvé pour cet utilisateur'
    //         ], 404);
    //     }
    //         // Validation des données
    //         $validator = Validator::make($request->all(), [
    //             'repetiteur_id' => 'required|exists:repetiteurs,id',
    //             'cours_id' => 'nullable|exists:cours,id',
    //             'matiere_id' => 'nullable|exists:matiere_repetiteur,id',
    //             'date' => 'required|date|after_or_equal:today',
    //             'heure' => 'required|date_format:H:i:s',
    //             'duree_heures' => 'required|numeric|min:0.5|max:8',
    //             'prix_total' => 'nullable|numeric|min:0',
    //             'statut' => 'sometimes|in:en_attente,acceptee,refusee,annulee,terminee',
    //             'statut_paiement' => 'sometimes|in:en_attente,paye,rembourse,echec',
    //             'notes' => 'nullable|string|max:1000'
    //         ]);

    //         if ($validator->fails()) {
    //             return response()->json([
    //                 'success' => false,
    //                 'message' => 'Données de validation invalides',
    //                 'errors' => $validator->errors()
    //             ], 422);
    //         }

    //         DB::beginTransaction();

    //         // Vérifications de sécurité
    //         // $eleve = Eleve::findOrFail($request->eleve_id);
    //         $repetiteur = Repetiteur::with('user')->findOrFail($request->repetiteur_id);

    //         // Vérifier que l'élève authentifié correspond à l'élève de la réservation
    //         // if ($eleve->user_id !== $user->id) {
    //         //     DB::rollBack();
    //         //     return response()->json([
    //         //         'success' => false,
    //         //         'message' => 'Vous ne pouvez réserver que pour votre propre compte'
    //         //     ], 403);
    //         // }

    //         // Récupération des informations du cours et matière
    //         $cours = null;
    //         $matiere = null;

    //         if ($request->cours_id) {
    //             $cours = Cours::findOrFail($request->cours_id);
    //         }

    //         if ($request->matiere_id) {
    //             $matiere = Matiere::findOrFail($request->matiere_id);
    //         }

    //         // Calcul du prix total
    //         $prixTotal = $request->prix_total ?? ($repetiteur->tarif_horaire * $request->duree_heures);

    //         // Vérification de la disponibilité
    //         $dateHeure = Carbon::parse($request->date . ' ' . $request->heure);
    //         $finCours = $dateHeure->copy()->addHours($request->duree_heures);

    //         $conflits = Reservation::where('repetiteur_id', $repetiteur->id)
    //             ->where('date', $request->date)
    //             ->whereNotIn('statut', ['annulee', 'refusee'])
    //             ->where(function ($query) use ($request, $finCours) {
    //                 $query->where(function ($q) use ($request, $finCours) {
    //                     $q->where('heure', '>=', $request->heure)
    //                         ->where('heure', '<', $finCours->format('H:i:s'));
    //                 })->orWhere(function ($q) use ($request, $finCours) {
    //                     $q->whereRaw(
    //                         'ADDTIME(heure, SEC_TO_TIME(duree_heures * 3600)) > ?',
    //                         [$request->heure]
    //                     )->where('heure', '<=', $request->heure);
    //                 });
    //             })
    //             ->exists();

    //         if ($conflits) {
    //             DB::rollBack();
    //             return response()->json([
    //                 'success' => false,
    //                 'message' => 'Ce créneau horaire n\'est pas disponible'
    //             ], 409);
    //         }

    //         // Création de la réservation
    //         $reservationData = [
    //             'eleve_id' => $eleve->id,
    //             'repetiteur_id' => $repetiteur->id,
    //             'date' => $request->date,
    //             'heure' => $request->heure,
    //             'duree_heures' => $request->duree_heures,
    //             'prix_total' => $prixTotal,
    //             'statut' => $request->statut ?? 'en_attente',
    //             'statut_paiement' => $request->statut_paiement ?? 'en_attente',
    //             'notes' => $request->notes,
    //         ];

    //         if ($cours) {
    //             $reservationData['cours_id'] = $cours->id;
    //         }

    //         if ($matiere) {
    //             $reservationData['matiere_id'] = $matiere->id;
    //         }

    //         $reservation = Reservation::create($reservationData);

    //         // Création de la transaction associée
    //         $transactionData = [
    //             'user_id' => $user->id,
    //             'montant' => $prixTotal,
    //             'methode_paiement' => 'en_attente',
    //             'statut' => 'en_attente',
    //             'reference' => 'RES-' . strtoupper(Str::random(10)),
    //             'description' => "Réservation cours avec {$repetiteur->user->prenom} {$repetiteur->user->nom}"
    //         ];

    //         $transaction = Transaction::create(array_merge($transactionData, [
    //             'reservation_id' => $reservation->id
    //         ]));

    //         DB::commit();

    //         return response()->json([
    //             'success' => true,
    //             'data' => [
    //                 'reservation' => $reservation->load([
    //                     'eleve.user',
    //                     'repetiteur.user',
    //                     'cours',
    //                     'matiere',
    //                     'transaction'
    //                 ]),
    //                 'transaction' => $transaction
    //             ],
    //             'message' => 'Réservation créée avec succès'
    //         ], 201);
    //     } catch (ModelNotFoundException $e) {
    //         DB::rollBack();
    //         Log::error('ReservationController@store - Model not found: ' . $e->getMessage());

    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Ressource non trouvée'
    //         ], 404);
    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         Log::error('ReservationController@store Error: ' . $e->getMessage(), [
    //             'user_id' => Auth::id(),
    //             'request_data' => $request->all(),
    //             'trace' => $e->getTraceAsString()
    //         ]);

    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Erreur lors de la création de la réservation',
    //             'error' => config('app.debug') ? $e->getMessage() : null
    //         ], 500);
    //     }
    // }

public function store(Request $request)
{
    try {
        // Vérification que seuls les élèves peuvent créer des réservations
        $user = $this->checkRole(['eleve']);

        if ($user instanceof \Illuminate\Http\JsonResponse) {
            return $user;
        }

        // Récupérer l'élève associé à l'utilisateur connecté
        $eleve = Eleve::where('user_id', $user->id)->first();

        if (!$eleve) {
            return response()->json([
                'success' => false,
                'message' => 'Aucun profil élève trouvé pour cet utilisateur'
            ], 404);
        }

        // Validation des données
        $validator = Validator::make($request->all(), [
            'repetiteur_id' => 'required|exists:repetiteurs,id',
            'cours_id' => 'nullable|exists:cours,id',
            'matiere_id' => 'nullable|exists:matieres,id',
            'date' => 'required|date|after_or_equal:today',
            'heure' => 'required|date_format:H:i:s',
            'duree_heures' => 'required|numeric|min:0.5|max:8',
            'prix_total' => 'nullable|numeric|min:0',
            'statut' => 'sometimes|in:en_attente,acceptee,refusee,annulee,terminee',
            'statut_paiement' => 'sometimes|in:en_attente,paye,rembourse,echec',
            'notes' => 'nullable|string|max:1000'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données de validation invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();

        $repetiteur = Repetiteur::with('user')->findOrFail($request->repetiteur_id);

        // Calcul du prix total
        $prixTotal = $request->prix_total ?? ($repetiteur->tarif_horaire * $request->duree_heures);

        // Vérification de la disponibilité
        $dateHeure = Carbon::parse($request->date . ' ' . $request->heure);
        $finCours = $dateHeure->copy()->addHours($request->duree_heures);

        $conflits = Reservation::where('repetiteur_id', $repetiteur->id)
            ->where('date', $request->date)
            ->whereNotIn('statut', ['annulee', 'refusee'])
            ->where(function ($query) use ($request, $finCours) {
                $query->where(function ($q) use ($request, $finCours) {
                    $q->where('heure', '>=', $request->heure)
                        ->where('heure', '<', $finCours->format('H:i:s'));
                })->orWhere(function ($q) use ($request, $finCours) {
                    $q->whereRaw(
                        'ADDTIME(heure, SEC_TO_TIME(duree_heures * 3600)) > ?',
                        [$request->heure]
                    )->where('heure', '<=', $request->heure);
                });
            })
            ->exists();

        if ($conflits) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Ce créneau horaire n\'est pas disponible'
            ], 409);
        }

        // Création de la réservation avec gestion des valeurs null
        $reservationData = [
            'eleve_id' => $eleve->id,
            'repetiteur_id' => $repetiteur->id,
            'date' => $request->date,
            'heure' => $request->heure,
            'duree_heures' => $request->duree_heures,
            'prix_total' => $prixTotal,
            'statut' => $request->statut ?? 'en_attente',
            'statut_paiement' => $request->statut_paiement ?? 'en_attente',
            'notes' => $request->notes,
        ];

        // Ajout conditionnel des IDs
        if (!empty($request->cours_id)) {
            $reservationData['cours_id'] = $request->cours_id;
        }

        if (!empty($request->matiere_id)) {
            $reservationData['matiere_id'] = $request->matiere_id;
        }

        $reservation = Reservation::create($reservationData);

        // Création de la transaction associée
        $transactionData = [
            'user_id' => $user->id,
            'montant' => $prixTotal,
            'methode_paiement' => 'en_attente',
            'statut' => 'en_attente',
            'reference' => 'RES-' . strtoupper(Str::random(10)),
            'description' => "Réservation cours avec {$repetiteur->user->prenom} {$repetiteur->user->nom}"
        ];

        $transaction = Transaction::create(array_merge($transactionData, [
            'reservation_id' => $reservation->id
        ]));

        DB::commit();

        return response()->json([
            'success' => true,
            'data' => [
                'reservation' => $reservation->load([
                    'eleve.user',
                    'repetiteur.user',
                    'cours',
                    'matiereRepetiteur',
                    'transaction'
                ]),
                'transaction' => $transaction
            ],
            'message' => 'Réservation créée avec succès'
        ], 201);
    } catch (ModelNotFoundException $e) {
        DB::rollBack();
        Log::error('ReservationController@store - Model not found: ' . $e->getMessage());

        return response()->json([
            'success' => false,
            'message' => 'Ressource non trouvée'
        ], 404);
    } catch (\Exception $e) {
        DB::rollBack();
        Log::error('ReservationController@store Error: ' . $e->getMessage(), [
            'user_id' => Auth::id(),
            'request_data' => $request->all(),
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de la création de la réservation',
            'error' => config('app.debug') ? $e->getMessage() : null
        ], 500);
    }
}
    /**
     * Affiche une réservation spécifique
     */
    public function show($id)
    {
        try {
            $user = $this->checkRole(['admin', 'eleve', 'repetiteur']);

            if ($user instanceof \Illuminate\Http\JsonResponse) {
                return $user;
            }

            $reservation = Reservation::with([
                'eleve.user',
                'repetiteur.user',
                'cours',
                'matiere',
                'transaction'
            ])->findOrFail($id);

            // Vérification des permissions
            if ($user->role !== 'admin') {
                $hasPermission = false;

                if ($user->role === 'eleve') {
                    $eleve = Eleve::where('user_id', $user->id)->first();
                    $hasPermission = $eleve && $reservation->eleve_id === $eleve->id;
                } elseif ($user->role === 'repetiteur') {
                    $repetiteur = Repetiteur::where('user_id', $user->id)->first();
                    $hasPermission = $repetiteur && $reservation->repetiteur_id === $repetiteur->id;
                }

                if (!$hasPermission) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Accès non autorisé à cette réservation'
                    ], 403);
                }
            }

            return response()->json([
                'success' => true,
                'data' => $reservation
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Réservation non trouvée'
            ], 404);
        } catch (\Exception $e) {
            Log::error('ReservationController@show Error: ' . $e->getMessage(), [
                'reservation_id' => $id,
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de la réservation'
            ], 500);
        }
    }

    /**
     * Met à jour une réservation
     */
    public function update(Request $request, $id)
    {
        try {
            $user = $this->checkRole(['admin', 'eleve', 'repetiteur']);

            if ($user instanceof \Illuminate\Http\JsonResponse) {
                return $user;
            }

            $validator = Validator::make($request->all(), [
                'date' => 'sometimes|date|after_or_equal:today',
                'heure' => 'sometimes|date_format:H:i:s',
                'duree_heures' => 'sometimes|numeric|min:0.5|max:8',
                'statut' => 'sometimes|in:en_attente,acceptee,refusee,annulee,terminee',
                'statut_paiement' => 'sometimes|in:en_attente,paye,rembourse,echec',
                'notes' => 'sometimes|string|max:1000',
                'prix_total' => 'sometimes|numeric|min:0'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Données de validation invalides',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            $reservation = Reservation::with(['cours', 'repetiteur'])->findOrFail($id);

            // Vérification des permissions
            $canUpdate = false;
            if ($user->role === 'admin') {
                $canUpdate = true;
            } elseif ($user->role === 'repetiteur') {
                $repetiteur = Repetiteur::where('user_id', $user->id)->first();
                $canUpdate = $repetiteur && $reservation->repetiteur_id === $repetiteur->id;
            } elseif ($user->role === 'eleve') {
                $eleve = Eleve::where('user_id', $user->id)->first();
                $canUpdate = $eleve && $reservation->eleve_id === $eleve->id;
            }

            if (!$canUpdate) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Vous n\'êtes pas autorisé à modifier cette réservation'
                ], 403);
            }

            $updateData = $validator->validated();

            // Recalcul du prix si la durée change
            if (isset($updateData['duree_heures']) && !isset($updateData['prix_total'])) {
                $updateData['prix_total'] = $reservation->repetiteur->tarif_horaire * $updateData['duree_heures'];
            }

            // Mise à jour de la réservation
            $reservation->update($updateData);

            // Mise à jour de la transaction si le prix change
            if (isset($updateData['prix_total']) && $reservation->transaction) {
                $reservation->transaction->update([
                    'montant' => $updateData['prix_total']
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $reservation->fresh([
                    'eleve.user',
                    'repetiteur.user',
                    'cours',
                    'matiere',
                    'transaction'
                ]),
                'message' => 'Réservation mise à jour avec succès'
            ]);
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Réservation non trouvée'
            ], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('ReservationController@update Error: ' . $e->getMessage(), [
                'reservation_id' => $id,
                'user_id' => Auth::id(),
                'request_data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour de la réservation'
            ], 500);
        }
    }

    /**
     * Supprime une réservation
     */
    public function destroy($id)
    {
        try {
            $user = $this->checkRole(['admin', 'eleve']);

            if ($user instanceof \Illuminate\Http\JsonResponse) {
                return $user;
            }

            DB::beginTransaction();

            $reservation = Reservation::findOrFail($id);

            // Vérification des permissions
            $canDelete = false;
            if ($user->role === 'admin') {
                $canDelete = true;
            } elseif ($user->role === 'eleve') {
                $eleve = Eleve::where('user_id', $user->id)->first();
                $canDelete = $eleve && $reservation->eleve_id === $eleve->id;
            }

            if (!$canDelete) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Vous n\'êtes pas autorisé à supprimer cette réservation'
                ], 403);
            }

            // Suppression de la transaction associée
            if ($reservation->transaction) {
                $reservation->transaction->delete();
            }

            $reservation->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Réservation supprimée avec succès'
            ]);
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Réservation non trouvée'
            ], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('ReservationController@destroy Error: ' . $e->getMessage(), [
                'reservation_id' => $id,
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression de la réservation'
            ], 500);
        }
    }

    /**
     * Met à jour le statut d'une réservation
     */
    public function updateStatus(Request $request, $id)
    {
        try {
            $user = $this->checkRole(['admin', 'repetiteur']);

            if ($user instanceof \Illuminate\Http\JsonResponse) {
                return $user;
            }

            $validator = Validator::make($request->all(), [
                'statut' => 'required|in:en_attente,acceptee,refusee,annulee,terminee',
                'notes' => 'sometimes|string|max:1000'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Données de validation invalides',
                    'errors' => $validator->errors()
                ], 422);
            }

            $reservation = Reservation::findOrFail($id);

            // Vérification des permissions selon le rôle
            $canUpdateStatus = false;
            if ($user->role === 'admin') {
                $canUpdateStatus = true;
            } elseif ($user->role === 'repetiteur') {
                $repetiteur = Repetiteur::where('user_id', $user->id)->first();
                $canUpdateStatus = $repetiteur && $reservation->repetiteur_id === $repetiteur->id;
            }

            if (!$canUpdateStatus) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous n\'êtes pas autorisé à modifier le statut de cette réservation'
                ], 403);
            }

            $updateData = ['statut' => $request->statut];
            if ($request->has('notes')) {
                $updateData['notes'] = $request->notes;
            }

            $reservation->update($updateData);

            return response()->json([
                'success' => true,
                'data' => $reservation->fresh(['eleve.user', 'repetiteur.user', 'cours', 'matiere']),
                'message' => 'Statut mis à jour avec succès'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Réservation non trouvée'
            ], 404);
        } catch (\Exception $e) {
            Log::error('ReservationController@updateStatus Error: ' . $e->getMessage(), [
                'reservation_id' => $id,
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du statut'
            ], 500);
        }
    }

    /**
     * Récupère les réservations récentes
     */
    public function getLatestReservations(Request $request)
    {
        try {
            $user = $this->checkRole(['admin', 'eleve', 'repetiteur']);

            if ($user instanceof \Illuminate\Http\JsonResponse) {
                return $user;
            }

            $limit = $request->input('limit', 10);
            $startDate = $request->input('start_date', Carbon::now()->subMonth());
            $endDate = $request->input('end_date', Carbon::now());

            $query = Reservation::with([
                'eleve.user',
                'repetiteur.user',
                'cours',
                'matiere',
                'transaction'
            ])
                ->whereBetween('created_at', [
                    Carbon::parse($startDate),
                    Carbon::parse($endDate)
                ]);

            // Filtrage selon le rôle
            if ($user->role === 'eleve') {
                $eleve = Eleve::where('user_id', $user->id)->first();
                if ($eleve) {
                    $query->where('eleve_id', $eleve->id);
                }
            } elseif ($user->role === 'repetiteur') {
                $repetiteur = Repetiteur::where('user_id', $user->id)->first();
                if ($repetiteur) {
                    $query->where('repetiteur_id', $repetiteur->id);
                }
            }

            $reservations = $query->orderBy('created_at', 'desc')
                ->limit($limit)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $reservations,
                'count' => $reservations->count()
            ]);
        } catch (\Exception $e) {
            Log::error('ReservationController@getLatestReservations Error: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'request_data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des réservations récentes'
            ], 500);
        }
    }

    /**
     * Récupère les statistiques des réservations
     */
    public function getReservationStats(Request $request)
    {
        try {
            $user = $this->checkRole(['admin', 'eleve', 'repetiteur']);

            if ($user instanceof \Illuminate\Http\JsonResponse) {
                return $user;
            }

            $startDate = $request->input('start_date', Carbon::now()->startOfMonth());
            $endDate = $request->input('end_date', Carbon::now()->endOfMonth());

            $query = Reservation::whereBetween('created_at', [
                Carbon::parse($startDate),
                Carbon::parse($endDate)
            ]);

            // Filtrage selon le rôle
            if ($user->role === 'eleve') {
                $eleve = Eleve::where('user_id', $user->id)->first();
                if ($eleve) {
                    $query->where('eleve_id', $eleve->id);
                }
            } elseif ($user->role === 'repetiteur') {
                $repetiteur = Repetiteur::where('user_id', $user->id)->first();
                if ($repetiteur) {
                    $query->where('repetiteur_id', $repetiteur->id);
                }
            }

            $stats = [
                'total' => $query->count(),
                'en_attente' => $query->where('statut', 'en_attente')->count(),
                'acceptees' => $query->where('statut', 'acceptee')->count(),
                'refusees' => $query->where('statut', 'refusee')->count(),
                'annulees' => $query->where('statut', 'annulee')->count(),
                'terminees' => $query->where('statut', 'terminee')->count(),
                'revenus_total' => $query->sum('prix_total'),
                'revenus_payes' => $query->where('statut_paiement', 'paye')->sum('prix_total'),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            Log::error('ReservationController@getReservationStats Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des statistiques'
            ], 500);
        }
    }
}
