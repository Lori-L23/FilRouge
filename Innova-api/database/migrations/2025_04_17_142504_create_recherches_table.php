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
            $table->foreignId('matiere_id')
                ->constrained('matieres')
                ->onDelete('cascade');
            $table->enum('niveau', ['primaire', 'college/lycee']);
            $table->integer('rayon')->comment('Rayon en kilomètres');
            $table->dateTime('disponibilite');
            $table->enum('tri', ['proximite', 'tarif', 'note'])->default('proximite');
            $table->timestamps();
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
