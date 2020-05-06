import React from 'react'
import { BrowserRouter as Router, Route,  Link, Redirect, Switch } from 'react-router-dom'
import { useHistory, withRouter  } from "react-router-dom";
import listmodule from './User/Listmodule'

 class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            pwd: '',
            access_token: localStorage.getItem('access_token') || null,
        }
    }

    handleEmailChange = (event) => {
        this.setState({email: event.target.value});
     }

     handlePasswordChange = (event) => {
        this.setState({pwd: event.target.value});
     }

    onSubmit = (event) => {
        event.preventDefault();
        console.log('entra al log')
        console.log("EMail: " + this.state.email);
        console.log("Password: " + this.state.pwd);
        axios.post('http://localhost/webfeedback/public/api/login', { username:this.state.email, password: this.state.pwd })
            .then((response) => {
                if(response.status !== 200){
                    console.log('Error', response.status);
                    return;
                }
                const token =  response.data.success.access_token;
                localStorage.setItem('access_token', token );
                this.setState({ access_token: token });
              /*   console.log(response.data.success.access_token) */
            })
            .catch ((errors) => {
                console.log(errors.response);
            })
           /*  this.props.history.push('/posts/'); */
    }

    onRedirect= () => {
        /* if(userFound){ */
            /* this.props.history.push('/posts/'); */
        /* } */
        return  <Redirect  to="/webfeedback/user/modules" /> 
     }

    HomeButton= () => {
        let history = useHistory(); 
        history.push("webfeedback/user/modules");
        {/* <Redirect push to="/dashboard" /> */}
      }

      /*Step 1*/
      //Esta es la qu funciona 
      //
    myFunction(){  this.props.history.push("/webfeedback/public/modules"); }


    render() {
        return (
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <form  onSubmit={ this.onSubmit } > 
                                <div className="row">
                                        <label htmlFor="email" className="col-md-3 col-form-label text-md-right">email</label>
            
                                        <div className="col-md-8">
                                            <input id="email1" type="email" className="form-control" name="email"  required autoComplete="email" autoFocus onChange={ this.handleEmailChange } />
                                        </div>
                                </div>
                                <div className="row">
                                        <label htmlFor="email" className="col-md-3 col-form-label text-md-right">password</label>
            
                                        <div className="col-md-8">
                                            <input id="password1" type="password" className="form-control" name="password"  required autoComplete="password" autoFocus onChange={ this.handlePasswordChange }/>
                                        </div>
                                </div>
                         
                                <input type="submit" value="login"  /* onClick={this.HomeButton} */ className="btn btn-outline-default" />
                            </form>
                            <span>
                                //THIS WORKS 
                                //THIS IS THE WAY TO MAKE THE SIDEBAR AND CONTENT
                                    <Router >
                                    <Link to="/webfeedback/public/">Home</Link>
                                    <Link to="/dashboard">Dashboard</Link>
                                    <li><Link to="/react" replace={false}>React</Link></li>
                                    
                                    <Route
                                        path="/webfeedback/public/modules"
                                        component={listmodule}
                                        exact 
                                    />
                                    <Route
                                        path="/dashboard"
                                       
                                    />
                                    
                                    {/* THIS WILL REDIRECT AFTER A SUCCESFUL LOGIN  */}
                                    { <button onClick={ () => 
                                        { this.props.history.push("/webfeedback/public/modules")}}> GO TO DASHBOARD</button>}
                                
                               
                                    </Router>
                                </span>
                                <button onClick={()=>this.myFunction()} className={'btn btn-primary'}>
                                    Go Home</button>
                    </div>
                </div>
            </div>
        );
    }

}

export default withRouter(Login); 

/* if (document.getElementById('login')) {
    ReactDOM.render(<Login />, document.getElementById('login'));
} */
