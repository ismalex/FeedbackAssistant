<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    //
    protected $guarded = ['id'];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'marking_sheet_id', 'created_at', 'updated_at'
    ];

    //
    //CHANGE NAME TO TEMPLATES
    protected function markingsheet() {
        //
        return $this->belongsTo(Template::class);
    }
    
    //
    public function items(){
        //
        return $this->hasMany(Item::class);
    }
}
