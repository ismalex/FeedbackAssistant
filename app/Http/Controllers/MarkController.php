<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use App\Mail\FeedbackMail;
use App\Template;
use App\MarkingSheet;
use App\Module;
use App\Group;
use App\Item;
use App\LearnOutcome;

class MarkController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        return view('marking.markingsheet');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getTemplateTitle($id)
    {
        //
        return MarkingSheet::find($id)->title;
    }

    /**SEND EMAIL **/
    /**
     * 
     * 
     * 
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function showSendFeedback()
    {
        //
        return view('marking.sendmark');
    }


    /**
     * Send email.
     * 
     * 
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function sendMarks(Request $request) {
        //
        $selectedStudent = collect(json_decode($request->studentList));
        if(empty($selectedStudent['selected'])){
             return;
        } 
 
        $moduleCode = Module::find($request->module_id)->code;
        $templateTitle = MarkingSheet::where('module_id', '=', $request->module_id)
        ->where('id', '=', $request->marking_sheet_id)->first()->title;
        $filePath = Storage::disk('c_path')->path($moduleCode."/".$templateTitle."/");
        
        foreach($selectedStudent['selected'] as $student){
            $studentId = str_replace('stu_', '', $student);
            if(File::exists($filePath.$studentId."/".$studentId.".pdf")){ 
                //change to user id
                Mail::to('email@email.com')->send(new FeedbackMail(
                    $moduleCode."/".$templateTitle."/".$studentId."/".$studentId.".pdf"));   
            }
        }

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
     * Display the specified resource.
     * GET THE DATA FROM THE MARKING SHEET
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
        //CHANGE TO TEMPLATE CONTROLLER FUNCTION SHOWMARKINGTEMPLATE
        $template = Template::find($id);
        $learnOutcomes = $template->learnOutcomes;
        //$markingTemplate = $template->groups->with('items')->get();
        //->with('items');
        $markingTemplate = Group::where('template_id', $id)->with('items')->get();
        //$learnOutcomes = LearnOutcome:: where('marking_sheet_id', $id)->get();
        return (['markingTemplate' => $markingTemplate, 'markingOutcomes' => $learnOutcomes]);
    }


    /**
     * Display the specified resource.
     * GET THE marking sheet template data that has not been assigned to a module
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getUnsigned(){
        //
        return Markingsheet::where('module_id', "=", null)->get();
       
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
        try{
            $module = new MarkingSheet();
            $module->title = $request->templateTitle;
            $module->description = "-";
            $module->save(); 
        }
        catch(Exception $exception) {
            //idk what this does
        }
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
        $template = MarkingSheet::find($id);
        $templateTitle = $template->title;
        $prev_module_id = $template->module_id;
        $prev_module = Module::find($prev_module_id);
        $template->module_id = null;
        $template->save();

        //delete directory 
        $deletePath = Storage::disk('c_path')->getDriver()->getAdapter()->getPathPrefix()
        .$prev_module->code."/".$templateTitle;
        File::deleteDirectory($deletePath);
        //Storage::disk('c_path')->delete($prev_module->code."/".$templateTitle);
      
    }

    /* LEARNING OUTCOMES  */
    /**
     * Display the specified resource.
     * sHOW LEARNING OUTCOMES OF A MARKING SHEET
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getLearnOutcomes($id)
    {
        //
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
        $template = MarkingSheet::find($id);
        $templateTitle = $template->title;
        $template->module_id = $request->moduleId;
        $template->save();

        //create directory 
        //if the module_code repeats the folder folder doesnt create.
        $module = Module::find($request->moduleId);
        Storage::disk('c_path')->makeDirectory($module->code."/".$templateTitle);
        
    }


    //**MARKING TEMPLATES FUNCTIONS**
    /**
     * Display a listing of the resource on the settings view 
     *
     * @return \Illuminate\Http\Response
     */
    public function showTemplates()
    {
        //
        return view('settings.template');
    }

     /**
     * 
     * GET THE ALL THE MARKINGSHEETS/TEMPLATES LINKED TO A MODULE
     * 
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getTemplates($id)
    {
        //
        $module = Module::find(4);
        $templates = Template::all();

        //$modules->templates()->attach($templates);
       // $module->templates()->syncWithoutDetaching([1]);
        //  syncWithoutDetaching
        //syncWihoutDetaching
        //test if you add the sama it gets duplicated 

        return $module->templates;
        //
        $markingTemplates = "";
        if($id == 0){
            $markingTemplates = MarkingSheet::all();
        }
        else{
            $markingTemplates = MarkingSheet::where('module_id', $id)->get();
        }
        
        return $markingTemplates;
    }

     /**
     * 
     * 
     * 
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function showAssign()
    {
        //
        return view('settings.assign');
    }


    //**GROUP ITEMS FUNCTIONS**
     /**
     * Display a listing of the resource on the settings view 
     *
     * @return \Illuminate\Http\Response
     */
    public function showGroups()
    {
        //
        return view('settings.templategroups');
    }
    /**
     * get the groups linked to a markingtemplate based on markingtemplate_id
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getGroups($markingTemplateId)
    {
        //
        $markingTemplate = MarkingSheet::find($markingTemplateId);
        return $markingTemplate->groups;
        
    }
    /**
     * get the items linked to a group based on group_id
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getItems($groupId)
    {
        //
        $group = Group::find($groupId);
        return $group->items;
    }

}
