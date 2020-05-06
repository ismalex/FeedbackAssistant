import React from "react";
import { groupIitemService } from '../../Services'
import { Formik, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import ListGroup from "react-bootstrap/ListGroup"
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Modal from "react-bootstrap/Modal"
import axios from "axios" 


export default class Templategroups extends React.Component {
    constructor() {
        super();

        this.state = {
            loading: true,
            //GROUPS
            showItems: false,
            groupInfo: [],
            groupDetails: [],
            itemList: [],
            //ITEMS
            selectedGroupId: 0,
            showNewItemForm: false,
            //MODAL
            modalShow: false,
            //TEMPLATE TITLE
            templateTitle: '',
            //SELECTED GROUP ITEM
            setSelectedIndex: null,

        }
    }

    /* poner el de cargando  */
    componentDidMount() {
        this.getGroups()
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

    getGroups() {
        groupIitemService.settGetGroup().then((response) => {
            if(response.status !== 200){
                console.log('Error', response.status);
                return;
            }
            console.log(response)
            this.setState({
                groupInfo: response.data,
                loading: false,
            });
        })
        .catch ((errors) => {
            console.log(errors);
        })
    }

    deleteGroup = (event) => {
        groupIitemService.settDelGroup(event.target.value).then((response) => {
            if(response.status !== 200){
                console.log('Error', response.status);
                return;
        }
        this.getGroups();
        })
        .catch ((errors) => {
            console.log(errors);
        })
    }

    showModal = () => {
        this.setState({ 
            modalShow: !this.state.modalShow , showNewItemForm: false});
    }

    updateModal = () => {
        this.getGroups()
        this.setState({ modalShow: !this.state.modalShow });
    }


    //ITEMS
    //get the Items from a group
    getGroupItems(groupId) {
        groupIitemService.settGetItem(groupId)
        .then((response) => {
            if(response.status !== 200){
                console.log('Error', response.status);
                return;
            }
           /*  console.log(response.data.groupDetails)  */
            this.setState({
                itemList: response.data.groupList, 
                groupDetails: response.data.groupDetails,
                selectedGroupId: groupId,
            });
        })
        .catch ((errors) => {
            console.log(errors);
        })
    }
    
    //Handle group click
    handleGroupClick = (item) => (event) => {
        /* this.setState({ selectedIndex: index }) */
        this.setState({ 
            showItems: true,  
            showNewItemForm: false,
            selectedIndex: item,
        });
        this.getGroupItems(item) 
    }
        
    deleteItem = (event) => {
        groupIitemService.settDelItem(event.target.value)
        .then((response) => {
            if(response.status !== 200){
                console.log('Error', response.status);
                return;
            }
            console.log(response)
            this.getGroupItems(this.state.selectedGroupId)
        })
        .catch ((errors) => {
            console.log('Error', response.status);
        })
        

    }

    showNewItem = () => {
        this.setState({ showNewItemForm: !this.state.showNewItemForm });
    }

    //Save form data to create a new group on the data base
    saveForm = (values, { resetForm }) => {
        groupIitemService.settSaveItem(this.state.selectedGroupId, values)
        .then((response) => {
            if(response.status !== 200){
                console.log('Error', response.status);
                return;
            }
            /* console.log(response) */
            this.getGroupItems(this.state.selectedGroupId) 
        })
        .catch ((errors) => {
            console.log(errors);
        })
        resetForm({});
    
    }

    
    //Save form data to create a new group on the data base
    saveGroupForm = (values, { resetForm }) => {
        groupIitemService.settSaveGroup(values)
        .then((response) => {
            if(response.status !== 200){
                console.log('Error', response.status);
                return;
            }
            /* console.log(response) */
           /*  this.props.onHide */
        })
        .catch ((errors) => {
            console.log(errors);
        })
        resetForm({});
        this.getGroups()
        this.updateModal()
   
    }

    


    render() {

        
    //const [selectedIndex, setSelectedIndex] = React.useState(0);
  
    const handleListItemClick = (event, index) => {
        this.setState({ selectedIndex: index })

 /*        this.setState({ 
            showItems: true,  
            showNewItemForm: false,
            selectedIndex: 0,
        }); */
        this.getGroupItems(item) 
      //setSelectedIndex(index);
    };

        let groupDetails = 
            <div className="font-weight-bold"> 
                Character:  {this.state.groupDetails.character } 
                <span className="ml-1"></span>
                Total Mark: { this.state.groupDetails.total_mark }
            </div> 

        const groupList =  
            this.state.groupInfo.map((group, index) => 
                <ListItem action selected={this.state.selectedIndex === group.id}
                            component={ListGroup.Item}
                            onClick={(event) => handleListItemClick(event, group.id)} 
                            onClick={ this.handleGroupClick(group.id)}  >
                            <p>
                                <b> Group {index+=1} </b>
                                {/*  <div className="showhim">HOVER ME */}
                                {/*  <button className="btn-sm border shadow-sm btn-outline-light"  
                                value={group.id} onClick={ this.deleteGroup }>x</button>    */}
                                <br/>
                                { group.title }
                            </p>
                </ListItem>
            )

        const itemList =  
            this.state.itemList.map((item, index) =>
                <ListGroup.Item key={ index }>
                    <Row>
                        <Col md={1}>{ index+=1 } </Col>
                        <Col md={3}>{ item.short_comment }</Col>
                        <Col md={7}>{ item.long_comment }</Col>
                        <Col md={1}>
                            <button className="btn-sm border shadow-sm btn-outline-light" value={ item.id } onClick={ this.deleteItem }>x</button>
                        </Col>
                    </Row>
                </ListGroup.Item>

        )

        //NEW ITEM
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
                            <Field autoFocus name="short_comment" type="input" 
                                placeholder="New template title" 
                                className={'form-control mb-0' + (errors.short_comment && touched.short_comment ? ' is-invalid' : '')}/>
                            <ErrorMessage name="short_comment" component="div" className="invalid-feedback" />
                        </div>
                    </Col>
                    <Col sm={5}>
                        <div>
                            <label htmlFor="templateTitle" className="mb-0">Long comment:</label>
                            <Field name="long_comment" type="input"
                                placeholder="New template title" 
                                className={'form-control mb-0' + (errors.long_comment && touched.long_comment ? ' is-invalid' : '')}/>
                            <ErrorMessage name="long_comment" component="div" className="invalid-feedback" />
                        </div>
                    </Col>
                    <Col sm={3}>
                        <br/>
                        <div className="pt-1"> 
                            <button type="submit" className="btn-sm border shadow-sm btn-outline-light">Save</button> 
                            <a className="btn-sm border shadow-sm btn-outline-light" onClick={ this.showNewItem } >
                                Close
                            </a>
                        </div>
                    </Col>
                </Row>
            </form>
            )}
        </Formik>

        let newItemForm = "";
            if(!this.state.showNewItemForm){
                newItemForm =  
                    <a onClick={ this.showNewItem } className="btn-sm border shadow-sm btn-outline-light">
                        Add Item
                    </a>
            }
            else{
                newItemForm = newItem
            }
            
        //NEW GROUP
        const initialValuesGroup = {
            title: "", 
            char: "",
            totalMark: "" 
        } 
    
        const validationsGroup = 
            Yup.object().shape({
                title: Yup.string().required("This field is required."),
                char: Yup.string().required("This field is required."),
                totalMark: Yup.string().required("This field is required."),
        }) 
       

        const newGroup = 
        <Formik initialValues={ initialValuesGroup }  onSubmit={ this.saveGroupForm } validationSchema = { validationsGroup } >
        {({ handleSubmit, touched, errors }) => (
        <form onSubmit={ handleSubmit } autoComplete="off" >
            <Row>
                <Col sm={5}>
                    <div>
                        <label htmlFor="templateTitle" className="mb-0">Group Title:</label>
                        <Field autoFocus name="title" type="input" 
                            placeholder="New group title" 
                            className={'form-control mb-0' + (errors.title && touched.title ? ' is-invalid' : '')}/>
                        <ErrorMessage name="title" component="div" className="invalid-feedback" />
                    </div>
                </Col>
                <Col sm={2}>
                    <div>
                        <label htmlFor="templateTitle" className="mb-0">Character:</label>
                        <Field name="char" type="input"
                            placeholder="New group character" 
                            className={'form-control mb-0' + (errors.char && touched.char ? ' is-invalid' : '')}/>
                        <ErrorMessage name="char" component="div" className="invalid-feedback" />
                    </div>
                </Col>
                <Col sm={2}>
                    <div>
                        <label htmlFor="templateTitle" className="mb-0">Total mark:</label>
                        <Field name="totalMark" type="input"
                            placeholder="Total group mark" 
                            className={'form-control mb-0' + (errors.totalMark && touched.totalMark ? ' is-invalid' : '')}/>
                        <ErrorMessage name="totalMark" component="div" className="invalid-feedback" />
                    </div>
                </Col>
                <Col sm={3} className="text-right">
                    <br/>
                    <div className="pt-1"> 
                    <button type="submit" className="btn-sm border shadow-sm btn-outline-light">Save</button> 
                    <a className="btn-sm border shadow-sm btn-outline-light" onClick={ this.updateModal } >Close</a>
                    </div>
                </Col>
            </Row>
        </form>
        )}
        </Formik>


        const modal = 
            <Modal keyboard={ true }
               backdrop="static"
              size="lg"
               show={ this.state.modalShow } onHide={ this.updateModal }>
                <Modal.Header closeButton className="pb-0">
                    <h5 className="font-weight-bold">New Group </h5>
                </Modal.Header>
                <Modal.Body > 
                    { newGroup }
                </Modal.Body>
            </Modal>



    
        return(
            <React.Fragment>
                <h1>Marking Template</h1>
                <hr/>
                <h4>{ this.state.templateTitle }</h4>
                <Row>
                    <Col md={3}>
                        <React.Fragment>
                            <ListGroup.Item >
                            <a className="btn-sm border shadow-sm btn-outline-light" 
                            onClick={ this.showModal } >Add group</a>
                            { modal }
                            </ListGroup.Item> 
                            {
                                /* CHANGE THIS TO SHOW NO  GROUPS ASSIGNED TO THIS TEMPLATE */
                                (this.state.loading)?(<p className="text-muted">Loading...</p>):( groupList )
                            }

                        </React.Fragment>
                    
                    </Col>
                    <Col md={9}>
                        {
                            (!this.state.showItems)?(
                                <p className="text-muted">No group selected.</p>
                            ):(
                                <React.Fragment>
                                    <ListGroup.Item>
                                        { newItemForm } 
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        { groupDetails } 
                                    </ListGroup.Item>
                                    {
                                        this.state.itemList.length > 0? 
                                        (  
                                            itemList
                                        ):
                                        ( <p className="text-muted">No items assigned to this group.</p> )
                                    }
                                   
                                </React.Fragment>  
                            )
                        }   
                        <hr/>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}
