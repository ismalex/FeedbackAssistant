<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
      return view('auth.login'); 
//      return view('home'); 
});
//CHECK THE VIEWS WITH THE LOGIN, REDIRECTS AND RELOADS
//HERE I ONLY NEED THE ROUTES THAT SHOW THE VIEWS

//ESTO NO SE COMO VA 
//WHEN THE PAGE IS REFRESHED I GET A NOT FOUD EXCEPTION 
Route::get( '/webfeedback/public/{path?}', function(){
    return view( 'view' );
} )->where('path', '.*');


 Auth::routes(); 
/* Route::get('login', 'Auth\LoginController@showLoginForm')->name('login');
Route::post('login', 'AuthController@login1');
Route::post('logout', 'Auth\LoginController@logout')->name('logout'); */

//MODULES ROUTES
//URL TO SHOW THE HOME/MODLUES VIEW AFTER SING IN
Route::get('/modules', 'HomeController@index')->name('modules');

//GET THE MODULES DATA WITH MARKINGSHEETS
//ESTO TENGO QUE CAMBIAR 
Route::get('user/modulesa/{id}', 'ModuleController@getUserModulesA');

//STUDENT LIST ROUTES
//URL TO GET STUDENT LIST BASED ON MODULE ID
Route::get('module/students/{id}', 'ModuleController@getStudentList');
//URL TO SHOW THE STUDENT LIST VIEW
//THIS WORKS FOR THE ROUTING \
//THE ROUTES FOR THE VIEWS HAVE TO BE THERE DELEY /SI O SI 
Route::get('module/students', 'ModuleController@showStudentList'); 


//MARKINGSHEET ROUTES
//URL TO SHOW THE MARKING SHEET VIEW
Route::get('module/markingsheet/', 'MarkController@index');

//**SETTINGS ROUTES
//MODULES
//MODULE SETTINGS ROUTE TO SHOW THE VIEW
Route::get('settings/modules', 'ModuleController@index');

//MARKING TEMPLATE
//URL TO SHOW THE MARKING TEMPLATE VIEW 
Route::get('settings/templates/', 'MarkController@showTemplates');


//GROUP ITEMS
//URL TO SHOW THE MARKING GROUPS VIEW 
Route::get('settings/templates/groups', 'MarkController@showGroups');
//URL TO GET THE GROUP INFORMATION LINKED TO A MARKING TEMPLATE BY MARKINGTEMPLATE_ID
Route::get('settings/templates/groups/{id}', 'MarkController@getGroups');
//URL TO GET THE ITEMS LINKED TO A GROUP BASED ON GROUP_ID
Route::get('settings/templates/groups/items/{id}', 'MarkController@getItems');

//LEARNING OUTCOMES
//URL TO SHOW THE MARKING TEMPLATE VIEW 
Route::get('settings/templates/outcomes', 'LearnOutcomeController@index');





//ASSIGN TEMPLATES TO A MODULE
//URL TO SHOW THE VIEW 
Route::get('settings/assign', 'MarkController@showAssign');
//URL TO GET THE DATA OF THE TEMPLATES WITHOUT MODULE ID
//Route::get('settings/assign/untemplates/', 'MarkController@getNoTemplates');


//SEND EMAIL WITH FEEDBACK
//URL TO SHOW THE SEND EMAIL/FEEDBAK VIEW
Route::get('module/send', 'MarkController@showSendFeedback');















