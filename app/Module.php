<?php

namespace App;

use Illuminate\Database\Eloquent\Model;


class Module extends Model
{
    /**
     * The attributes that are not mass assignable.
     *
     * @var array
     */
    protected $guarded = ['id'];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'user_id', 'created_at', 'updated_at'
    ];


    /**
     * Create a new controller instance.
     *
     * @return void
     */
    /* public function __construct()
    {
        $this->middleware('auth');
    }*/

     /**
     * Return the markingsheet linked to a module.
     *
     * @return void
     */
    public function students() {
        //
        return $this->hasMany(Student::class);
    }


     /**
     * Return the students linked to a module.
     * DELETE THIS AFTER TESTING
     *
     * @return void
     */
    public function markingsheets() {
        //
        return $this->hasMany(Markingsheet::class);
    }

    
     /**
     * Return the templates linked to a module.
     *
     * @return void
     */
    public function templates() {
        //
        return $this->belongsToMany(Template::class)->withTimestamps();
    }


}
