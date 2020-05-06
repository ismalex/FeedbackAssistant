import React from 'react'
import { withRouter } from 'react-router-dom';
import Card from 'react-bootstrap/Card'
import { userService } from '../Services';


 class Moduleitem extends React.Component {
    constructor (props) {
        super(props);

    }

    handleClick = (event) => {
        //
        userService.setSession('d_token',{"mod":this.props.info.id, "as":event.target.id})
        this.props.history.push("/webfeedback/public/module/students")
    }   

    render() {
        return(
            <Card>
                <Card.Body> 
                    <Card.Title>{ this.props.info.name }</Card.Title>
                    <Card.Subtitle className="mb-3">{ this.props.info.code }</Card.Subtitle>
                    <p className="text-muted">Assigments</p>
                    {
                        this.props.info.templates.map((assigment, index) => 
                            <div key={ index+1 }>
                               {/*  {console.log("module", this.props.info.id)} */}
                                
                               
                                   <a className="btn-outline-light mb-0" id={ assigment.id } 
                                    onClick={ this.handleClick }>
                                   ‒ { assigment.title }
                                    </a>
                                   
                            </div>
                        )
                    }
                </Card.Body>
            </Card>
        );
    }
}

export default withRouter(Moduleitem);