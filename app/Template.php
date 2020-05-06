<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Template extends Model
{
    //
    protected $guarded = ['id'];

    /**
    * The attributes that should be hidden for arrays.
    * @var array
    */
    protected $hidden = [
        'created_at', 'updated_at'
    ];
    

    /**
    * Return the modules linked to a template.
    * @return void
    */
    public function modules() {
        //
        return $this->belongsToMany(Templates::class)->withTimestamps();
    }


    /**
    * Return the modules linked to a template.
    * @return void
    */
    protected function groups() {
        //
        //return $this->hasMany(Group::class);
        return $this->hasMany(Group::class);
    }

    /**
    * Return the modules linked to a template.
    * @return void
    */
    protected function learnOutcomes() {
        //
        //return $this->hasMany(Group::class);
        return $this->hasMany(LearnOutcome::class);
    }


}
