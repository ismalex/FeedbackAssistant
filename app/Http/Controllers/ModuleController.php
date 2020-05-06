<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Arr;
use App\Module;
use App\Markingsheet;
use App\User;



class ModuleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        return view('settings.modules');
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
        //TRY & CATCH VER COMO REFLEJARLAS EN EL FRONTEND
        try {
            $module = new Module();
            $module->name = $request->moduleName;
            //if the module_code repeats will throw error 500 SQL constraint vilolation
            $module->code = strtoupper($request->moduleCode);
            $module->user_id = $request->lecturer;
            if($module->save()){
                //if the module_code repeats the folder folder doesnt create.
                Storage::disk('c_path')->makeDirectory($request->moduleCode);
            } 
            //cuando creo la carpeta si esta repetida no crea la carpeta 
        }
        catch(Exception $exception) {

        }
    }

    /**
     * Display all the modules registered on the DataBase.
     *  
     * @return \Illuminate\Http\Response
     */
    public function show()
    {
        //
        //CHECK TO GET  ALL THE MODULES ON THE DATABASE
        $users = User::all();
        $totalMoulesList = DB::table('modules')
         ->leftJoin('users', 'modules.user_id', '=', 'users.id')
         ->select('modules.id','code','modules.name as module_name','modules.user_id','email','users.name')->get();

        return (['totalModules' => $totalMoulesList, 'totalUsers' => $users]);
    } 



       /**
     * Display the module and template info on the subtitle.
     *  
     * @return \Illuminate\Http\Response
     */
    public function getSubtitleInfo(Request $request)
    {
        //
        $module = Module::find($request->module_id);
        $templateTitle = $module->templates->where('id', '=', $request->template_id)->first()->title;
        $subTitle = $module->code .' ‒ '. $module->name. ' / '.$templateTitle;
        if($request->student > 0){
            $subTitle =  $subTitle.' / ' .$request->student;
        }

        return $subTitle;
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
        //delete from database
        $moduleCode = Module::find($id)->code;
        Module::destroy($id);
        //delete file
        //Storage::disk('c_path')->delete($moduleCode);
    }
    
    /**
     * Show the modules list with markingsheets of every module that belongs to a User based on user_id
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function getUserModules() {
        //
        //SE NECESITA IMPLEMENTAR TRY Y CATCH
        $Authuser = Auth::user(); 
        return $userModules = Module::where('user_id', $Authuser->id)->with('templates')->get();

    }

    /**
     * Show the student list from .csv file 
     * that belongs to a of a module based on the module_id
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function getStudentList(Request $request) {
        //
        try { 
            $moduleCode = Module::find($request->module_id)->code;
            $filePath = Storage::disk('c_path')->path($moduleCode.'\ModuleStudents.csv');
            //return $this->getCompareMarks($request->module_id, $request->template_id, 11111);
            if(File::exists($filePath)){
                //return $filePath;
                $fileRecords = file($filePath, FILE_IGNORE_NEW_LINES,);
                $collection = collect();
                $data = [];
                
                foreach($fileRecords as $student){
                    $data['student_id'] = $student;
                    $data['student_email'] = $student;
                    $data['marked'] = $this->getCompareMarks($request->module_id, $request->template_id, $student); 

                    $collection->add($data);
                }
               
                return $collection; 
            }
            else{
                /* dd($filePath); */
                //FILE DONT EXIST
            }

        } catch (Exception $e) {
            report($e);       
            return false;
        }
    }

    
    /**
     * Compare the student list with the generated pdf data 
     * 
     * 
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function getCompareMarks($moduleId, $templateId, $studentId) {

        //
        try{

            $module = Module::find($moduleId);
            $moduleCode = $module->code;
            $templateTitle = $module->templates->where('id', '=', $templateId)->first()->title;

            $filePath = Storage::disk('c_path')->path($moduleCode."/".$templateTitle."/");
            if(File::exists($filePath.$studentId."/".$studentId.".pdf")){ 
                return true;
            }else{
                return false;
            }
        }
        catch(Exception $exception){

        }
    }

    /**
     * Show the send marking feedback view
     * 
     * 
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function showStudentList() {
        //
        return view('marking.students');
    }

   

}
