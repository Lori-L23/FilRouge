<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


class CreateReservationsTable extends Migration
{
    public function up()
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eleve_id')->constrained('eleves')->cascadeOnDelete();
            $table->foreignId('repetiteur_id')->constrained('repetiteurs')->cascadeOnDelete();
            $table->foreignId('lieu_id')->constrained('lieux')->cascadeOnDelete();
            $table->enum('statut', ['pending','confirmed','cancelled','completed']);
            $table->dateTime('date_debut');
            $table->dateTime('date_fin');
            $table->timestamps();
        });
    }
    

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
}

