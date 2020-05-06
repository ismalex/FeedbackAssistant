import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

export default function Userinfo() {

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    //logout function
    //delete tokens 
    //redirect 
  };

  return (
    <div>
		<Grid container spacing={3}>
			<Grid item xs={10}>
			</Grid>
			<Grid item xs={2}>
				{/* <Paper >xs=4</Paper> */}
			<Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
			ALEX ARAGON
			</Button>
			<Menu id="simple-menu" anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose}
			>
				<MenuItem onClick={handleClose}>Logout</MenuItem>
			</Menu>
			</Grid>
		</Grid> 
    </div>
  );
}