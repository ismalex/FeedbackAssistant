<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MarkingSheet extends Model
{
    //
    protected $guarded = ['id'];

    
    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'description', 'created_at', 'updated_at'
    ];

    //
    protected function module() {
        //
        return $this->belongsTo(Module::class);
    }

    //
    protected function groups() {
        //
        //return $this->hasMany(Group::class);
        return $this->hasMany(Group::class, 'marking_sheet_id');
    }

    
    //
    protected function learnOutcomes() {
        //
        return $this->hasMany(learnOutcome::class, 'marking_sheet_id');
    }

}
