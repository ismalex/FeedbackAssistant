<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class LearnOutcome extends Model
{
    //
    protected $guarded = ['id'];

    /**
    * The attributes that should be hidden for arrays.
    *
    * @var array
    */
    protected $hidden = [
        'template_id', 'created_at', 'updated_at'
    ];
}
