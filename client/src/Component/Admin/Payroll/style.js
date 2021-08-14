import { makeStyles } from "@material-ui/core/styles";

export default makeStyles(theme => ({
    perAgent:{
        [theme.breakpoints.down('sm')]:{
            fontSize: 'x-small'
        }
    },
    container:{
        paddingLeft: theme.spacing(5)
    },
    perSubsContainer:{
        paddingLeft: theme.spacing(7)
    },
    arrow:{
        width: theme.spacing(2),
        height: theme.spacing(2)
    },
    perSubsArrow:{
        width: theme.spacing(2),
        height: theme.spacing(2),
        fontSize: 'small',
        [theme.breakpoints.down('sm')]:{
            width: theme.spacing(1.5),
            height: theme.spacing(1.5),
            fontSize: 'x-small',
        }
    },
    perSubs:{
        [theme.breakpoints.down('sm')]:{
            fontSize: 'x-small'
        }
    },
    perSubsPlan:{
        [theme.breakpoints.down('sm')]:{
            fontSize: 'x-small'
        }
    },
    netIncome:{
        backgroundColor: theme.palette.warning.light,
        padding: theme.spacing(0, 0.5),
        marginBottom: theme.spacing(0.5),
    }
}));