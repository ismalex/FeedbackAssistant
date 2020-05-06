<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    //
    protected $guarded = ['id'];

    //
    public function group() {
        //
        return $this->belongsTo(Group::class);
    }
}
