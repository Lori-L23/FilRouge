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
        Schema::create('recherches', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('matiere_id');
            $table->enum('niveau', ['primaire', 'college/lycee']);
            $table->integer('rayon')->comment('Rayon en kilomètres');
            $table->dateTime('disponibilite');
            $table->enum('tri', ['proximite', 'tarif', 'note'])->default('proximite');
            $table->timestamps();

            // Clé étrangère vers la table des matières
            $table->foreign('matiere_id')
                  ->references('id')
                  ->on('matieres')
                  ->onDelete('cascade');
     
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recherches');
    }
};
