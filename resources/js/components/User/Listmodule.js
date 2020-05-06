import React from 'react'
import Row from 'react-bootstrap/Row'
import Moduleitem from './Moduleitem'
import { userService } from '../Services';


export default class Listmodule extends React.Component {
    constructor() {
        super ();
                
        this.state = {
            loading: true,
            moduleList: [],
        }
    }


    componentDidMount() {
     
        userService.setSession('s_token',{"s":0})
        userService.getModulesUser()
        .then((response) => { this.handleResponse(response) });
    
    }
    
    //SET THE INFOFORM THE BDD TO THE STATE 
    handleResponse(response) {  
        if(response.status !== 200){
            //userService.logOut();
            console.log('Error', response.status);
            return;
        } 
        this.setState({
            moduleList: response.data,
            loading: false
        });
    }

    render() {
        let modules = "";

        if(!this.state.moduleList){
            modules = <p className="text-muted">Error 500. Internal error on getting the data from the Server.</p>;
        } 
        else{
            modules =  
                this.state.moduleList.map((moduleInfo) =>
                    <div key={ moduleInfo.id } className="col-md-4">
                        <Moduleitem info={ moduleInfo } />
                    </div>
                )
            }

        return (
            <React.Fragment>
                <h1>Modules</h1>
                <hr/>
                <Row>
                {
                    (this.state.loading)?
                        (<p className="text-muted">Loading...</p>):
                        (modules)
                }
                </Row>
            </React.Fragment>
        );
    }
}