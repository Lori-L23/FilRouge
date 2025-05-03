<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Eleve;
use App\Models\Repetiteur;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;


class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'nom' => 'required|string',
                'prenom' => 'required|string',
                'email' => 'required|email|unique:users,email',
                'telephone' => 'required|string',
                'password' => 'required|confirmed',
                'role' => 'required|in:eleve,repetiteur,admin',
                'date_naissance' => 'required|date',
            ]);

            // Création de l'utilisateur de base
            $user = User::create([
                'nom' => $validated['nom'],
                'prenom' => $validated['prenom'],
                'email' => $validated['email'],
                'telephone' => $validated['telephone'],
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
                'date_naissance' => $validated['date_naissance'],
                'statut' => 'actif' // Ajout du statut par défaut
            ]);

            // Création des données spécifiques au rôle
            $profileData = null;

            if ($validated['role'] === 'eleve') {
                $profileData = Eleve::create([
                    'user_id' => $user->id,
                    'niveau_scolaire' => $request->input('niveau_scolaire', 'primaire'),
                    'date_naissance' => $validated['date_naissance']
                ]);
            } elseif ($validated['role'] === 'repetiteur') {
                $photoPath = $request->hasFile('photo')
                    ? $request->file('photo')->store('repetiteurs', 'public')
                    : null;

                $profileData = Repetiteur::create([
                    'user_id' => $user->id,
                    'matieres' => json_encode($request->input('matieres', [])),
                    'niveaux' => json_encode($request->input('niveaux', [])),
                    'biographie' => $request->input('biographie', ''),
                    'photo' => $photoPath,
                    'statut_verif' => 'non_verifie',
                    'rayon_intervention' => $request->input('rayon_intervention', 10),
                    'tarif_horaire' => $request->input('tarif_horaire', 0)
                ]);
            }elseif ($validated['role'] === 'admin') {
                $profileData = Admin::create([
                    'user_id' => $user->id,
                ]);
            } else {
                throw new \Exception('Invalid role');
            }

            // Création du token d'accès
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'user' => $user,
                'profile' => $profileData,
                'token' => $token
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Server error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {
        try {
            $credentials = $request->validate([
                'email' => 'required|email',
                'password' => 'required|string'
            ]);

            // Tentative d'authentification
            if (!Auth::attempt($credentials)) {
                throw ValidationException::withMessages([
                    'email' => ['Invalid credentials'],
                ]);
            }
            // return response()->json(['message' => 'Unauthorized'], 401);


            $user = User::where('email', $request->email)->firstOrFail();

            // Suppression des anciens tokens
            $user->tokens()->delete();

            // Création d'un nouveau token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Login failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getUser(Request $request)
    {
        try {
            $user = $request->user();
            $profile = null;

            // Récupération des données spécifiques au rôle
            if ($user->role === 'eleve') {
                $profile = Eleve::where('user_id', $user->id)->first();
            } elseif ($user->role === 'repetiteur') {
                $profile = Repetiteur::where('user_id', $user->id)->first();
            }

            return response()->json([
                'user' => $user,
                'profile' => $profile
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to get user data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    //fonction de deconnexion
    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();
            return response()->json(['message' => 'Logged out successfully']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Logout failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getUserWithProfile(Request $request)
    {
        $user = $request->user();
        $profile = null;
        $profileType = null;

        switch ($user->role) {
            case 'eleve':
                $profile = Eleve::where('user_id', $user->id)->first();
                $profileType = 'eleve';
                break;
            case 'repetiteur':
                $profile = Repetiteur::where('user_id', $user->id)->first();
                $profileType = 'repetiteur';
                break;
            case 'admin':
                $profile = Admin::where('user_id', $user->id)->first();
                $profileType = 'admin';
                break;
        }

        return response()->json([
            'user' => $user,
            'profile' => $profile,
            'profile_type' => $profileType
        ]);
    }
    public function updateRole(Request $request)
    {
        $request->validate([
            'role' => 'required|in:eleve,repetiteur,admin'
        ]);

        try {
            $user = $request->user();
            $user->role = $request->role;
            $user->save();

            return response()->json([
                'success' => true,
                'user' => $user,
                'message' => 'Rôle mis à jour avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour'
            ], 500);
        }
    }
}
