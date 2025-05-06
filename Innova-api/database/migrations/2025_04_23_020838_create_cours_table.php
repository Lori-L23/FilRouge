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
            $table->string('titre');
            $table->text('description')->nullable();
            $table->unsignedBigInteger('matiere_id');
            $table->string('matiere', 100);
            $table->unsignedBigInteger('repetiteur_id');
            $table->enum('niveau_scolaire', ['primaire', 'college', 'lycee']);
            $table->decimal('tarif_horaire', 8, 2);
            $table->timestamps();
        
            $table->foreign('matiere_id')->references('id')->on('matieres')->onDelete('cascade');
            $table->foreign('repetiteur_id')->references('id')->on('repetiteurs')->onDelete('cascade');
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
