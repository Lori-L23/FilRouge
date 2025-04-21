<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReservationsTable extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eleve_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('repetiteur_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('lieus_id')->constrained('lieus')->cascadeOnDelete();
            $table->enum('statut', ['pending', 'confirmed', 'cancelled', 'completed']);
            $table->dateTime('date_debut');
            $table->dateTime('date_fin');
            $table->timestamps();

            // $table->index(['date_debut', 'date_fin']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
}