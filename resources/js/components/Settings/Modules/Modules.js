import React from 'react'
import axios from 'axios'
import { Formik, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { moduleService } from '../../Services'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'


export default class Modules extends React.Component {
    constructor() {
        super ();
                
        this.state = {
            loading: true,
            moduleList: [],
            userList: [],
            modalShow: false, 
            newModule: false,
        }
    }

    /* Page load get the data of the modules from the database */
    componentDidMount() {
        this.getModules();
    }
            
    //GET THE MODULES LIST FORM THE DATA BASE AND ASSIGN THE DATA TO THE STATE
    getModules(){
        moduleService.settGetModules()
            .then((response) => {
                if(response.status !== 200){
                    console.log('Error', response.status);
                    return;
                }
                this.setState({
                    moduleList: response.data.totalModules,
                    userList: response.data.totalUsers,
                /*  newModule: false, */
                    loading: false, 
                });
            })
            .catch ((errors) => {
                console.log(errors);
            })
    }

    /* Save the data to the database sended from the Form */
    saveModule(values) {
        moduleService.settSaveModule(values)
        .then((response) => {
            if(response.status !== 200){
                console.log('Error', response.status);
                return;
            }
            this.getModules();
        })
        .catch ((errors) => {
            console.log(errors.response);
        }) 
    }

    //delte the module form the database with confirmation
    deleteModule = (event) => {
        event.preventDefault();

        if(confirm('Delete Module? This action will erase all the data related to the module.')){
            moduleService.settDeleteModule(event.target.value)
            .then((response) => {
                if(response.status !== 200){
                    console.log('Error', response.status);
                    return;
                } 
               this.getModules();
            })
            .catch ((errors) => {
                console.log(errors.response);
            })
        }
    }

    //
    showNewModule= () => {
        this.setState({ newModule: !this.state.newModule });
    }

    //Save data on the form on the new Module
    saveForm = (values, { resetForm }) => {
        resetForm({});
        this.saveModule(values);
    }

    render() {

        const modules =   
            this.state.moduleList.map((module, index) =>
                <ListGroup.Item key={index}>
                <Row>
                    <Col sm={1}>{ index+=1 }</Col>   
                    <Col sm={2}>{ module.code }</Col>
                    <Col sm={3}>{ module.module_name }</Col>
                    <Col>{ (module.name)?(module.name) : 'Unassigned' }</Col>
                    <Col>{ (module.email)?(module.email) : '-' }</Col>
                    <Col sm={1}>
                        <button value={ module.id } onClick={ this.deleteModule }
                            className="btn-sm border shadow-sm btn-outline-light" >
                                {/* red letters where theres actions that are dangerous */}
                            X
                        </button>
                    </Col>
                </Row>  
            </ListGroup.Item>
            )
           
        const initialValues = {
            moduleName: "", 
            moduleCode: "",
            lecturer: "-",
        } 

        const validations = 
            Yup.object().shape({
                moduleCode: Yup.string().required("This field is required."),
                moduleName: Yup.string().required("This field is required."),
                lecturer: Yup.string().matches(/[^0]/, "error cerca"), //test //estoy cerca
            }) 

        const newModule =
            <Formik initialValues={ initialValues } 
            onSubmit={ this.saveForm }

            //Form validation 
            validationSchema = { validations }
            >
            {({values, isSubmitting, handleBlur, handleChange, handleSubmit, touched, errors}) => (
            <form onSubmit={handleSubmit} autoComplete="off">
                
                    <Row>
                        <Col xs={3}>
                            <div className="form-group mb-0">
                                <label htlmfor="moduleCode" className="mb-0">Code:</label>
                                <Field autoFocus name="moduleCode" placeholder="New module code" type="input" 
                                    className={'form-control mb-0' + (errors.moduleCode && touched.moduleCode ? ' is-invalid' : '')}/>
                                <ErrorMessage name="moduleCode" component="div" className="invalid-feedback" />
                            </div>
                        </Col >
                        <Col xs={3}>
                            <div className="form-group mb-0">
                                <label htmlFor="moduleName" className="mb-0">Name:</label>
                                <Field name="moduleName" type="text" placeholder="New Module Name" 
                                    className={'form-control mb-0' + (errors.moduleName && touched.moduleName ? ' is-invalid' : '')} />
                                <ErrorMessage name="moduleName" component="div" className="invalid-feedback" />
                            </div>
                        </Col>
                        <Col xs={3}> 
                            <label htmlFor="" className="mb-0">Lecturer:</label>
                            <select name="lecturer" className="form-control" onChange={handleChange} onBlur={handleBlur} placeholder="-">
                                <option value="0" defaultValue>Select</option>
                                {
                                    this.state.userList.map((user) => 
                                        <option key={ user.id } value={ user.id }>{ user.name }</option>
                                    )
                                } 
                            </select> 
                            <ErrorMessage name="lecturer" component="div" className="invalid-feedback"/>
                        </Col>
                        <Col xs={3}> 
                        <div className="pt-1">

                            <br/>
                            <button type="submit" className="btn-sm border shadow-sm btn-outline-light" >Save</button>
                            <a className="btn-sm border shadow-sm btn-outline-light" onClick={ this.showNewModule }>
                                Close
                            </a>
                        </div>
                        
                    </Col> 
                </Row>
             
            </form> 
            )}
            </Formik>


        let newModuleForm = "";
            if(!this.state.newModule){
                newModuleForm =  
                    <a onClick={ this.showNewModule } className="btn-sm border shadow-sm btn-outline-light">
                        Add Module
                    </a>
                   
            }
            else{
                newModuleForm = <div>{ newModule }</div> 
            }

        return (
            <React.Fragment>
                <h1>Modules</h1>
                <hr/>
                <ListGroup.Item> 
                     {newModuleForm} 
                 </ListGroup.Item> 
                { 
                (this.state.loading)?
                    (<p className="text-muted">Loading...</p>):( modules )
                }
            </React.Fragment>
        );
    }
}
