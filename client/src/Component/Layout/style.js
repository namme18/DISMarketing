import { makeStyles } from "@material-ui/core";

const drawerWidth = 240;

export default makeStyles((theme) => ({
    root: {
        display: 'flex'
    },
    toolbar: theme.mixins.toolbar,
    active: {
        background: '#f4f4f4'
    },
    drawer: {
        [theme.breakpoints.up('sm')]:{
            width: drawerWidth,
            flexShrink: 0,
        }
    },
    drawerPaper: {
        width: drawerWidth
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
          width: `calc(100% - ${drawerWidth}px)`,
          marginLeft: drawerWidth,
        }
    },
    menuButton:{
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display:'none'
        }
    },
    page:{
        background: '#f9f9f9',
        width: '100%',
        padding:theme.spacing(3)
    },
    conLogo: {
        padding: theme.spacing(2),
        width: drawerWidth,
        cursor: 'pointer'
    },
    dislogo:{
        height: '55px',
        flexGrow: 1,
        cursor: 'pointer'
    },
    snackbar: {
        '& .MuiAlert-filledWarning': {
        backgroundColor: 'rgba(255,152,0, 0.8)'
        }
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
      },
}));