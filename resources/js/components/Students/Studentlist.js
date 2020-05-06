import React from 'react'
import { withRouter } from 'react-router-dom';
import { studentService, userService, subtitleService } from '../Services';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import Subtitle from '../Subtitle'


class Studentlist extends React.Component  {
    constructor () {
        super();

        this.state = {
            studentsInfo: [],
            subtitleInfo: '',
        }
    }


    componentDidMount() {
        this.getSubtitle()
        studentService.getList().then((response) => { this.handleResponse(response) });

    }

    handleResponse(response) {
        if(response.status !== 200){
            //userService.logOut();
            console.log('Error', response.status);
            return;
        } 
       /*  console.log(response) */
        this.setState({
            studentsInfo: response.data
        });
    }

    //Save the marking template data 
    getSubtitle() {
 
        subtitleService.getSubTitleInfo()
        .then((response) => {
            if(response.status !== 200){
                console.log('Error :', response.status);
                return;
            }
            this.setState({ subtitleInfo: response.data })
        })
        .catch ((errors) => {
            console.log(errors);
        })

    }

    handleClick = (student) => (event) => {
        //
        userService.setSession('s_token',{"s":student})
        this.props.history.push("/webfeedback/public/module/markingsheet") 
    }   



    render() {
    
        const students = 
            this.state.studentsInfo?(
                this.state.studentsInfo.map((student, index) => 
                    <ListGroup.Item key={ index+=1 }>
                        <Row>
                            <Col md={1}>{ index }</Col>
                            <Col md={2}>{ student.student_id }</Col>
                            <Col md={4}>{ student.student_id }@student.anglia.ac.uk</Col>
                            <Col md={3}> 
                                {
                                   <div className={(student.marked)? ('text-success'):('text-secondary')}>{(student.marked)? ('Marked'):('Unmarked')}</div> 
                                } 
                            </Col>
                            <Col md={2}> <a className="btn-sm border shadow-sm  btn-outline-light" onClick={ this.handleClick(student.student_id) }> Mark➜</a></Col>  
                           
                        </Row>
                    </ListGroup.Item>    
                    )):(<p className="text-muted">.csv File with student information for this module does not exist.</p>)

        return(
            <React.Fragment>
                <h1>Student List</h1>
                <Subtitle />
                <hr/>
                <ListGroup> 
                    { students } 
                </ListGroup> 
            </React.Fragment>
        );
    }
}
export default withRouter(Studentlist);


