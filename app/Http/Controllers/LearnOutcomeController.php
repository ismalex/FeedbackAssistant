<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\LearnOutcome;
use App\Template;

class LearnOutcomeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        return view('settings.templateoutcomes');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
        //TRY & CATCH VER COMO REFLEJARLAS EN EL FRONTEND
        try {
            $learnOut = new LearnOutcome();
            $learnOut->short_comment = $request->short_comment;
            $learnOut->long_comment = $request->long_comment;
            $learnOut->template_id = $request->template_id;
            $learnOut->save();
        }
        catch(Exception $exception) {
            //

        }
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
        return Template::find($id)->learnOutcomes;
        $learnOutcomes = LearnOutcome:: where('marking_sheet_id', $id)->get();
        return $learnOutcomes;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
        
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        $moduleCode = LearnOutcome::find($id)->code;
        LearnOutcome::destroy($id);
    }
}
