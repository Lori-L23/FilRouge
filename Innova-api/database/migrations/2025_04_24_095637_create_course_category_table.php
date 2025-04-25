<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('course_category', function (Blueprint $table) {
            $table->foreignId('course_id')->constrained('cours')->onDelete('cascade');
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->primary(['course_id', 'category_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('course_category');
    }
};