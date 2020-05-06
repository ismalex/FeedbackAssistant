import React from 'react'
import { withRouter } from 'react-router-dom';
import { userService, studentService,  markingService, markService } from '../Services';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import { Formik, Field, FieldProps, Form  } from 'formik'
import { Checkbox, FormControlLabel  }from '@material-ui/core'; 


class SendMarks extends React.Component  {
    constructor () {
        super();

        this.state = {
            moduleList: [],
            AssigtemplateList: [],
            selectedModuleId: 0,
            selectedTemplateId: 0,
            studentsList: [],
            //
            showSelectTemplates: false,
            showStudentList: false,
        
        }
    }


    componentDidMount() {
        userService.getModulesUser()
        .then((response) => {
            if(response.status !== 200){
                console.log('Error', response.status);
                return;
            }
            console.log(response)
            this.setState({
                moduleList: response.data,
            });
        })
        .catch ((errors) => {
            console.log(errors.response);
        }) 

    }

    //Get the templates from the DataBase based on the module_id
    getTemplates(module_id) {
        markingService.settGetModTemplates(module_id).then((response) => {
            if(response.status !== 200){
                console.log('Error', response.status);
                return;
            }
            console.log(response)
            this.setState({ AssigtemplateList: response.data });
        })
        .catch ((errors) => {
            console.log(errors); 
        })
    }

    handleModuleChange = (event) => {
        if(event.target.value != 0){
           /*  console.log(event.target.value) */
            this.setState({ 
                selectedModuleId: event.target.value, 
                showSelectTemplates: true,
                showStudentList: false,
            })
            this.getTemplates(event.target.value)
        }
        else{
            this.setState({ 
                showStudentList: false,
                showSelectTemplates: false,
             })
        }
    }

    handleTemplateChange = (event) => {
        markService.getMakrStudents(this.state.selectedModuleId, event.target.value)
        .then((response) => {
            if(response.status !== 200){
                console.log('Error', response.status);
                return;
            }
            /* console.log(response) */
            this.setState({ 
                studentsList: response.data, 
                
            });
        })
        .catch ((errors) => {
            console.log(errors); 
        })
        this.setState({ 
            showStudentList: true,
            selectedTemplateId: event.target.value,  })
    }

    handleResponse(response) {
        if(response.status !== 200){
            //userService.logOut();
            console.log('Error', response.status);
            return;
        } 
        this.setState({
            studentsInfo: response.data
        });
    }

    sendFeedback = (values, { resetForm }) => {
        studentService.sendEmailStudents(this.state.selectedModuleId, this.state.selectedTemplateId, values)
        .then((response) => {
            if(response.status !== 200){
                console.log('Error', response.status);
                return;
            }
            console.log(response)
            
        })
        .catch ((errors) => {
            console.log(errors); 
        })

        resetForm({});
    }

    handleClick = (student) => (event) => {
        //
    }   

    selectAll() {
   
    }



    render() {
        
        const NOTIFICATIONS = [
            {
            title: 'Fraud',
            subtitle:
                'Receive a notification when a transaction gets declined due to a fraud rule.',
            value: 'fraud',
            selected: false,
            },
        ];

        const initialValuesTest = {
            name: '',
            selected: false,
        }

        const initialValues = {
            name: '',
           /*  selected: false, */
        }

        const studentList = 
            <Formik initialValues={ initialValues }  onSubmit={ this.sendFeedback }>
                {({ handleSubmit, values, isSubmitting, touched, errors, setFieldValue  }) => (
            <form onSubmit={ handleSubmit } autoComplete="off">
                <ListGroup.Item >
                    <button  className="btn-sm border shadow-sm btn-outline-light" type="submit">Send Feedback</button>
                </ListGroup.Item>
                <React.Fragment>
                    {
                  /*       NOTIFICATIONS.map((values, index) => */
                        this.state.studentsList.map((student, index) => 
                            <ListGroup.Item key={ index+=1 }>
                                <Row>
                                    <Col md={1}>
                                        <Field name="selected" type="checkbox" as={ Checkbox } color="default" 
                                        id={"stu_"+student.student_id } 
                                        value={"stu_"+student.student_id  } />
                                    </Col>
                                    <Col md={2}>{ student.student_id }</Col>
                                    <Col md={4}>{ student.student_id }@student.anglia.ac.uk</Col>
                                    <Col>
                                        {/* <FormControlLabel
                                            checked={values.selected}
                                            onChange={() => setFieldValue("check", !values.selected)}
                                            control={<Checkbox />}
                                            label="save this for later"
                                        /> */}
                                    </Col>
                                </Row>
                            </ListGroup.Item> 
                        )
                    }     
                </React.Fragment>            
            </form>
            )}
        </Formik>

        let modules = 
            <select id="modules" className="form-control mb-0" onChange={ this.handleModuleChange }  >
               <option value="0" defaultValue >Select Module</option>
            {
                this.state.moduleList.map((module) => 
                    <option key={ module.id } value={ module.id }>
                        { module.code +' - '+ module.name }
                    </option>
                )
            }
            </select>
        
 

        let AsTemplates = 
            (this.state.showSelectTemplates)? ( 
                    <select id="assignedTemplates" className="form-control mb-0" onChange={ this.handleTemplateChange } >
                        <option value="0" defaultValue >Select Template</option>
                    {
                        this.state.AssigtemplateList.map((templ) => 
                            <option key={ templ.id } value={ templ.id }>
                                { templ.title }
                            </option>
                        )
                    }
                    </select>
          ):(null) 
        
            

        return(
            <React.Fragment>
                <h1>Send student feedback</h1>
                <hr/>
                <ListGroup.Item>
                    <Row>
                        <Col md={4}>
                            { modules }
                        </Col>
                        <Col md={4}>
                            {AsTemplates}
                        </Col>
                    </Row>
                </ListGroup.Item>
                {/* { students }  */}
                {
                    (this.state.showStudentList)? ( studentList )
                    :(<p className="text-muted">Select a module and a template to show data...</p>)
                }
                
            </React.Fragment>
        );
    }
}
export default withRouter(SendMarks);


