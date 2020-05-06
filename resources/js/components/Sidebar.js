import React from 'react'
import { Link } from 'react-router-dom'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';


export default function Sidebar() {

    const linkStyles = {
        color: "black",
        textDecoration: "none"
    }

    const [selectedIndex, setSelectedIndex] = React.useState(0);
  
    const handleListItemClick = (event, index) => {
      setSelectedIndex(index);
    };
    
        return (
            <React.Fragment>
                <div id="sidebar" className="sidebar" style={{backgroundColor: "white"}}>
                    <div className="logo" >
                        <Link to="/webfeedback/public/modules" style={ linkStyles } >
                            <h5>FeedbackAssistant</h5>   
                        </Link>
                    </div>
                    <div className="sidebar-wrapper">
                        <div className="mb-5"></div>
                        <List component="nav" aria-label="main mailbox folders">
                            <ListItem button selected={selectedIndex === 0}
                            onClick={(event) => handleListItemClick(event, 0)}
                            component={Link} style={{color: "black"}} to="/webfeedback/public/modules" >
                                <Link to="/webfeedback/public/modules" style={ linkStyles }  >
                                    <p><ion-icon  name="book-outline"></ion-icon> &nbsp;
                                    Modules</p>
                                </Link>
                            </ListItem>
                            <ListItem button selected={selectedIndex === 1}
                            onClick={(event) => handleListItemClick(event, 1)} 
                            component={Link} style={{color: "black"}} to="/webfeedback/public/module/send">
                             <Link to="/webfeedback/public/module/send" style={ linkStyles }>
                                <p><ion-icon name="mail-unread-outline"></ion-icon>&nbsp;
                                    Send Feedback</p>
                                </Link>
                            </ListItem>
                       
                            <Divider />
                            <ListItem button selected={selectedIndex === 2}
                                onClick={(event) => handleListItemClick(event, 2)}>
                                <p><ion-icon name="cube-outline"></ion-icon>
                                &nbsp;Settings</p>
                            </ListItem>
                            <ListItem button selected={selectedIndex === 3}
                                onClick={(event) => handleListItemClick(event, 3)}
                                component={Link} style={{color: "black"}} to="/webfeedback/public/settings/modules" >
                                
                                    <Link to="/webfeedback/public/settings/modules" style={ linkStyles }>
                                        <p> - Modules</p>
                                    </Link>

                                </ListItem>
                            <ListItem button selected={selectedIndex === 4}
                            onClick={(event) => handleListItemClick(event, 4)}    
                            component={Link} style={{color: "black"}}  to="/webfeedback/public/settings/templates" >
                                <Link to="/webfeedback/public/settings/templates" style={ linkStyles }>
                                    <p>- Templates</p>
                                </Link> 
                            </ListItem>
                            <ListItem button selected={selectedIndex === 5}
                            onClick={(event) => handleListItemClick(event, 5)}    
                            component={Link} style={{color: "black"}}  to="/webfeedback/public/settings/assign" >
                                <Link to="/webfeedback/public/settings/assign" style={ linkStyles }>
                                    <p>- Assign Template</p>
                                </Link>
                            </ListItem>
                        </List>
                          
                    </div>
                </div>
            </React.Fragment>
        );
}