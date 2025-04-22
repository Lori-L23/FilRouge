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
        Schema::disableForeignKeyConstraints();

        Schema::table('paiements', function (Blueprint $table) {
            $table->dropForeign(['reservation_id']);
        });
    
        Schema::table('paiements', function (Blueprint $table) {
            $table->foreign('reservation_id')
                  ->references('id')
                  ->on('reservations')
                  ->onDelete('cascade');
        });
    
        Schema::enableForeignKeyConstraints();
    }
   

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
