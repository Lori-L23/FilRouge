<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
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
                'date_naissance' => 'date',
                // 'niveau_scolaire' => 'nullable|string',
                // 'matieres' => 'required|string', // Accepte une string séparée par virgules
                // 'niveaux' => 'required|string',  // Accepte une string séparée par virgules
                // 'tarif_horaire' => 'required|integer|min:1000',
                // 'matieres' => 'required|array',
                // 'matieres.*' => 'string|max:255',
                // 'niveaux' => 'required|array',
                // 'niveaux.*' => 'string|in:primaire,College/lycee',
                // 'rayon_intervention' => 'integer|min:1|max:50',
                // 'photo' => 'nullable|image|max:2048',
            ]);

            $user = User::create([
                'nom' => $validated['nom'],
                'prenom' => $validated['prenom'],
                'email' => $validated['email'],
                'telephone' => $validated['telephone'],
                'date_naissance' => $request->input('date_naissance'),
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
            ]);

            $extraData = null;

            if ($validated['role'] === 'eleve') {
                $eleve = \App\Models\Eleve::create([
                    'user_id' => $user->id,
                    'niveau_scolaire' => $request->niveau_scolaire,
                    'date_naissance' => $request->date_naissance,
                ]);
                $extraData = $eleve;
            }

            if ($validated['role'] === 'repetiteur') {
                $photoPath = null;
                if ($request->hasFile('photo')) {
                    $photoPath = $request->file('photo')->store('repetiteurs', 'public');
                }

                $repetiteur = \App\Models\Repetiteur::create([
                    'user_id' => $user->id,
                    'matieres' => json_encode($request->input('matieres', [])),
                    'niveaux' => json_encode($request->input('niveaux', [])),
                    'biographie' => $request->input('biographie'),
                    'photo' => $photoPath,
                    'statut_verif' => 'non_verifie',
                    'rayon_intervention' => 10,
                    'date_naissance' => $request->input('date_naissance'),
                    'tarif_horaire' => 'required|numeric|min:0',


                ]);
                $extraData = $repetiteur;
            }

            return response()->json([
                'user' => $user,
                'details' => $extraData,
                'token' => $user->createToken('auth_token')->plainTextToken
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de l\'inscription',
                'error' => $e->getMessage()
            ], 500);
        }
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('profiles', 'public');
            $validated['photo'] = $path;
        }
    }

    public function login(Request $request)
    {

        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            if (!Auth::attempt($request->only('email', 'password'))) {
                throw ValidationException::withMessages([
                    'email' => ['Identifiants invalides'],
                ]);
            }

            $user = User::where('email', $request->email)->firstOrFail();
            $user->tokens()->delete(); // Supprime les anciens tokens

            return response()->json([
                'user' => $user,
                'token' => $user->createToken('auth_token')->plainTextToken
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la connexion',
                'errors' => $e->getMessage()
            ], 500);
        }
    }

    public function user(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
            // 'permissions' => $request->user()->getAllPermissions() // Si vous utilisez des permissions

        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté avec succès']);
    }
}
