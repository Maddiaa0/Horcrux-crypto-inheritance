import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';


// context 
import Web3Context from "../../web3Context";
import { useHistory } from 'react-router';
import getWeb3 from '../../getWeb3';

const lightColor = 'rgba(255, 255, 255, 0.7)';

const styles = (theme) => ({
  secondaryBar: {
    zIndex: 0,
  },
  menuButton: {
    marginLeft: -theme.spacing(1),
  },
  iconButtonAvatar: {
    padding: 4,
  },
  link: {
    textDecoration: 'none',
    color: lightColor,
    '&:hover': {
      color: theme.palette.common.white,
    },
  },
  button: {
    borderColor: lightColor,
  },
});

function Header(props) {
  const { classes, onDrawerToggle } = props;

  const web3Context = useContext(Web3Context);
  const [currentAddress, setCurrentAddress] = useState("");
  const {web3} = web3Context;    

  const history = useHistory();
  console.log(history);
  const title = history.location.pathname.split("/").slice(-1)[0];


  useEffect(()=>{
    async function set(){
        const localWeb3 = await getWeb3();
        //setWeb3(localWeb3);
        setCurrentAddress(localWeb3.currentProvider.selectedAddress);
        console.log(localWeb3.currentProvider.selectedAddress);
    }
    set();

}, []);



  return (
    <React.Fragment>
      <AppBar color="primary" position="sticky" elevation={0}>
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
            <Hidden smUp>
              <Grid item>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={onDrawerToggle}
                  className={classes.menuButton}
                >
                  <MenuIcon />
                </IconButton>
              </Grid>
            </Hidden>
            <Grid item xs />
            <Grid item>
              <Tooltip title="Logged in account - using metamask">
                <Typography>{currentAddress !== "" ? currentAddress : ""}</Typography>
              </Tooltip>
            </Grid>
            <Grid item>
              <IconButton color="inherit" className={classes.iconButtonAvatar}>
                <Avatar src="/static/images/avatar/1.jpg" alt="My Avatar" />
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar
        component="div"
        className={classes.secondaryBar}
        color="primary"
        position="static"
        elevation={0}
      >
        <Toolbar>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs>
              <Typography color="inherit" variant="h5" component="h1">
                {/* THIS SHOULD CHANGE WITH THE USERS */}
                {title}
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar
        component="div"
        className={classes.secondaryBar}
        color="primary"
        position="static"
        elevation={0}
      >
        {title === "vault" && <Tabs value={0} textColor="inherit">
          <Tab textColor="inherit" label="Vault" />
          <Tab textColor="inherit" label="Edit access control" />
        </Tabs>}
        {title === "recovery" && 
        <Tabs value={0} textColor="inherit">
            <Tab textColor="inherit" label="Manage Trustees" />
            <Tab textColor="inherit" label="Manage Blacklist" />
        </Tabs>
        }
      </AppBar>
    </React.Fragment>
  );
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  onDrawerToggle: PropTypes.func.isRequired,
};

export default withStyles(styles)(Header);