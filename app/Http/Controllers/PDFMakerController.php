<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use App;
use App\Module;
use App\MarkingSheet;
use App\Template;
use App\LearnOutcome;
use App\Studentmark;
use App\Group;
use App\Item;

class PDFMakerController extends Controller
{
    //
    /*FUNCTIONS TO GET THE STUDENT MARK DATA TO SHOW ON THE DOCUMENT REVIEW REVIEW  */
    /**
    * MANIPULATE THE ARRAY/JSON WE GET FROM THE DATABASE TO PASS IT 
    * TO PASS IT TO THE getGroupItems FUNCTION TO GET THE SELECTED DATA FROM 
    * THE DATABASE.
    *
    * @param  int  $id
    * @return \Illuminate\Http\Response
    */
    public function getItemsCollection($dataCollection){
        //get the data from the DB and sorted it.
        //$data = collect(json_decode($markingInfo->group_collection));
        if($dataCollection['checkboxes'] == null) {
            return;
        }
        $dataChecked= collect($dataCollection['checkboxes']);
        $unsortedData = $dataChecked->sort();
        $sortedData = $unsortedData->values()->all();
        
        //get the unique values of a group that contains the collection
        //[1,2] groups id
        //Get the data id of the items inside the groups without the group word
        //[1_1,1_2,1_9]
        $groups= collect();
        $allItems= collect();
        foreach( $sortedData as $item ){
            $replacedStr = str_replace('group', '', $item);
            $truncatedStr = strstr($replacedStr, '_', true);
            $groups = $groups->concat([$truncatedStr]); 
            $allItems = $allItems->concat([$replacedStr]); 
        }
        $unique = $groups->unique();
  
        //Compare the data from the unique values collection 
        //and the item id 
        //to get a final array used to match the id with the data base.
        $final = collect();
        $content = collect();
        foreach( $unique as $unData ) {
            foreach( $allItems as $i ){
                $pieces = explode("_", $i);
                if(!strcmp($pieces[0], $unData)){
                    $content = $content->concat([$pieces[1]]);
                }
            }
            $final= $final->put($unData, $content);
            $content = collect();
        }
        return $final;
    }


    /**
     * get the necesary items from the database based on the 
     * data on the table student mark
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getGroupItems($markingTemplateId, $collection){
      
        //Get the groups linked to the marking sheet 
        //$markingTemplateId = 1; 
        $info = collect();
        foreach($collection as $key => $groupItems){
            //get the groups that are linked to the marking sheet id 
            //and the seleted items linked to those groups
            $g = Group::where('id', $key)->where('template_id', $markingTemplateId)
            ->with(['items' => function($query) use ($groupItems){
                $query->whereIn('id', $groupItems);
            }])->get();
            $info = $info->concat($g);
        }
        return $info;

    }


        /**
     * get the necesary items from the database based on the 
     * data on the table student mark
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getSeparatedItems($dataCollection, $prefix){
        //
        $data = collect();
        //Get only the data related to the groups comments 
        //from the json object with the prefix Gen1 = GOOD COMMENTS. Gen2 = IMPROVE COMMENTS
        foreach($dataCollection as $key => $d){
            if(Str::contains($key, 'group')){
                $data = $data->put($key,$d);
            }
        } 

        $groups = collect();
        foreach( $data as $key => $item ){
            $replacedStr = str_replace('group', '', $key);
            $groups = $groups->put($replacedStr, $item); 
        }

        $finalItems = collect();
        //Get only the data related to the General comments 
        //from the json object with the prefix _Ob = Group Observations,  _mark = Groups Selected Marks
        foreach($groups as $key => $d){
            if(Str::contains($key, $prefix)){
                $finalItems = $finalItems->put($key, $d);
            }
        } 
        return $finalItems;
    
    }



    /**
    * get the necesary items from the database based on the 
    * data on the table student mark
    *
    * @param  int  $id
    * @return \Illuminate\Http\Response
    */
    public function AddItems($collection, $dataCollection, $prefix){
    
        //
        //THIS TO ADD AN ITEM INSIDE THE COLLECTION we retrieved from the THE DATABASE 
        $dataCollection->map(function ($item) use ($collection, $prefix )
        {
            $contentData = "";
            foreach($collection as $key => $content){
                $pieces = explode("_", $key);
                if(!strcmp($item->id, $pieces[0])){
                    $contentData = $content;
                }
             
            } 
            $item[$prefix] = $contentData;
            return $item;
        });

        return $dataCollection;
    }



    /**
     * get the selected learning outcomes items from the database based on the 
     * data on the table student mark
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getLearningOutcomes($markingTemplateId, $dataCollection){
      
        //Get the learning outcomes form the json data stored ont he database
        //$data = collect(json_decode($markingInfo->group_collection));
        $dataChecked= collect($dataCollection['learningOut']);

        //process the data to get the selected learning Outcomes
        $learnOuts= collect(); 
        foreach( $dataChecked as $item ){
            $replacedStr = str_replace('learn', '', $item);
            $learnOuts = $learnOuts->concat([$replacedStr]); 
        }
        //get the groups that are linked to the marking sheet id 
        //and the seleted items linked to those groups with data form the data base
        $outs = LearnOutcome::where('template_id', $markingTemplateId)->whereIn('id', $learnOuts)->get();
        return $outs;

    }


    /**
     * get the General comments based on the json obeject on the database from the database based on the 
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getGeneralComments($dataCollection, $prefix){
        
        //
        $comments = collect();
        //Get only the data related to the General comments 
        //from the json object with the prefix Gen1 = GOOD COMMENTS. Gen2 = IMPROVE COMMENTS
        foreach($dataCollection as $key => $d){
            if(Str::contains($key, $prefix)){
                $comments= $comments->concat([$d]);
            }
        } 
        return $comments->implode('');
    }

     /**
     * get the General comments based on the json obeject on the database from the database based on the 
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getTotalMark($dataCollection){
        //
        //Get only the data related to the General comments 
        $totalMark = 0;
        //from the json object with the prefix Gen1 = GOOD COMMENTS. Gen2 = IMPROVE COMMENTS
        foreach($dataCollection as $key=>$d){
            if(Str::contains($key, "_mark")){
                if (is_numeric($d)){
                    $totalMark += (int)$d;
                }
            }
        } 
        return $totalMark;
    }

    /**
     * get the General infor fromt he marking sheet like 
     * studentId , module Name and Code, 
     * MarkingSheet Info
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getGeneralInfo($request){
        //
        $info = collect();
        $moduleInfo = Module::find($request->module_id);
        $info = $info->put('moduleName', $moduleInfo->code ." - ".$moduleInfo->name);
        $markingSheetInfo = Template::find($request->marking_sheet_id);
        $info = $info->put('markSheetTitle', $markingSheetInfo->title);
        $info = $info->put('studentId', $request->student_id); 

        return $info;

    }


   /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($request)
    {
        //     
        $markingInfo = StudentMark::where('student_id', '=', $request->student_id)
        ->where('module_id', '=', $request->module_id)
        ->where('marking_sheet_id','=', $request->marking_sheet_id)
        ->orderBy('id', 'DESC')->first();   

        if (!$markingInfo) {
            //Student data does not exists
            return;
        } 
       
        //Get the learning outcomes form the json data stored on the database
        $dataCollection = collect(json_decode($markingInfo->data_collection));
        //Get the Marking_sheet_id realted to this selected data    //FALTA

        //Get the selected groups and items from the data base.
        $decodedData = $this->getItemsCollection($dataCollection);
        $selectedGroupItems = $this->getGroupItems($markingInfo->marking_sheet_id, $decodedData);
        //GET THE INDIVIDUAL MARK OF THE GROUP ON THE DATABASE
        $gMarks =  $this->getSeparatedItems($dataCollection, "_mark");
        //Add the marks to the final collection 
        $selectedMarks =  $this->AddItems($gMarks, $selectedGroupItems, "mark" );
        //GET THE COMMENTS/observations ON EVERY GROUP
        $gObservations = $this->getSeparatedItems($dataCollection, "_ob");
        //Add the observations to the final collection 
        $selectedData = $this->AddItems($gObservations, $selectedMarks, "ob" );
        //GET TOTAL MARK FROM THE JSON IN THE DATA BASE
        $totalMark = $this->getTotalMark($dataCollection);
        //GET THE SELECTED LEARINIG OUTCOMES 
        $selectedLearningOutcomes = $this->getLearningOutcomes($markingInfo->marking_sheet_id, $dataCollection);
        //GET THE GENERAL COMMENTS
        //prefix Gen1 = GOOD COMMENTS. Gen2 = IMPROVE COMMENTS
        $goodComment = $this->getGeneralComments($dataCollection, "Gen1");
        $impComment = $this->getGeneralComments($dataCollection, "Gen2");
        //get the heading info marking sheet name, module code and Name
        $genInfo = $this->getGeneralInfo($request);

        return (['selGroupItems' => $selectedData, 'selLearnOutcomes' => $selectedLearningOutcomes,
        'genGoodComment' => $goodComment, 'genImpComment' => $impComment, 'totalMark' => $totalMark, 
        'generalInfo' => $genInfo ]);

    }


    function getHeader($request, $totalMark) {
        //
        $module = Module::find($request->module_id);
        //$template = $module->templates;
        $templateInfo = Template::find($request->marking_sheet_id);
        $date = Carbon::now()->toDateString();

        return $header = "<h2>".$module->code." - ".$module->name." </h2>
        <h4 style=margin-top: -10px;>".$templateInfo->title."</h4>
        </br>
        <h5>
            <b>
                <div> FIRST MARKER: </div>
                <div> DATE: ".$date."</div>
                <div> SID: ".$request->student_id." </div>
                <div>TOTAL MARK: $totalMark %</div>
            </b>
        </h5>";
    }


    function getFilePath($request) {
        //
        $path = '';
        $moduleCode = Module::find($request->module_id)->code;
        $templateTitle = Template::where('id', '=', $request->marking_sheet_id)->first()->title;
        $filePath = Storage::disk('c_path')->path($moduleCode."/".$templateTitle."/");

        if(File::exists($filePath)){
            $studentPath = $moduleCode."/".$templateTitle."/".$request->student_id;
            Storage::disk('c_path')->makeDirectory($studentPath);
            $path =  $studentPath."/".$request->student_id.".pdf";
        }
        return $path;

    }
    
    public function extractData($request) { 
        //
        $selectedData = $this->show($request);

        $header = $this->getHeader($request, $selectedData['totalMark']);//generalInfo
        $groupData = "";
        foreach($selectedData['selGroupItems'] as $group) {
            $groupData = $groupData.'<h5 style="text-transform: uppercase;">'.$group->title.
            ' ('.$group->mark.' out of '.$group->total_mark.')</h5>';

            $groupData = $groupData.'<ul>';
			foreach($group->items as $item){
                $groupData = $groupData.'<li>'.$group->character.'.- '.$item->long_comment.'</li>';
            }
            $groupData = $groupData.'</ul>';

            if(strcmp($group->ob, "")){
                $groupData = $groupData.
                '<h5 style="margin-bottom: 0px;">Observations</h5>
                <p style="margin-top: 0px; align=justify">'.$group->ob.'</p>';  
            }
           
        } 

        $learnOutcomes = "<ul>";
        foreach($selectedData['selLearnOutcomes'] as $out) {
            $learnOutcomes = $learnOutcomes.'<li>'.$out->long_comment.'</li>';
			
        } 
        $learnOutcomes = $learnOutcomes."</ul>";

        $goodComment = "";
        if(strcmp($selectedData['genGoodComment'], "")){
            $goodComment = '<h5 style="margin-bottom: 0px;" >WHAT YOU DID GOOD:</h5>
                            <div style="margin-top: 0px; align=justify">'.        
                                $selectedData['genGoodComment'].
                            '</div>';
        }

        $impComment = "";
        if(strcmp($selectedData['genImpComment'], "")){
            $impComment = '<h5 style="margin-bottom: 0px;" >YOU COULD DO THE FOLLOWING TO IMPROVE YOUR WORK IN THE FUTURE:</h5>
                            <div style="margin-top: 0px; align=justify">'.        
                                $selectedData['genImpComment'].
                            '</div>';
        }
      

       
        $htmlData = 
        $header."
        <p align=justify>
            The following is a set of feedback to help you to identify improvements, and feed forward on what you have done well. We hope that you will be able to use the feedback to continue to improve your work and continue with already good practice. If you wish to discuss this feedback in person please see the ModuleTutor.
        <p/>
      
        <h4>Feedback</h4>
        <hr/>
        Throughout your script you will see the following codes. Here is anexplanation of what they mean. Please use these to guide you in your future assignments:
        <br/>
        $groupData
        <h5> IF YOU HAVE PASSED THIS MODULE, YOU WILL ALSO HAVE ACHIEVED THE FOLLOWING: </h5>
        $learnOutcomes
        $goodComment
       
        $impComment 
        
        <br/>
        <small>You may wish to keep a note of these achievements, for use in your personal development planning. </small>
        ";

        return $html= "
        <html>
            <head>
                <style>
                    @font-face {
                        font-family: 'Helvetica';
                        font-weight: normal;
                        font-style: normal;
                        font-variant: normal;
                        src: url(font_url);
                    }
                    body {
                        font-family: Helvetica, sans-serif;
                    }
                </style>
            </head>
            <body>"    
                .$htmlData.
            "</body>    
        </html>";
    }


    function generate(Request $request){
        //
        $pdfDocument = App::make('dompdf.wrapper');
        $docContent = $this->extractData($request);

        $createFilePath = $this->getFilePath($request);
        if(strcmp($createFilePath, "")){
            $pdfDocument->loadHTML($docContent);
            $pdfDocument->save(Storage::disk('c_path')->path($createFilePath));
            
        }
    }
}
