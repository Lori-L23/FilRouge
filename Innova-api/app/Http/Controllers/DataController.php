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
        $paiements = Paiement::with('reservation')->get();
        return response()->json($paiements);
    }
}