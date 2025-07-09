<?php

namespace App\Http\Controllers;

use App\Models\Repetiteur;
use App\Models\User;
use App\Models\Matiere;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class RepetiteurController extends Controller
{
    // Niveaux principaux disponibles
    protected $niveauxPrincipaux = ['primaire', 'college/lycee'];

    // Classes disponibles pour le collège/lycée
    protected $classesCollege = [
        '6eme',
        '5eme',
        '4eme',
        '3eme',
        'seconde',
        'premiere',
        'terminale'
    ];

    // Normalisation des données JSON
    protected function normalizeJsonData($data)
    {
        if (is_array($data)) {
            return json_encode(array_values(array_unique($data)));
        }

        try {
            $decoded = json_decode($data, true, 512, JSON_THROW_ON_ERROR);
            return json_encode(array_values(array_unique($decoded)));
        } catch (\JsonException $e) {
            return json_encode([]);
        }
    }

    // Parsing des données JSON
    protected function parseJsonData($data)
    {
        if (is_array($data)) {
            return array_values(array_unique($data));
        }

        try {
            $decoded = json_decode($data, true, 512, JSON_THROW_ON_ERROR);
            return array_values(array_unique($decoded));
        } catch (\JsonException $e) {
            return [];
        }
    }

    // // Lister tous les répétiteurs actifs
    // public function index()
    // {
    //     try {
    //         $repetiteurs = Repetiteur::with(['user', 'cours.matiere'])
    //             ->whereHas('user', fn($q) => $q->where('statut', 'actif'))
    //             ->get()
    //             ->map(fn($rep) => $this->formatRepetiteurData($rep));

    //         return response()->json([
    //             'success' => true,
    //             'data' => $repetiteurs
    //         ]);
    //     } catch (\Exception $e) {
    //         Log::error('Error fetching repetiteurs: ' . $e->getMessage());
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Erreur lors de la récupération des répétiteurs',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }
    public function index()
    {
        try {
            $repetiteurs = Repetiteur::with(['user', 'cours.matiere', 'matieres'])
                ->whereHas('user', fn($q) => $q->where('statut', 'actif'))
                ->get()
                ->map(fn($rep) => $this->formatRepetiteurData($rep));

            return response()->json([
                'success' => true,
                'data' => $repetiteurs
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching repetiteurs: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des répétiteurs',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    // Afficher un répétiteur (public)
public function publicShow($id)
{
    try {
        // Charge toutes les relations nécessaires avec sélection des colonnes
        $repetiteur = Repetiteur::with([
            'user' => function($query) {
                $query->select('id', 'nom', 'prenom', 'email', 'telephone', 'date_naissance');
            },
            'cours' => function($query) {
                $query->select('id', 'titre', 'description', 'matiere_id', 'repetiteur_id', 'niveau_scolaire', 'tarif_horaire')
                      ->with(['matiere' => function($q) {
                          $q->select('id', 'nom', 'niveau');
                      }]);
            },
            'disponibilites' => function($query) {
                $query->select('id', 'repetiteur_id', 'jour', 'heure_debut', 'heure_fin');
            },
            'matieres' => function($query) {
                $query->select('matieres.id', 'matieres.nom', 'matieres.niveau');
            }
        ])
        ->whereHas('user', fn($q) => $q->where('statut', 'actif'))
        ->select('id', 'user_id', 'niveau_principal', 'classes_college', 'biographie', 'statut_verif', 'tarif_horaire', 'rayon_intervention')
        ->findOrFail($id);

        // Vérification des données critiques
        if (!$repetiteur->user) {
            throw new \Exception("L'utilisateur associé n'existe pas ou n'est pas actif");
        }

        // Formatage des données
        $formattedData = [
            'id' => $repetiteur->id,
            'user' => [
                'id' => $repetiteur->user->id,
                'nom' => $repetiteur->user->nom,
                'prenom' => $repetiteur->user->prenom,
                'email' => $repetiteur->user->email,
                'telephone' => $repetiteur->user->telephone,
                'date_naissance' => $repetiteur->user->date_naissance
            ],
            'niveau_principal' => $repetiteur->niveau_principal,
            'classes_college' => $repetiteur->classes_college,
            'biographie' => $repetiteur->biographie,
            'statut_verif' => $repetiteur->statut_verif,
            'tarif_horaire' => $repetiteur->tarif_horaire,
            'rayon_intervention' => $repetiteur->rayon_intervention,
            'matieres' => $repetiteur->matieres->map(function($matiere) {
                return [
                    'id' => $matiere->id,
                    'nom' => $matiere->nom,
                    'niveau' => $matiere->niveau
                ];
            }),
            'disponibilites' => $repetiteur->disponibilites->map(function($dispo) {
                return [
                    'id' => $dispo->id,
                    'jour' => $dispo->jour,
                    'heure_debut' => substr($dispo->heure_debut, 0, 5),
                    'heure_fin' => substr($dispo->heure_fin, 0, 5)
                ];
            }),
            'cours' => $repetiteur->cours->map(function($cours) {
                return [
                    'id' => $cours->id,
                    'titre' => $cours->titre,
                    'description' => $cours->description,
                    'niveau_scolaire' => $cours->niveau_scolaire,
                    'tarif_horaire' => $cours->tarif_horaire,
                    'matiere' => $cours->matiere ? [
                        'id' => $cours->matiere->id,
                        'nom' => $cours->matiere->nom,
                        'niveau' => $cours->matiere->niveau
                    ] : null
                ];
            })
        ];

        return response()->json([
            'success' => true,
            'data' => $formattedData
        ]);

    } catch (\Exception $e) {
        Log::error("RepetiteurController@publicShow - Erreur: " . $e->getMessage());
        Log::error("Stack trace: " . $e->getTraceAsString());
        Log::error("Données requête: " . json_encode(request()->all()));

        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de la récupération du répétiteur',
            'error' => env('APP_DEBUG') ? $e->getMessage() : null
        ], 500);
    }
}

    private function formatRepetiteurData($repetiteur)
    {
        return [
            'id' => $repetiteur->id,
            'user' => [
                'id' => $repetiteur->user->id,
                'nom' => $repetiteur->user->nom,
                'prenom' => $repetiteur->user->prenom,
                'email' => $repetiteur->user->email,
                'telephone' => $repetiteur->user->telephone
            ],
            'niveau_principal' => $repetiteur->niveau_principal,
            'classes_college' => json_decode($repetiteur->classes_college) ?? [],
            'biographie' => $repetiteur->biographie,
            'tarif_horaire' => $repetiteur->tarif_horaire,
            'photo' => $repetiteur->photo ? asset('storage/' . $repetiteur->photo) : null,
            'matieres' => $repetiteur->matieres->map(function ($matiere) {
                return [
                    'id' => $matiere->id,
                    'nom' => $matiere->nom
                ];
            }),
            'disponibilites' => $repetiteur->disponibilites->map(function ($dispo) {
                return [
                    'id' => $dispo->id,
                    'jour' => $dispo->jour,
                    'heure_debut' => $dispo->heure_debut,
                    'heure_fin' => $dispo->heure_fin
                ];
            }),
            'cours' => $repetiteur->cours->map(function ($cours) {
                return [
                    'id' => $cours->id,
                    'titre' => $cours->titre,
                    'tarif_horaire' => $cours->tarif_horaire,
                    'matiere' => $cours->matiere ? [
                        'id' => $cours->matiere->id,
                        'nom' => $cours->matiere->nom
                    ] : null
                ];
            })
        ];
    }

    // Recherche avancée de répétiteurs
    public function search(Request $request)
    {
        try {
            $validated = $request->validate([
                'matiere_id' => 'nullable|integer|exists:matieres,id',
                'niveau' => 'nullable|in:' . implode(',', $this->classesCollege),
                'search' => 'nullable|string|max:255',
                'min_price' => 'nullable|numeric|min:0',
                'max_price' => 'nullable|numeric|min:0',
                'rayon' => 'nullable|integer|min:1',
                'page' => 'nullable|integer|min:1'
            ]);

            $query = Repetiteur::with(['user', 'cours.matiere'])
                ->whereHas('user', fn($q) => $q->where('statut', 'actif'));

            // Filtre par matière
            if ($request->matiere_id) {
                $query->whereJsonContains('matieres_id', (int)$validated['matiere_id']);
            }


            // Filtre par niveau
            if ($request->niveau) {
                $query->where(function ($q) use ($validated) {
                    $q->where('niveau_principal', 'primaire')
                        ->orWhereJsonContains('classes_college', $validated['niveau']);
                });
            }

            // Filtre par prix
            if ($request->min_price) {
                $query->where('tarif_horaire', '>=', $validated['min_price']);
            }
            if ($request->max_price) {
                $query->where('tarif_horaire', '<=', $validated['max_price']);
            }

            // Filtre par rayon d'intervention
            if ($request->rayon) {
                $query->where('rayon_intervention', '>=', $validated['rayon']);
            }

            // Recherche texte
            if ($request->search) {
                $search = '%' . $validated['search'] . '%';
                $query->whereHas('user', function ($q) use ($search) {
                    $q->where('nom', 'like', $search)
                        ->orWhere('prenom', 'like', $search);
                });
            }

            $resultats = $query->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $resultats->map(fn($rep) => $this->formatRepetiteurData($rep)),
                'pagination' => [
                    'current_page' => $resultats->currentPage(),
                    'total' => $resultats->total(),
                    'per_page' => $resultats->perPage(),
                    'last_page' => $resultats->lastPage()
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Search error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la recherche',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Mettre à jour un répétiteur
    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'matieres' => 'required_if:niveau_principal,college/lycee|array',
                'niveau_principal' => 'required|in:' . implode(',', $this->niveauxPrincipaux),
                'classes_college' => 'required_if:niveau_principal,college/lycee|array',
                'classes_college.*' => 'in:' . implode(',', $this->classesCollege),
                'biographie' => 'required|string|min:20|max:1000',
                'tarif_horaire' => 'required|numeric|min:0',
                'rayon_intervention' => 'required|integer|min:1|max:100',
            ]);


            $repetiteur = Repetiteur::where('user_id', $id)->firstOrFail();

            // Gestion de la photo
            // if ($request->hasFile('photo')) {
            //     $photoPath = $request->file('photo')->store('repetiteurs', 'public');
            //     $validated['photo'] = $photoPath;
            // }

            $repetiteur->update([
                'matieres_id' => $this->normalizeJsonData($validated['matieres_id']),
                'niveau_principal' => $validated['niveau_principal'],
                'classes_college' => $validated['niveau_principal'] === 'college/lycee'
                    ? $this->normalizeJsonData($validated['classes_college'])
                    : null,
                'biographie' => $validated['biographie'],
                'tarif_horaire' => $validated['tarif_horaire'],
                'rayon_intervention' => $validated['rayon_intervention'],
            ]);


            return response()->json([
                'success' => true,
                'data' => $this->formatRepetiteurData($repetiteur),
                'message' => 'Profil mis à jour avec succès'
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Update error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Formatage des données du répétiteur
    function getCoursByRepetiteur($userId)
    {
        try {
            $repetiteur = Repetiteur::where('user_id', $userId)->firstOrFail();
            $cours = $repetiteur->cours()->with('matiere')->get();

            return response()->json([
                'success' => true,
                'data' => $cours->map(function ($c) {
                    return [
                        'id' => $c->id,
                        'matiere' => $c->matiere->nom,
                        'niveau' => $c->niveau_scolaire,
                        'tarif' => $c->tarif_horaire . 'fcfa/h',
                        'titre' => $c->titre,
                        'description' => $c->description,
                    ];
                })
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching cours by repetiteur: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des cours',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function getMatieresByRepetiteur($repetiteurId)
    {
        try {
            $repetiteur = Repetiteur::with('matieres')->findOrFail($repetiteurId);

            return response()->json([
                'success' => true,
                'data' => $repetiteur->matieres->map(function ($matiere) {
                    return [
                        'id' => $matiere->id,
                        'nom' => $matiere->nom,
                        'niveau' => $matiere->niveau
                    ];
                })
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching matieres: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des matières'
            ], 500);
        }
    }
}
