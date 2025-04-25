<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;



class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        
    ];
    public function cours()
    {
        return $this->belongsToMany(Cours::class, 'course_category');
    }
}
