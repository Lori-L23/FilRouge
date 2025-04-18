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
        try{
            $request->validate([
                'nom' => 'required|string',
                'prenom' => 'required|string',
                'email' => 'required|email|unique:users,email',
                'telephone' => 'required|string',
                'date_naissance' => 'required|date',
                'password' => 'required|confirmed',
                'userType' => 'required|in:eleve,repetiteur',
                'niveau_scolaire' => 'nullable|string',
                'matieres' => 'nullable|array',
                'niveaux' => 'nullable|array',
                'biographie' => 'nullable|string',
            ]);

            $user = User::create([
                'nom' => $request['nom'],
                 'prenom' => $request['prenom'],
                 'email' => $request['email'],
                 'telephone' => $request['telephone'],
                 'date_naissance' => $request['date_naissance'],
                 'password' => Hash::make($request['password']),
                 'role' => $request['userType'],
                 'niveau_scolaire' => $request['niveau_scolaire'] ?? null,
                 'matieres' => $request['matieres'] ?? [],
                 'niveaux' => $request['niveaux'] ?? [],
                 'biographie' => $request['biographie'] ?? null,
             ]);

             return response()->json([
                'user' => $user]);


        }
        catch(ValidationException $e){
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $e->errors() ]
            , 422);
        }
        catch(\Exception $e){
            return response()->json([
                'message' => 'Erreur lors de l\'inscription',
                'errors' => $e->getMessage() ]
            , 500);
        }
        
    }

    public function login(Request $request)
    {

        try {
            $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
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
            'token' => $user->createToken('auth_token')->plainTextToken,
        ]);   
        } 
        catch (ValidationException $e) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } 
        catch (\Exception $e) {
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
