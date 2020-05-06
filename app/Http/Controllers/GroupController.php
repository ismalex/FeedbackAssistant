<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Template;
use App\Group;
use App\Item;

class GroupController extends Controller
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
    public function store(Request $request){
        //
        //return $request;
        try {
            $group = new Group();
            $group->title = $request->title;
            $group->character =  strtoupper($request->char);
            $group->total_mark = $request->total_mark;
            $group->template_id = $request->template_id;
            $group->save();

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
        return $template = Template::find($id)->groups;
        
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
        Group::destroy($id);
        
    }

    /*ITEMS */

     /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function storeItem(Request $request){
        //
        //return $request;sdfssdfasdfasdfasd
        try {
            $item = new Item();
            $item->long_comment = $request->long_comment;
            $item->short_comment = $request->short_comment;
            $item->group_id = $request->group_id;
            $item->save();
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
    public function showGroupItems($groupId)
    {
        //
        $group = Group::find($groupId);
        $groupList = $group->items; 
 
        return (['groupList' => $groupList, 'groupDetails' => $group]);       
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroyItem($id)
    {
        //
        Item::destroy($id);
    }
}
