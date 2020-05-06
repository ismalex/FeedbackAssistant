@extends('layouts.app')

@section('content')

 <script>
    // Don't forget the extra semicolon!
    var data = <?php echo json_encode($access_token, JSON_HEX_TAG); ?> ;
    localStorage.setItem('access_token', data);
</script> 
    <!-- <h1>Module Settings</h1>
    <div id="modulesSettings"></div>
    <script src="{{asset('js/Modules.js')}}" ></script> -->

@endsection
