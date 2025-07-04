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

    // Lister tous les répétiteurs actifs
    public function index()
    {
        try {
            $repetiteurs = Repetiteur::with(['user', 'cours.matiere'])
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
            $repetiteur = Repetiteur::with(['user', 'cours.matiere', 'disponibilites'])
                ->whereHas('user', fn($q) => $q->where('statut', 'actif'))
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $this->formatRepetiteurData($repetiteur)
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching repetiteur: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Répétiteur non trouvé',
                'error' => $e->getMessage()
            ], 404);
        }
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
                'matieres'=> 'required_if:niveau_principal,college/lycee|array',
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
    protected function formatRepetiteurData($repetiteur)
    {
        return [
            'id' => $repetiteur->id,
            'user_id' => $repetiteur->user_id,
            'user' => [
                'id' => $repetiteur->user->id,
                'nom' => $repetiteur->user->nom,
                'prenom' => $repetiteur->user->prenom,
                'email' => $repetiteur->user->email,
                'telephone' => $repetiteur->user->telephone,
                'date_naissance' => $repetiteur->user->date_naissance,
            ],
            'matieres' => $repetiteur->matieres()->get()->map(function ($matiere) {
                return [
                    'id' => $matiere->id,
                    'nom' => $matiere->nom,
                ];
            }),
            'niveau_principal' => $repetiteur->niveau_principal,
            'classes_college' => $repetiteur->classes_college
                ? $this->parseJsonData($repetiteur->classes_college)
                : null,
            'biographie' => $repetiteur->biographie,
            'statut_verif' => $repetiteur->statut_verif,
            'tarif_horaire' => $repetiteur->tarif_horaire,
            'rayon_intervention' => $repetiteur->rayon_intervention,
            // 'photo' => $repetiteur->photo ? asset('storage/' . $repetiteur->photo) : null,
            'disponibilites' => $repetiteur->disponibilites,
            'cours' => $repetiteur->cours->map(function ($cours) {
                return [
                    'id' => $cours->id,
                    'matiere' => $cours->matiere->nom,
                    'niveau' => $cours->niveau_scolaire,
                    'tarif' => $cours->tarif_horaire,
                    'titre' => $cours->titre,
                    'description' => $cours->description,
                ];
            })
        ];
    }

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
    function getMatieresByRepetiteur($userId)
    {
        try {
            $repetiteur = Repetiteur::where('user_id', $userId)->firstOrFail();
            $matieres = $repetiteur->matieres()->get();

            return response()->json([
                'success' => true,
                'data' => $matieres->map(function ($m) {
                    return [
                        'id' => $m->id,
                        'nom' => $m->nom,
                    ];
                })
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching matieres by repetiteur: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des matières',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
