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
        {
        Schema::table('transactions', function (Blueprint $table) {
            // Rendre cours_id nullable (car pas toujours disponible)
            $table->dropForeign(['cours_id']);
            $table->foreignId('cours_id')->nullable()->change();
            $table->foreign('cours_id')->references('id')->on('cours')->onDelete('cascade');
            
            // Ajouter une valeur par défaut pour mode_paiement
            $table->enum('mode_paiement', ['stripe', 'mobile money', 'virement', 'paypal'])->default('mobile money')->change();
            
            // Optionnel : Ajouter les champs manquants si besoin
            // $table->string('reference')->nullable();
            // $table->text('description')->nullable();
        });
    }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
         Schema::table('transactions', function (Blueprint $table) {
            $table->foreignId('cours_id')->nullable(false)->change();
            $table->enum('mode_paiement', ['stripe', 'mobile money', 'virement', 'paypal'])->default(null)->change();
        });
    }
};
