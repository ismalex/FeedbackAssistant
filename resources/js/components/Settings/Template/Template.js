import React from "react"
import { userService, markingService } from '../../Services'
import { withRouter } from 'react-router-dom'
import { Formik, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from "axios"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'



 class Template extends React.Component {
    constructor() {
        super();

        this.state = {
            moduleValue: 0,
            moduleList: [],
            templateList: [],
            newModule: false, 

        }
    }

    
    //Get the modules from the data base to the select control.
    async componentDidMount() {
        this.getTemplates();
        userService.setSession('sett_token',{"set":0})
    } 

    //Get the templates from the DataBase based on the module_id
    getTemplates() {
        markingService.settGetTemplates()
            .then((response) => {
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


    handleResponse(response){
        if(response.status !== 200){
            console.log('Error', response.status);
            return;
        }
        console.log(response);
        this.getTemplates(); 
        
    }

    //Detele template from database
    deleteTemplate = (event) => {
        //
        event.preventDefault();
        if(confirm('Delete Template? This action will erase all the data related to the template    .')){
            markingService.settDelTemplate(event.target.value).then((response) => this.handleResponse(response))
        }
    }

    //handle the select OnChange event 
    handleChange = (event) => {
        event.preventDefault();
        this.getTemplates()
    }

    //
    showNewTemplate= () => {
        this.setState({ newModule: !this.state.newModule });
    }
    
    //Save data on the form on the new template
    saveForm = (values, { resetForm }) => {
  
        markingService.settSaveTemplate(values)
        .then((response) => this.handleResponse(response));
        resetForm({});
    }

    handleGroupsClick = (templateId) => (event) => {
        //
        userService.setSession('sett_token',{"set":templateId})
        this.props.history.push("/webfeedback/public/settings/templates/groups")
    }   

    handleOutClick = (templateId) => (event) => {
        //
        userService.setSession('sett_token',{"set":templateId})
        this.props.history.push("/webfeedback/public/settings/templates/outcomes")
    } 


    render() {
        
        const emptyList = <p className="text-muted">loading...</p>;
        
        const initialValues = {
            templateTitle: "", 
        } 

        const validations = 
            Yup.object().shape({
                templateTitle: Yup.string().required("This field is required."),
        }) 

        const newTemplate = 
            <Formik initialValues={ initialValues }  onSubmit={ this.saveForm } validationSchema = { validations } >
                {({ handleSubmit, touched, errors }) => (
                <form onSubmit={ handleSubmit } autoComplete="off" >
                    <Row>
                        <Col sm={4}>
                            <div>
                                <label htmlFor="templateTitle" className="mb-0">Template title:</label>
                                <Field name="templateTitle" type="input" autoFocus
                                    placeholder="New template title" 
                                    className={'form-control mb-0' + (errors.templateTitle && touched.templateTitle ? ' is-invalid' : '')}/>
                                <ErrorMessage name="templateTitle" component="div" className="invalid-feedback" />
                            </div>
                        </Col>
                        <Col sm={4}>
                                <br/>
                                <div className="pt-1">
                                    <button type="submit" className="btn-sm border shadow-sm btn-outline-light">Save</button> 
                                    <a className="btn-sm border shadow-sm btn-outline-light" onClick={ this.showNewTemplate }>
                                        Close
                                    </a>
                                </div>
                        </Col>
                    </Row>
                </form>
                )}
            </Formik>
        
        let newTemplateForm = "";
            if(!this.state.newModule){
                newTemplateForm =  
                    <a onClick={ this.showNewTemplate } className="btn-sm border shadow-sm btn-outline-light">
                        Add Template
                    </a>
            }
            else{
                newTemplateForm = <div>{ newTemplate }</div> 
            }


        let templates = 
            this.state.templateList.map((template, index) =>
                <ListGroup.Item key={ index+=1 }>
                    <Row>
                        <Col sm={1}>{ index }</Col>
                        <Col sm={5}>{ template.title }</Col>  
                        <Col sm={2}> 
                            <a className="btn-sm border shadow-sm btn-outline-light" onClick={ this.handleGroupsClick(template.id) }>
                                Details➜
                            </a>
                        </Col>      
                        <Col sm={3}> 
                            <a className="btn-sm border shadow-sm btn-outline-light" onClick={ this.handleOutClick(template.id) }>
                                Learn Outcomes➜
                            </a>
                        </Col>   
                        <Col sm={1}>
                            <button className="btn-sm border shadow-sm btn-outline-light" value={ template.id }
                                 onClick={ this.deleteTemplate }>x</button>
                        </Col>   
                    </Row>
                </ListGroup.Item>
            )       

        return(
            <React.Fragment>
                <h1>Marking templates</h1>
                <hr/>
                <ListGroup.Item>
                    { newTemplateForm }
                </ListGroup.Item>
                {
                    (!this.state.templateList.length > 0 )?
                    (emptyList):(templates)
                }
            </React.Fragment>
        );
    }
}

export default withRouter(Template);

