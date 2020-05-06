<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
     //
    protected $guarded = ['id'];


       /**
     * Return.
     *
     * @return void
     */
     //
    public function module() {
        //
        return $this->belongsTo(Module::class);

    }
}
