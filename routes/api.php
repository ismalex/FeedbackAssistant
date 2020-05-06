<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user(); 
});

//USER REGISTRATION
Route::post('/register', 'AuthController@register');


//ROUTES THAT NEED AUTHENTICATION 
Route::group(['middleware' => 'auth:api'], function(){
 
    
    //GET MODULES BASED ON A USER_ID 
    Route::get('user/modules/', 'ModuleController@getUserModules');
    //URL TO GET STUDENT LIST BASED ON MODULE_ID
    Route::get('module/students/', 'ModuleController@getStudentList');
    //URL TO GET THE SUBTITLE INFOMATION 
    Route::get('module/subtitle/', 'ModuleController@getSubtitleInfo');

    //URL TO GET THE MARKING SHEET DATA BASED ON MARKINGSHEET_ID/ ASSIGMENT_ID
    Route::get('module/markingtemplate/{id}', 'MarkController@show');
    //URL TO SAVE THE MARKING DATA THAT BELONGS TO A STUDENT
    Route::post('markingsheet/store', 'StudentmarkController@store');
    //URL TO GET THE DATA FOR THE MODAL/ DOCUMENT REVIEW 
    Route::get('markingsheet/review/', 'StudentmarkController@show');
    

    //SETTINGS
    //MODULES
    //URL TO CREATE A NEW MODULE ON THE DATABASE
    Route::post('settings/modules/store', 'ModuleController@store');    
    //URL TO DELTE A MODULE ON THE DATABASE
    //CONSTRAINTS? FORGEINKEYS?
    Route::delete("settings/modules/delete/{id}", 'ModuleController@destroy');
  
    //URL TO GET THE INFORMATION OF ALL THE MODULES REGISTERED ON THE DATABASE 
    Route::get('settings/modules/all', 'ModuleController@show');

    
    //TEMPLATE
    //ROUTE TO GET TEMPLATE NAME TO SHOW ON THE FRONT END
    Route::get('settings/templates/title/{id}', 'TemplateController@getTemplateTitle'); 
    //ROUTE TO SAVE A NEW MARKING TEMPLATE
    Route::post('settings/templates/store', 'TemplateController@store');
    //ROUTE TO DELETE THE MARKING TEMPLATE 
    //CHECK THE CASCADE DELETE 
    Route::delete('settings/templates/delete/{id}', 'MarkController@destroy');
    //GET ALL TEMPLATES ON THE DATABASE 
    Route::get('settings/templates/all', 'TemplateController@show');
    

    //TEMPLATE ASSIGNATION TO A MODULE
    //GET THE TEMPLATES ASSIGNED TO A MODULE
    Route::get('settings/templates/list/{id}', 'TemplateController@getModuleTemplates');
    //GET THE TEMPLATES THAT ARE NOT ASSIGNED TO A MODULE
    Route::get('settings/templates/unlist/{id}', 'TemplateController@getUnassignedTemplates');
    //CREATE THE RELATIONSHIP BETWEEN THE MODULE AND THE TEMPLATE 
    Route::get('settings/templates/assgin/', 'TemplateController@attachModuleTemplate');
    //DELETE THE RELATIONSHIP BETWEEN THE MODULE AND THE TEMPLATE
    Route::get('settings/templates/delete/', 'TemplateController@deleteModuleTemplate');

    
  
    //LEARNING OUTCOMES
    //GET GROUPS LINKED TO THE SELECTED MARKING TEMPLATE
    Route::get('settings/templates/groups/{id}', 'GroupController@show');
    
    //URL TO GET THE DATA OF THE LEARNING OUTCOMES LINKED TO A TEMPLATE
    Route::get('settings/templates/learning/{id}', 'LearnOutcomeController@show');
    //URL TO SAVE THE DATA OF THE LEARNING OUTCOMES
    Route::post('settings/templates/learning/save', 'LearnOutcomeController@store');
    //URL TO DELETE THE DATA OF THE LEARNING OUTCOMES
    Route::delete('settings/templates/learning/delete/{id}', 'LearnOutcomeController@destroy');
    
    //GROUPS
    
    //SAVE GROUPS TO THE SELECTED MARKIING TEMPLATE
    Route::post('settings/templates/groups/save', 'GroupController@store'); 
    //DELETE THE GROUPS ON THE MARKING TEMPLATE
    Route::delete('settings/templates/groups/delete/{id}', 'GroupController@destroy');

    //ITEMS
    //DELETE ITEMS FROM THE GROUP ON THE MARKING TEMPLATE
    Route::delete('settings/templates/groups/items/delete/{id}', 'GroupController@destroyItem');
    //SAVE ITEMS ON THE SELECTED GROUP
    Route::post('settings/templates/groups/items/save', 'GroupController@storeItem'); 
    //GET THE ITEMS FROM THE GROUP ON THE MARKNG TEMPLATE
    Route::get('settings/templates/groups/items/{id}', 'GroupController@showGroupItems');

    //SEND FEEDBACK
    //GET THE STUDENTS THAT HAVE A MARKING TEMPLATE ON THE DATABASE 
    Route::get('settings/students/feedback', 'StudentMarkController@showMarkStudent');
    //GENERATE PDF AND SAVE THE PDF FILE ON THE DESIGNATED ROUTE 
    Route::get('markingtemplate/pdf', 'PDFMakerController@generate');
    //URL TO SEND EMAILS WITH GENERATED FEEDBACK
    Route::get('module/sendmail', 'MarkController@sendMarks');  
    
});


