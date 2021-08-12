import { 
    TableCell, 
    TableRow, 
    Typography, 
    Grid, 
    Avatar
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    avatar:{
        width: theme.spacing(2),
        height: theme.spacing(2),
        backgroundColor: theme.palette.secondary.light,
        margin: theme.spacing(0, 1, 0, 0),
        fontSize: 'small'
    },
    name:{
        fontWeight: 'bold'
    }
}))

const InstalledSubsRow = ({sub, index}) => {

    const classes = useStyles();

    return(
        <TableRow key={sub._id}>
            <TableCell>
                <Grid container direction='row' justify='flex-start' alignItems='center' >
                    <Avatar className={classes.avatar}>{index+1}</Avatar>
                    <Typography variant='subtitle2' className={classes.name} >
                        {`${sub.fullname.map(name => name.toLowerCase()).map(name => name[0].toUpperCase()+name.substring(1)).join(' ')}`}
                    </Typography>
                </Grid>
                </TableCell>
        </TableRow>
    )
}

export default InstalledSubsRow;