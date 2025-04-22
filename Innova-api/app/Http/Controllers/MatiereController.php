<?php

namespace App\Http\Controllers;

use App\Models\Matiere;
use Illuminate\Http\Request;

class MatiereController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Matiere::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Matiere $matiere)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Matiere $matiere)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Matiere $matiere)
    {
        //
    }
}
