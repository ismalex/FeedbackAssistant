<?php

namespace App\Http\Controllers;

use App\Template;
use App\Module;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TemplateController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
        try{
            $template = new Template();
            $template->title = $request->templateTitle;
            $template->description = "-";
            $template->save(); 
        }
        catch(Exception $exception) {
            //
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Template  $template
     * @return \Illuminate\Http\Response
     */
    public function show(Template $template)
    {
        //
        return $templateList = Template::all();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getTemplateTitle($id)
    {
        //
        return Template::find($id)->title;
    }


     /**
     * GET TEMPLATES LIST LINKED TO A MODULE
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getModuleTemplates($module_id)
    {
        //
        $module = Module::find($module_id);
        return $module->templates;
    }

    
     /**
     * GET TEMPLATES LIST THAT ARE NOT LINKED TO A MODULE
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getUnassignedTemplates($module_id)
    {
        //
        $module = Module::find($module_id);
        $assignedTemplates = collect();
        foreach ($module->templates as $product)
        {
            $assignedTemplates = $assignedTemplates->concat([$product->pivot->template_id]); 
        }
        return Template::whereNotIn('id', $assignedTemplates)->get();
        
    }


         /**
     * DELETE THE RELATIONSHIP OF THE MODULE AND THE TEMPLATES ON THE PIVOT TABLE
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function attachModuleTemplate(Request $request)
    {
        //
        $module = Module::find($request->module_id);
        $module->templates()->syncWithoutDetaching([$request->template_id]);
        $templateTitle = Template::find($request->template_id)->title;

        //create directory 
        //if the module_code repeats the folder folder doesnt create.
        Storage::disk('c_path')->makeDirectory($module->code."/".$templateTitle);
    }


     /**
     * DELETE THE RELATIONSHIP OF THE MODULE AND THE TEMPLATES ON THE PIVOT TABLE
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function deleteModuleTemplate(Request $request )
    {
        //
        $module = Module::find($request->module_id);
        $module->templates()->detach([$request->template_id]);
    }


    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Template  $template
     * @return \Illuminate\Http\Response
     */
    public function edit(Template $template)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Template  $template
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Template $template)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Template  $template
     * @return \Illuminate\Http\Response
     */
    public function destroy(Template $template)
    {
        //
    }
}
