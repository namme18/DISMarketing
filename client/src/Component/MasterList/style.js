import { makeStyles } from "@material-ui/core";

export default makeStyles(theme => ({
    paper:{
        padding: theme.spacing(2),
        display: 'flex',
        marginTop: theme.spacing(5),
        alignItems: 'center',
        flexDirection: "column"
    },
    divider:{
        margin: theme.spacing(2)
    }
}));