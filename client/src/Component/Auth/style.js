import { makeStyles } from "@material-ui/core";

export default makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(5),
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(2),
        alignItems: 'center'
    },
    avatar:{
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    form:{
        width: '100%',
        marginTop: theme.spacing(3)
    },
    textfield:{
        margin: theme.spacing(.3),
        textTransform: "capitalize"
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    }
}));