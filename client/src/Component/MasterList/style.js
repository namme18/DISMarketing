import { makeStyles } from "@material-ui/core";

export default makeStyles(theme => ({
    paper:{
        padding: theme.spacing(2),
        display: 'flex',
        marginTop: theme.spacing(3),
        alignItems: 'center',
        flexDirection: "column",
    },
    divider:{
        margin: theme.spacing(1)
    },
    closeModal:{
        width: '100%',
    },
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
      },
    actionsContainer: {
        marginBottom: theme.spacing(2),
      },
    resetContainer: {
        padding: theme.spacing(3),
      },
    textField: {
        margin: theme.spacing(1, 0)
      }
}));