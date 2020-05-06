import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Login from './Login' 
import Sidebar from './Sidebar'
import Userinfo from './Userinfo'
import Listmodule from './User/Listmodule'
import Sendmarks from './Students/Sendmarks'
import StudentList from './Students/Studentlist'
import Markingtemplate from './Template/Markingtemplate'
import Modules from './Settings/Modules/Modules'
import Template from './Settings/Template/Template'
import Templategroups from './Settings/Template/Templategroups'
import Outcomeslist from './Settings/Template/Outcomeslist'
import Assign from './Settings/Assign/Assign'


 class Main extends React.Component {
    constructor () {
        super();

        this.state = {
            renderItems: false,
        }
    }

    componentDidMount() {
        this.handleRender()
       /// studentService.getList().then((response) => { this.handleResponse(response) });

    }

    handleRender() {
        let info = localStorage.getItem('access_token');
		if (info){
			this.setState ({ renderItems: true})
		} 
    }

    render() {
        
        const baseURL = '/webfeedback/public/'
        return (
            <Router>
                {
                    (this.state.renderItems)?(
                        <React.Fragment>
                            <Sidebar />
                            <main className="main-panel">
                            {/*  <Userinfo /> */}
                                <div className="content">
                                    <div className="container">
                                        <Route exact path={ baseURL } component={ Login } />
                                        <Route exact path={ baseURL + "modules" } component={ Listmodule } />
                                        <Route exact path={ baseURL + "module/students" } component={ StudentList } /> 
                                        <Route exact path={ baseURL + "module/send" } component={ Sendmarks } /> {/* CHANGE TO MODULES  */}
                                        <Route exact path={ baseURL + "module/markingsheet" } component={ Markingtemplate } />
                                        {/* Settings */}
                                        <Route exact path={ baseURL + "settings/modules" } component={ Modules } />
                                        <Route exact path={ baseURL + "settings/templates" } component={ Template } />
                                        <Route exact path={ baseURL + "settings/templates/groups" } component={ Templategroups } />
                                        <Route exact path={ baseURL + "settings/templates/outcomes" } component={ Outcomeslist } />
                                        <Route exact path={ baseURL + "settings/assign" } component={ Assign } />
                                    </div>
                                </div>
                            </main>    
                        </React.Fragment>    
                    ):('')
                }

         
            </Router>
        );
    }
}

if (document.getElementById('main')) {
    ReactDOM.render(<Main />, document.getElementById('main'));
}

