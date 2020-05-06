import React from "react"
import { subtitleService } from './Services';


export default class Subtitle extends React.Component {

    constructor () {
        super();
        
        this.state = {
                subtitleInfo: [],
            }
    }
   
    componentDidMount() {
        this.getSubtitle()
    }

    
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


    render() {
   
          return(
            <p className="font-weight-bold"> { this.state.subtitleInfo } </p>
        );
    }
}