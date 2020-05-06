import React from 'react'
import axios from 'axios'
import { templateService } from '../Services'
import { Formik, Field } from 'formik'
import ListGroup from 'react-bootstrap/ListGroup'
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Checkbox from '@material-ui/core/Checkbox';  
import Review from './Review'
import Subtitle from '../Subtitle'


export default class Markingsheet extends React.Component  {
    constructor () {
        super();

        this.state = {
            templateInfo: [],
            templateOutcomes: [],
            loading: true,
            modalShow: false,
            nextPage: false
        }
    }

    //Get the Template info form the database and assign it to the state
    componentDidMount() {
        templateService.getTemplate().then((response) => { this.handleResponse(response) })

    } 
   
    //SET THE INFO FROM THE BDD TO THE STATE 
    handleResponse(response) {
        if(response.status !== 200){
            //userService.logOut();
            console.log('Error', response.status);
            return;
        } 
       /*  console.log(response) */
        this.setState({
            templateInfo: response.data.markingTemplate,
            templateOutcomes: response.data.markingOutcomes,
            loading: false

        });
    }    

    //Save the marking template data 
    submitTemplate(data) {
 
        //Save the data to the DataBase
        templateService.saveTemplate(data)
        .then((response) => {
            if(response.status !== 200){
                console.log('Error Marking Template:', response.status);
                return;
            }
           /*  console.log(response) */
            this.setState({ modalShow: true })
        })
        .catch ((errors) => {
            console.log(errors);
        })

    }
  

    render() {
        const controls = { width: "50px" }
       
        //Show modal variables
        let modalClose = () => this.setState({ modalShow: false });

        //add the data fomr the data base when it is ready
        const initialValues = {
            group1_mark: "", 
        }  

        //TO DO THE COLUMN LAYOUT IDK YET
        let columnItems = (groupInfo) => {
           return  groupInfo.items.map((groupItem, index) => {
            if(index === 0){
                <div >
                    <Field name="checkboxes" type="checkbox" as={Checkbox} color="default"
                        id={"group"+groupInfo.id+"_"+groupItem.id} value={"group"+groupInfo.id+"_"+groupItem.id} />
                    <label htmlFor={"group"+groupInfo.id+"_"+groupItem.id}>
                        { groupInfo.character+'-  ' +groupItem.short_comment }
                    </label>
                </div>
            }
           }
            )

        }
        

        //Marking Template first page
        const markingTemplate = 
        <Formik initialValues={ initialValues } 
                onSubmit={ (data) => { this.setState({ nextPage: true })}
            } 
        >
        {({ handleSubmit, values, touched }) => (
            <form onSubmit={ handleSubmit } autoComplete="off">
            {
                this.state.templateInfo.map((groupInfo, index) =>
                    <React.Fragment>
                        <h5 key={index} className="font-weight-bold">{ groupInfo.title } {"  "}
                            <span className="badge badge-light form-inline">
                                <Field name={ "group"+groupInfo.id+"_mark" } placeholder="0" type="input" 
                                    className="form-control form-control-sm mb-0"  style={ controls }/>
                                {" "} out of { " "+groupInfo.total_mark }
                            </span>
                        </h5> 
                        <hr/>
                       {/*  <table> */}
                        { 
                            groupInfo.items.map((groupItem, index) => 
                                <div key={ index }>
                                    <Field name="checkboxes" type="checkbox" as={Checkbox} color="default"
                                        id={"group"+groupInfo.id+"_"+groupItem.id} value={"group"+groupInfo.id+"_"+groupItem.id} />
                                    <label htmlFor={"group"+groupInfo.id+"_"+groupItem.id}>
                                        { groupInfo.character+'-  ' +groupItem.short_comment }
                                    </label>
                                </div>
                            )
                        }
                       {/*  </table> */}
                        <div className="m-3">
                            <div>Observations:</div>
                            <Field name={"group"+groupInfo.id+"_"+"ob" } as={ TextareaAutosize } 
                                  id={ "group"+groupInfo.id+"_"+"ob" }  aria-label="minimum height" rowsMin={3}  cols="60" 
                                    placeholder="Group observations" 
                            />
                        </div>     
                    </React.Fragment>
                    )}
                    <button type="submit" className="btn-sm border shadow-sm btn-outline-light" >Next</button>
                </form>
                )}
        </Formik>
       
       //Marking Template second page
       const learningOutcomes = 
       <Formik initialValues={ initialValues } 
               onSubmit={ (data) => { this.submitTemplate(data) }} >
       {({ handleSubmit, values, touched, }) => (
            <form onSubmit={ handleSubmit } autoComplete="off">
                <h5 className="font-weight-bold"> Learning Outcomes</h5> 
                <hr/>
                <label className="text-muted">How well did this assesment meet the Learning Outcomes. </label>
                { 
                this.state.templateOutcomes.map((item, index) =>
                    <div key={ index }>         
                        <Field name="learningOut" type="checkbox" as={ Checkbox } color="default"
                                id={ "learn"+item.id } value={ "learn"+item.id } />
                        <label htmlFor={ "learn"+item.id }> { item.short_comment +"-"+ item.long_comment } </label>
                    </div>    
                    )
                }
                <br/>
                <h5 className="font-weight-bold"> General Comments</h5> 
                <hr/>
                <div className="m-3">
                    <p>About What the student did well: </p>
                    <Field name="Gen1" as={ TextareaAutosize } 
                            aria-label="minimum height" rowsMin={3}  cols="60" 
                            placeholder="What the student did well?" 
                    />
                    <br/>
                    <p>About what the student need to improve:</p>
                    <Field name="Gen2" as={ TextareaAutosize } 
                            aria-label="minimum height" rowsMin={3}  cols="60" 
                            placeholder="What the student needs to improve?" 
                    />   
                </div>     
                <button type="submit" className="btn-sm border shadow-sm btn-outline-light">Next</button>
               </form>
               )}
        </Formik>

        return(
            <React.Fragment>
                <h1>Marking Template</h1>
                <Subtitle />
                <hr/>
                {
                (this.state.loading)?
                    (<p className="text-muted">Loading...</p>)
                    :(
                    <ListGroup>
                        <ListGroup.Item>
                        {
                            (!this.state.nextPage)? 
                                (markingTemplate):(learningOutcomes)
                        }
                        <Review show={ this.state.modalShow } onHide={ modalClose } />  
                        </ListGroup.Item>
                    </ListGroup>
                    )
                }
            </React.Fragment>    
        );
    }
}

