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
        Schema::create('cours', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eleve_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('reservation_id')->constrained('reservations')->cascadeOnDelete();
            $table->foreignId('lieu_id')->constrained('lieux')->cascadeOnDelete();
            $table->enum('statut', ['pending', 'confirmed', 'cancelled', 'completed']);
            $table->dateTime('date_debut');
            $table->dateTime('date_fin');
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cours');
    }
};
