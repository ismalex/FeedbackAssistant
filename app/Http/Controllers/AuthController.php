<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\User;
use Validator;

class AuthController extends Controller
{
    public $successStatus = 200;
    //
    public function login (Request $request){
        //
        $http = new \GuzzleHttp\Client;

        try { 
            $response = $http->post('localhost/webfeedback/public/oauth/token', [
                'form_params' => [
                    'grant_type' => 'password',
                    'client_id' => '2',
                    'client_secret' => '5M2AF59JrAwIKIbcKvnyWWTy1XZpbUCpatUTKRfv',
                    'username' => $request->username,
                    'password' => $request->password,
                ]
            ]);

            return $response->getBody();

        } catch(\GuzzleHttp\Exception\BadResponseException $exception) {
            if($exception->getCode() === 400){
                return response()->json('Invalid request. Please enter a valid username or password.', $exception->getCode());
            } else if ($exception->getCode() === 401){
                return response()->json('Invalid credentials. Please try again.', $exception->getCode());
            }

            return response()->json('Something went wrong on the server.', $exception->getCode());
        }
    }

    public function login1() { 
        //
        if(Auth::attempt(['email' => request('username'), 'password' => request('password')])){ 
            $user = Auth::user(); 
            $success['access_token'] =  $user->createToken('webfeedback')-> accessToken; 
            return response()->json(['success' => $success], $this->successStatus); 
        } 
          else{ 
            return response()->json(['error'=>'Unauthorised. Invalid credentials. Please try again.'], 401); 
        } 
    }

    public function login2(){
        if(Auth::attempt(['email' => request('email'), 'password' => request('password')])){
            $user = Auth::user();
            $success['access_token'] =  $user->createToken('MyApp')->accessToken;
            return response()->json(['success' => $success], $this->successStatus);
        }
        else{
            return response()->json(['error'=>'Unauthorised'], 401);
        }
    }
}   


