<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Module;
use App\Studentmark;
use App\MarkingSheet;
use App\Template;
use App\LearnOutcome;
use App\Group;
use App\Item;

class StudentmarkController extends Controller
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
        try { 
            $existingStudentMark = Studentmark::where('student_id', '=', $request->student_id)
            ->where('module_id','=', $request->module_id)
            ->where('marking_sheet_id','=', $request->marking_sheet_id)->get();

            if($existingStudentMark->isEmpty()){
                //Create new register if not exists
                $studentMark = new Studentmark(); 
                $studentMark->student_id = $request->student_id;
                $studentMark->module_id = $request->module_id;
                $studentMark->marking_sheet_id = $request->marking_sheet_id;
                $studentMark->data_collection = json_encode($request->formData); 
                $studentMark->save();

            }
            else{
                //update register if it exists
                $updateStudentMark = Studentmark::find($existingStudentMark->first()->id);
                $updateStudentMark->data_collection = json_encode($request->formData);
                $updateStudentMark->save();
            } 
        }
        catch(Exception $exeception){

        }
    }

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

     /*    if($comments->count() == 0){
            $comments = collect();
        }
 */
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
    public function show(Request $request)
    {
        //     
        $markingInfo = Studentmark::where('student_id', '=', $request->student_id)
        ->where('module_id', '=', $request->module_id)
        ->where('marking_sheet_id','=', $request->marking_sheet_id)
        ->orderBy('id', 'DESC')->first();   

        if (!$markingInfo) {
            //Student data does not exists
            return;
        }

        //Get the learning outcomes form the json data stored on the database
        //CHECK THE ERROR WHEN THERES NO CHECKBOXES OR LEARNING OUTCOMES INDEX ON THE DATA COLLECTION
        $dataCollection = collect(json_decode($markingInfo->data_collection));
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
    }

    /* fucntion to get the user id 111111, moduleId, markingSheetId
    then to get if its true
    return the path else null
    find the path module name/assigment/student/pdf
    get the file  */


        /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function showMarkStudent(Request $request)
    {
        //     
        return $markingStudentList = Studentmark::where('module_id', '=', $request->module_id)
        ->where('marking_sheet_id','=', $request->marking_sheet_id)->get();

    }
}
