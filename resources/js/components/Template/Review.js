import React from 'react';
import { reviewService } from '../Services'
import { withRouter } from 'react-router-dom';
import Document from './Document';
import Modal from 'react-bootstrap/Modal';  


class Review extends React.Component {
    constructor (props) {
        super(props);
    }

    savePDF() {
        reviewService.generatePDF().then((response) => {
             if(response.status !== 200){
                //userService.logOut();
                console.log('Error', response.status);
                return;
            } 
            /*c onsole.log(response)  */
            /* this.props.history.push("/webfeedback/public/module/students")  */
        } )  
    }

    handleResponse(response) {
        if(response.status !== 200){
            //userService.logOut();
            console.log('Error', response.status);
            return;
        }
        console.log(response);
    }

 

    render() {
        const modalBody = {
            height: "571px",
            overflowY: "auto"
        }
        
        return(
            <Modal {...this.props } centered size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                keyboard={ true }
                backdrop="static"
                >
                <Modal.Header closeButton className="pb-0" >
                    <h5 className="font-weight-bold">Document Review </h5>
                </Modal.Header>
                <Modal.Body style={ modalBody }>
                    <Document />
                </Modal.Body>
                <Modal.Footer>
                    <a className="btn-sm border shadow-sm btn-outline-light" onClick={ this.props.onHide } >Close</a>
                    {/* call the pdf with the same data  */}
                    <a className="btn-sm border shadow-sm btn-outline-light" style={{color: "black"}}
                    href="/webfeedback/public/module/students" 
                     onClick={ this.savePDF }>Save</a>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default withRouter(Review);