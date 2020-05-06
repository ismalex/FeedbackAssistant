@extends('layouts.app')

@section('content')
<script type="text/javascript">
    localStorage.clear();
</script>
<div class="container">
    <div class="row justify-content-center" style="margin-top: 25vh">
        <div class="col-md-6">
       <h4>
           FeedbackAssistant
       </h4>
            <div class="card ">
                <div class="card-body m-2">
                    <form method="POST" action="{{ route('login') }}">
                        @csrf
                        <div class="row">
                            <label for="email" class="col-md-3 col-form-label text-md-right">{{ __('E-Mail') }}</label>

                            <div class="col-md-8">
                                <input id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email" autofocus>

                                @error('email')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="row">
                            <label for="password" class="col-md-3 col-form-label text-md-right">{{ __('Password') }}</label>
                            <div class="col-md-8">
                                <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="current-password">

                                @error('password')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="col-md-6 offset-md-3">
                                <div class="    ">
                                    <input class="" type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>

                                    <label class="form-check-label" for="remember">
                                        {{ __('Remember Me') }}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class=" row mb-0">
                            <div class="col-md-10 offset-md-1">
                                <button type="submit" class="btn btn-outline-default btn-block">
                                    {{ __('Sing in') }}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <label class="form-check-label row justify-content-center"  >
            @if (Route::has('register'))
                <a style="color: black" href="{{ route('register') }}">Register</a>
            @endif
                 <!-- • 2020 -->
            </label>
          <!--   @if (Route::has('password.request'))
                <a class="btn btn-link" href="{{ route('password.request') }}">
                    {{ __('Forgot Your Password?') }}
                </a>
            @endif -->
        </div>
    </div>
</div>
@endsection
