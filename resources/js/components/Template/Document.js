import React from 'react';
import { reviewService } from '../Services'

export default class Document extends React.Component {
    constructor() {
        super();

        this.state = {
            loading: true,
            documentGroups : [],
            markGroups: '',
            commentsGroups: '',
            totalMark: '',
            documentOuts : [],
            genOKComments: null,
            genIMPComments: null,
            headingInfo: []
        }

    }
    
    componentDidMount() {
        reviewService.getDocument().then((response) => { this.handleResponse(response) }) 
     
    } 
        
    handleResponse(response) {
        if(response.status !== 200){
            //userService.logOut();
            console.log('Error', response.status);
            return;
        }
        //console.log(response);
        this.setState({
            documentGroups: response.data.selGroupItems,
            documentOuts: response.data.selLearnOutcomes,
            //GENERAL COMMENTS
            genOKComments: response.data.genGoodComment,
            genIMPComments: response.data.genImpComment,
            //TOTAL MARK
            totalMark: response.data.totalMark,
            //HEADING
            headingInfo: response.data.generalInfo,
            //LOADING
            loading: false

        })   
    }

    render() {
    
        const heading = 
            <React.Fragment>
                <h4 className="mt-0 mb-0"> {this.state.headingInfo.moduleName} </h4> 
                <h6>{ this.state.headingInfo.markSheetTitle }</h6> 
                <br/>
                <h6>
                    First Marker: 
                    <br/>
                    SID: { this.state.headingInfo.studentId }   
                    <br/>         
                Total Mark: { this.state.totalMark } %
                </h6> 
            </React.Fragment>   
            
        const groupsInfo =   
            this.state.documentGroups.map((docItem) => 
                <div>    
                    <h6>{ docItem.title } ({docItem.mark } out of { docItem.total_mark })</h6>
                    <ul>
                        { docItem.items.map((item)=>
                            <li>
                                { docItem.character+".- "+ item.long_comment }
                            </li>
                        )
                        }
                        <br/>
                        { 
                            (!docItem.ob)?(""):
                            (
                                <React.Fragment>
                                    <b>Observations</b> 
                                    <p>
                                        { (docItem.ob) }
                                    </p>
                                </React.Fragment>
                            ) 
                        } 
                    </ul>
                </div>
            )

        const learningOutcomes =   
            this.state.documentOuts.map((learnItem) => 
                <li>
                    { learnItem.long_comment }
                </li>
            )

        let OKComments = ""
            if(this.state.genOKComments) {
                OKComments = 
                    <React.Fragment>
                        <h6>What you did good:</h6>
                        <p align="justify"> { this.state.genOKComments } </p>
                    </React.Fragment> 
            }

        let IMPComments = ""
            if(this.state.genIMPComments) {
                IMPComments =
                    <React.Fragment>
                        <h6>You could do the following to improve your work in future:</h6>
                        <p align="justify"> { this.state.genIMPComments } </p>
                    </React.Fragment>
            }

        
   
        return (
            <React.Fragment>
                 {
                (this.state.loading)?
                    (<p className="text-muted">Loading...</p>)
                    :(
                        <React.Fragment>
                            { heading }
                            <p align="justify">
                                The following is a set of feedback to help you to identify improvements, and feed forward on what you have done well. We hope that you will be able to use the feedback to continue to improve your work and continue with already good practice. If you wish to discuss this feedback in person please see the ModuleTutor.
                            </p>
                        
                            <h5>Feedback</h5>
                            <hr/>
                            <p>
                                Throughout your script you will see the following codes. Here is anexplanation of what they mean. Please use these to guide you in your future assignments:
                            </p>
                            { groupsInfo }
                            <br/>
                            <h6>If you have passed this module, you will have achieved the following:</h6>
                            <ul>
                                { learningOutcomes }
                            </ul>
                            <br/>
                            { OKComments }
                            { IMPComments }
                                      
                            <small>
                                You may wish to keep a note of these achievements, for use in your personaldevelopment planning. 
                            </small>

                        </React.Fragment>
                    )
                }
            </React.Fragment>
        );
    }
}