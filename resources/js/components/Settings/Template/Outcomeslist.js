import React from 'react'
import { learnService, groupIitemService } from '../../Services'
import { Formik, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'


export default class Outcomeslist extends React.Component {
    constructor () {
        super();

        this.state = {
            loading: true,
            outcomesInfo: [],
            newLearn: false, 
            templateTitle: '',

        }
    }


    componentDidMount() {
       this.getLearnOutcomes()
       this.getTitle()
    }

    //GET TEMPLATE TITLE TO DISPLAY ON THE VIEW
    getTitle() {
        groupIitemService.settTemplateName().then((response) => {
            if(response.status !== 200){
                console.log('Error', response.status);
                return;
            }
            this.setState({
                templateTitle: response.data,
            });
        })
        .catch ((errors) => {
            console.log(errors);
        })
    }

    //Get the learning Outcomes from the DataBase based on the module_id
    getLearnOutcomes() {
        learnService.settGetLearn()
            .then((response) => {
                if(response.status !== 200){
                    console.log('Error', response.status);
                    return;
                }
            this.setState({
                outcomesInfo: response.data,
                loading: false,
            });
            /* console.log('getTemplate:', response.data*/    
        })
        .catch ((errors) => {
            console.log(errors); 
        })
    }

    deleteLearnOutcomes = (event) => {
        event.preventDefault();
        learnService.settDelLearn(event.target.value).then((response) => this.handleResponse(response))

    }

    //
    showNewLearn = () => {
        this.setState({ newLearn: !this.state.newLearn });
    }

    handleResponse(response){
        if(response.status !== 200){
            console.log('Error', response.status);
            return;
        }
        console.log(response);
        this.getLearnOutcomes(); 
        
    }

    //Save data on the form on the new template
    saveForm = (values, { resetForm }) => {
        resetForm({});
        learnService.settSaveLearn(values).then((response) => this.handleResponse(response))
        /* this.getTemplates(this.state.moduleValue); */
    }



    render() {
          
        const initialValues = {
            short_comment: "", 
            long_comment: "", 
        } 

        const validations = 
            Yup.object().shape({
                short_comment: Yup.string().required("This field is required."),
                long_comment: Yup.string().required("This field is required."),
        }) 

        const newLearn = 
            <Formik initialValues={ initialValues }  onSubmit={ this.saveForm } validationSchema = { validations } >
            {({ handleSubmit, touched, errors }) => (
            <form onSubmit={ handleSubmit } autoComplete="off" >
                <Row>
                    <Col sm={4}>
                        <div>
                            <label htmlFor="short_comment" className="mb-0">Short comment:</label>
                            <Field name="short_comment" type="input"
                                placeholder="New short comment" 
                                className={'form-control mb-0' + (errors.short_comment && touched.short_comment ? ' is-invalid' : '')}/>
                            <ErrorMessage name="short_comment" component="div" className="invalid-feedback" />
                        </div>
                    </Col>
                    <Col sm={6}>
                        <div>
                            <label htmlFor="long_comment" className="mb-0">Long comment:</label>
                            <Field name="long_comment" type="input"
                                placeholder="New long comment" 
                                className={'form-control mb-0' + (errors.long_comment && touched.long_comment ? ' is-invalid' : '')}/>
                            <ErrorMessage name="long_comment" component="div" className="invalid-feedback" />
                        </div>
                    </Col>
                    <Col sm={2}>
                        <div className="pt-1">
                            <br/>
                            <button type="submit" className="btn-sm border shadow-sm btn-outline-light">Save</button> 
                            <a className="btn-sm border shadow-sm btn-outline-light" onClick={ this.showNewLearn }>
                                Close
                            </a>
                        </div>
                    </Col>
                </Row>
            </form>
            )}
        </Formik>
    
        let newLearnForm = "";
            if(!this.state.newLearn){
                newLearnForm =  
                    <a onClick={ this.showNewLearn } className="btn-sm border shadow-sm btn-outline-light">
                        Add Learning Outcome
                    </a>
            }
            else{
                newLearnForm = newLearn
        }


        let outList = 
            this.state.outcomesInfo.map((out, index) => 
            <ListGroup.Item key={ index+=1 }>
                <Row>
                    <Col md={1}>{ index }</Col>
                    <Col md={2}>{ out.short_comment }</Col>
                    <Col md={8}>{ out.long_comment }</Col>
                    <Col md={1}> 
                        <button className="btn-sm border shadow-sm btn-outline-light" value={ out.id }  onClick={ this.deleteLearnOutcomes }>x</button>
                    </Col>      
                </Row>
            </ListGroup.Item>  
        ) 


        return(
            <React.Fragment>
                <h1>Learning Outcomes</h1>
                <hr/>
                <h4>{ this.state.templateTitle }</h4>
                <ListGroup.Item >
                    {newLearnForm}
                </ListGroup.Item>
                {
                    (this.state.loading)? 
                    (<p className="text-muted">Loading...</p>): 
                    (outList)
                }   
            </React.Fragment> 
        );
    }
}