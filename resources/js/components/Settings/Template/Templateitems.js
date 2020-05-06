import React from 'react'
import { Formik, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import ListGroup from 'react-bootstrap/ListGroup'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'


export default class TemplateItems extends React.Component {
    constructor (props){
        super(props);

        this.state = {
            //newItem: false,
            itemCollection: [],
        }

    }


    componentDidMount() {
/*         axios.get('http://localhost/webfeedback/public/settings/templates/groups/items/'+this.props.groupInfo)
        .then((response) => {
           if(response.status !== 200){
               console.log('Error', response.status);
               return;
           }
           this.setState({
            itemCollection: response.data 
           });
       })
       .catch ((errors) => {
           console.log(errors);
       }) */
    }

    
    //
    showNewItem = () => {
        this.setState({ newLearn: !this.state.newLearn });
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

        const newItem = 
            <Formik initialValues={ initialValues }  onSubmit={ this.saveForm } validationSchema = { validations } >
            {({ handleSubmit, touched, errors }) => (
            <form onSubmit={ handleSubmit } autoComplete="off" >
                <Row>
                    <Col sm={4}>
                        <div>
                            <label htmlFor="templateTitle" className="mb-0">Short comment:</label>
                            <Field name="short_comment" type="input" autoFocus
                                placeholder="New Item short comment" 
                                className={'form-control mb-0' + (errors.short_comment && touched.short_comment ? ' is-invalid' : '')}/>
                            <ErrorMessage name="short_comment" component="div" className="invalid-feedback" />
                        </div>
                    </Col>
                    <Col sm={5}>
                        <div>
                            <label htmlFor="templateTitle" className="mb-0">Long comment:</label>
                            <Field name="long_comment" type="input"
                                placeholder="New item long comment" 
                                className={'form-control mb-0' + (errors.long_comment && touched.long_comment ? ' is-invalid' : '')}/>
                            <ErrorMessage name="long_comment" component="div" className="invalid-feedback" />
                        </div>
                    </Col>
                    <Col sm={3}>
                        <br/>
                        <button type="submit" className="btn-sm border shadow-sm btn-outline-light">Save</button> 
                        <button  className="btn-sm border shadow-sm btn-outline-light" onClick={ this.props.updateGroupItems }>Save</button> 
                        <a className="btn-sm border shadow-sm btn-outline-light" >
                        Close
                        </a>
                    </Col>
                </Row>
            </form>
            )}
        </Formik>

        let newItemForm = "";
            if(!this.state.newLearn){
                newItemForm =  
                    <a onClick={ this.showNewItem } className="btn-sm border shadow-sm btn-outline-light">
                        Add Item
                    </a>
            }
            else{
                newItemForm = newItem
            }

        const ItemList =  
            this.props.itemCollection.map((item, index) =>
                <ListGroup.Item key={ index }>
                    <Row>
                        <Col md={1}>{ index+=1 } </Col>
                        <Col md={3}>{ item.short_comment }</Col>
                        <Col md={7}>{ item.long_comment }</Col>
                        <Col md={1}>
                            <button className="btn-sm border shadow-sm btn-outline-light" value={ item.id } onClick={ this.deleteLearnOutcomes }>X</button>
                        </Col>
                    </Row>
                </ListGroup.Item>
            )


        return(
            <React.Fragment>
                <ListGroup.Item {...this.props }  >
                    { newItemForm }
                </ListGroup.Item>
                <ListGroup.Item >
                <Row>
                    <Col sm={2}>Character: {this.props.itemCollection.character}
                    </Col>
                   
                    <Col sm={2}>Max mark:
                    </Col>
                    { this.props.groupInfo }
                </Row>
                </ListGroup.Item>
                { ItemList }
                    
            </React.Fragment>
        );
        
    }
}