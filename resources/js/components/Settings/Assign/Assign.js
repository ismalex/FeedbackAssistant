import React from "react"
import { moduleService, markingService } from '../../Services'
import { withRouter } from 'react-router-dom'
import { Formik, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from "axios"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'



 class Assign extends React.Component {
    constructor() {
        super();

        this.state = {
            moduleList: [],
            templateList: [],
            enableMoudulesSelect: false,
            //ASSIGN TEMPLATE FORM 
            showAssign: false,
            showAssignSelect: false,
            assignTemplates: [], //change var name
            templateValue: 0,
            moduleValue: 0, 

        }
    }

    
    //Get the modules from the data base to the select control.
    async componentDidMount() {
        moduleService.settGetModules()
            .then((response) => {
                if(response.status !== 200){
                    console.log('Error', response.status);
                    return;
                }
                this.setState({
                    moduleList: response.data.totalModules,
                });
            })
            .catch ((errors) => {
                console.log(errors.response);
            }) 
    } 

   //handle the Module select OnChange event 
    handleChangeModule = (event) => {
        event.preventDefault();
        if(event.target.value != 0){
            this.setState({ 
                moduleValue: event.target.value,
                showAssign: true 
            });
            //console.log(this.state.moduleValue)
            this.getTemplates(event.target.value )
        }
        else{
            this.setState({
                showAssign: false ,
                templateList: []
            });
        }

    }

    handleChangeTemplate = (event) => {
        event.preventDefault();
        if(event.target.value != 0){
            this.setState({ 
                templateValue: event.target.value,
            });
        }
    }


    //Get the templates from the DataBase based on the module_id
    getTemplates(module_id) {
        markingService.settGetModTemplates(module_id).then((response) => {
            if(response.status !== 200){
                console.log('Error', response.status);
                return;
            }
            this.setState({ templateList: response.data });
        })
        .catch ((errors) => {
            console.log(errors); 
        })
    }

    //assign template to a module
    saveTemplate(data) {
        axios.post('http://localhost/webfeedback/public/settings/templates/store', data )
        //handleResponse
        .then((response) => {
            if(response.status !== 200){
                console.log('Error', response.status);
                return;
            }
            /* console.log(response);  
            console.log(this.state.templateList) */
         this.getTemplates(this.state.moduleValue); 
        })
        .catch ((errors) => {
            console.log(errors.response);
        })

    }

    updateTemplate(templateId, moduleId ){
        markingService.settUpdateTemplate(moduleId, templateId )
            .then((response) => {
                if(response.status !== 200){
                    console.log('Error', response.status);
                    return;
                } 
               // if(this.state.moduleValue != 0){
                    this.getTemplates(this.state.moduleValue)
                    console.log(response) 
                //}
            })
            .catch ((errors) => {
                console.log(errors.response);
            }) 
    }

    //Detele template from database
    deleteTemplate = (event) => {
        event.preventDefault();
        markingService.settDelTemplate(this.state.moduleValue, event.target.value )
        .then((response) => {
            if(response.status !== 200){
                console.log('Error', response.status);
                return;
            } 
           // if(this.state.moduleValue != 0){
                this.getTemplates(this.state.moduleValue)
                console.log(response) 
            //}
        })
        .catch ((errors) => {
            console.log(errors.response);
        }) 
    }


    getUnassignedTemp() {

         markingService.settGetUnTemplates(this.state.moduleValue)
        .then((response) => {
            if(response.status !== 200){
                console.log('Error', response.status);
                return;
            }
            this.setState( { assignTemplates: response.data })
        })
        .catch ((errors) => {
            console.log(errors); 
        })
    }

    handleAssignTemplate = (event) => {
        this.setState({ 
            showAssignSelect: !this.state.showAssignSelect,
            enableMoudulesSelect: !this.state.enableMoudulesSelect,
            showAssign: !this.state.showAssign, 
            assignTemplates: []
         })
         this.getUnassignedTemp()
    }

    handleCancelAssigment = (event) => {
        this.setState({ 
            showAssignSelect: !this.state.showAssignSelect,
            enableMoudulesSelect: !this.state.enableMoudulesSelect,
            showAssign: !this.state.showAssign
        })
    }
    
    //Save data on the form on the new template
    saveForm = (values) => {
        this.setState({ 
            showAssignSelect: !this.state.showAssignSelect,
            enableMoudulesSelect: !this.state.enableMoudulesSelect,
            showAssign: !this.state.showAssign
        })

        if(this.state.templateValue !== 0 )
        {
            this.getUnassignedTemp()
            this.updateTemplate(this.state.templateValue, this.state.moduleValue ) 
        }
       
    }


    render() {
        
        const start = <p className="text-muted mt-1">Select a Module to display data.</p>;
        
        let unassignedTemplate = ''
            if(this.state.showAssignSelect){
                unassignedTemplate =
                <Row>
                    <Col sm={7}>
                        { 
                            <select id="modules" className="form-control mb-0" onChange={ this.handleChangeTemplate }  >
                                <option value="0" defaultValue >Select template</option>
                            {
                                this.state.assignTemplates.map((templ) => 
                                    <option key={ templ.id } value={ templ.id }>
                                        { templ.title }
                                    </option>
                                )
                            }
                            </select>
                        }
                        {/*  <ErrorMessage name="templateTitle" component="div" className="invalid-feedback" /> */}
                    </Col>
                    <Col sm={5}>
                        <div className="pt-1">
                            <button type="submit" className="btn-sm border shadow-sm btn-outline-light" 
                            onClick={ this.saveForm } >Assign</button> 
                            <a className="btn-sm border shadow-sm btn-outline-light" onClick={ this.handleCancelAssigment }>Close</a> 
                        </div>
                    </Col>
                </Row>
            }

        //render a list of marking templates
        let assignedTemplateList = ''
            if(!this.state.templateList.length > 0){
                assignedTemplateList = <p className="text-muted mt-2">No templates assigned to this module.</p>;
            } 
            else{
                assignedTemplateList =
                    this.state.templateList.map((template, index) =>
                        <ListGroup.Item key={ index+=1 }>
                            <Row>
                                <Col md={1}>{ index }</Col>
                                <Col md={5}>{ template.title }</Col>  
                                <Col >
                                    <button value={ template.id }  className="btn-sm border shadow-sm btn-outline-light" 
                                    onClick={ this.deleteTemplate }>X</button>
                                </Col>   
                            </Row>
                        </ListGroup.Item>
                    )
            }

        const moduleSelect =     
            <select id="modules" className="form-control mb-0" onChange={ this.handleChangeModule } 
            disabled={ this.state.enableMoudulesSelect } >
                <option value="0" defaultValue >Select Module</option>
                {
                    this.state.moduleList.map((module) => 
                        <option key={ module.id } value={ module.id }>
                            { module.code +' - '+ module.module_name }
                        </option>
                    )
                }
            </select>

        let assignButton = ''
            if(this.state.showAssign) {
                assignButton =  
                <Col>
                    <div className="pt-1">
                        <a className="btn-sm border shadow-sm btn-outline-light" 
                        onClick={ this.handleAssignTemplate }> Assign template</a>
                    </div> 
                </Col>
            }


        return(
            <React.Fragment>
                <h1>Assign template to a module</h1>
                <hr/>
                <ListGroup.Item>
                    <Row>
                        <Col md={4}>
                            { moduleSelect }
                        </Col>
                        { assignButton }

                        <Col md={5}>
                            { unassignedTemplate }   
                        </Col>
                    </Row>
                </ListGroup.Item>
                {
                    (!this.state.moduleValue != 0)? (
                        start
                    ):( 
                        assignedTemplateList 
                    )
                }
            </React.Fragment>
        );
    }
}

export default withRouter(Assign);

