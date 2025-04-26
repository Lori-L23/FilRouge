<?php

namespace App\Http\Controllers;

use App\Models\Repetiteur;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class RepetiteurController extends Controller
{
    // Helper method pour normaliser les données JSON
    protected function normalizeJsonData($data)
    {
        if (is_array($data)) {
            return json_encode($data);
        }

        if (is_string($data)) {
            // Nettoyage des chaînes mal formatées
            $cleaned = str_replace(['\"', '"', '\\'], '', $data);

            // Si ce n'est pas un tableau JSON valide, on le transforme en tableau
            if (!json_validate($cleaned)) {
                $cleaned = '["' . $cleaned . '"]';
            }

            return $cleaned;
        };

        return json_encode([]);
    }

    // Helper method pour parser les données JSON
    protected function parseJsonData($data)
    {
        if (is_array($data)) {
            return $data;
        }

        try {
            return json_decode($data, true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException $e) {
            Log::error("Erreur de parsing JSON: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $repetiteurs = Repetiteur::with('user')
            ->whereHas('user', function ($query) {
                $query->where('statut', 'actif');
            })
            ->get()
            ->map(function ($repetiteur) {
                return $this->formatRepetiteurData($repetiteur);
            });

        return response()->json($repetiteurs);
    }

    public function publicShow($id)
    {
        // return response()->json(['id'=>$id]);
        try {
            
        $repetiteur = Repetiteur::with('user')
            ->whereHas('user', fn($q) => $q->where('statut', 'actif'))
            ->find($id);

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $repetiteur->id,
                    'user' => [
                        'id' => $repetiteur->user->id,
                        'nom' => $repetiteur->user->nom,
                        'prenom' => $repetiteur->user->prenom,
                        'email' => $repetiteur->user->email,
                        'telephone' => $repetiteur->user->telephone,
                        'photo' => $repetiteur->user->photo,
                    ],
                    'matieres' => $repetiteur->matieres ?? [],
                    'niveaux' => $repetiteur->niveaux ?? [],
                    'biographie' => $repetiteur->biographie,
                    'tarif_horaire' => $repetiteur->tarif_horaire,
                    'statut_verif' => $repetiteur->statut_verif,
                    'rayon_intervention' => $repetiteur->rayon_intervention,
                ],
                'cours' => $repetiteur->cours
            ]);
        } catch (\Throwable $th) {
            return response()->json(["data" => ["message"=>"Pas trouvé.", "error"=>$th->getMessage()]]);
        }
    }

    public function search(Request $request)
    {
        try {
            $validated = $request->validate([
                'matiere_id' => 'nullable|integer|exists:matieres,id',
                'niveau' => 'nullable|in:primaire,college/lycee',
                'search' => 'nullable|string|max:255',
                'page' => 'nullable|integer|min:1'
            ]);

            $query = User::with(['repetiteur.cours.matiere'])
                ->where('role', 'repetiteur')
                ->where('statut', 'actif');

            if ($request->matiere_id) {
                $query->whereHas('repetiteur.cours', function ($q) use ($request) {
                    $q->where('matiere_id', $request->matiere_id);
                });
            }

            if ($request->niveau) {
                $query->whereHas('repetiteur.cours', function ($q) use ($request) {
                    $q->where('niveau_scolaire', $request->niveau);
                });
            }

            if ($request->search) {
                $search = '%' . $request->search . '%';
                $query->where(function ($q) use ($search) {
                    $q->where('nom', 'like', $search)
                        ->orWhere('prenom', 'like', $search)
                        ->orWhereHas('repetiteur.cours.matiere', function ($q) use ($search) {
                            $q->where('nom', 'like', $search);
                        });
                });
            }

            $professeurs = $query->paginate(10, ['*'], 'page', $request->page ?? 1);

            // Formatage des données des répétiteurs
            $professeurs->getCollection()->transform(function ($user) {
                if ($user->repetiteur) {
                    return $this->formatRepetiteurData($user->repetiteur);
                }
                return $user;
            });

            return response()->json([
                'success' => true,
                'data' => $professeurs->items(),
                'pagination' => [
                    'current_page' => $professeurs->currentPage(),
                    'total' => $professeurs->total(),
                    'per_page' => $professeurs->perPage(),
                    'last_page' => $professeurs->lastPage()
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur recherche professeurs: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la recherche',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Inscription professeur
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'matieres' => 'required|array',
            'niveaux' => 'required|array',
            'biographie' => 'required|string',
            'rayon_intervention' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = $request->user();

        if ($user->repetiteur) {
            return response()->json(['message' => 'Vous êtes déjà inscrit comme professeur'], 400);
        }

        $repetiteur = Repetiteur::create([
            'user_id' => $user->id,
            'matieres' => $this->normalizeJsonData($request->matieres),
            'niveaux' => $this->normalizeJsonData($request->niveaux),
            'biographie' => $request->biographie,
            'rayon_intervention' => $request->rayon_intervention,
            'statut_verif' => 'non_verifie'
        ]);

        $user->role = 'repetiteur';
        $user->save();

        return response()->json($this->formatRepetiteurData($repetiteur), 201);
    }

    public function show($id)
    {
        $repetiteur = Repetiteur::with('user')->findOrFail($id);
        return response()->json($this->formatRepetiteurData($repetiteur));
    }

    public function update(Request $request, $id)
    {
        $repetiteur = Repetiteur::where('user_id', $id)->firstOrFail();

        $validated = $request->validate([
            'matieres' => 'required|array',
            'niveaux' => 'required|array',
            'tarif_horaire' => 'nullable|numeric',
            'biographie' => 'required|string',
            'rayon_intervention' => 'required|numeric'
        ]);

        $repetiteur->update([
            'matieres' => $this->normalizeJsonData($validated['matieres']),
            'niveaux' => $this->normalizeJsonData($validated['niveaux']),
            'tarif_horaire' => $validated['tarif_horaire'] ?? $repetiteur->tarif_horaire,
            'biographie' => $validated['biographie'],
            'rayon_intervention' => $validated['rayon_intervention']
        ]);

        return response()->json($this->formatRepetiteurData($repetiteur));
    }

    // Méthode pour formater les données du répétiteur
    protected function formatRepetiteurData($repetiteur)
    {
        return [
            'id' => $repetiteur->id,
            'user_id' => $repetiteur->user_id,
            'user' => $repetiteur->user,
            'matieres' => $this->parseJsonData($repetiteur->matieres),
            'niveaux' => $this->parseJsonData($repetiteur->niveaux),
            'biographie' => $repetiteur->biographie,
            'statut_verif' => $repetiteur->statut_verif,
            'tarif_horaire' => $repetiteur->tarif_horaire,
            'rayon_intervention' => $repetiteur->rayon_intervention,
            'photo' => $repetiteur->photo,
            'created_at' => $repetiteur->created_at,
            'updated_at' => $repetiteur->updated_at
        ];
    }
}
