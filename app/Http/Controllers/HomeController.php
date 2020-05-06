<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
//
use App\Module;
use App\Template;


class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        $successStatus = 200;
        $user = Auth::user(); 
      /*  return  $user->getToken('webfeedback')-> accessToken;  */
        $success['access_token'] =  $user->createToken('webfeedback')-> accessToken; 
        //CHECK IF THE ACCESS IS ALREADY GENERATED
        //and return the access-key 

        //$data = response()->json(['success' => $success]); 

        //TEST PIVOT TABLE 
       /*  $module = Module::first();
        $templates = Template::all(); */

        //delete the relationship data 
        //$module->templates()->detach([1,2,3]);

       // $modules->templates()->attach($templates);
        //syncWihoutDetaching
        //test if you add the sama it gets duplicated 
        
      /*   dd(
        $modules
        ); */
        
        //return view('home');
        return view('home')->with($success);
    }
    
}
