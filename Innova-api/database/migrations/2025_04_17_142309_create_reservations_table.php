<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eleve_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('repetiteur_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('lieu_id')->constrained();
            $table->enum('statut', ['pending', 'confirmed', 'cancelled', 'completed']);
            $table->dateTime('date_debut');
            $table->dateTime('date_fin');
            $table->timestamps();
            
            $table->index(['date_debut', 'date_fin']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
