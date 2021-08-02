import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grow,
  Grid,
  Chip,
  Divider,
  Card,
  CardHeader,
  Avatar,
  IconButton
} from '@material-ui/core';
import ImportantDevicesIcon from '@material-ui/icons/ImportantDevices';
import Row from './Row';
import { format } from 'date-fns';
import TodayIcon from '@material-ui/icons/Today';
import { useSelector } from 'react-redux';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const useStyles = makeStyles(theme => ({
    divider:{
        margin: theme.spacing(2, 0)
    },
    table:{
      minWidth: 280,
    },
    thead:{
      color: theme.palette.primary.main
    },
    chip:{
      marginRight: theme.spacing(2),
      [theme.breakpoints.down('sm')]:{
        marginBottom: theme.spacing(2),
        width: '100%'
      }
    }
  }));

const Home = () => {
  
    const classes = useStyles();
    const { allUsers } = useSelector(state => state.authReducer);

  return (
    <Grow in>
        <div>
            <Grid container alignItems='center' justify='flex-start' >
                <Chip
                    sm={12}
                    className={classes.chip}
                    label="Sale's Monitoring"
                    variant='outlined'
                    icon= {<ImportantDevicesIcon />}
                    clickable
                    color='secondary'
                />
                 <Chip
                    className={classes.chip}
                    label={`Today is ${format(new Date(), 'do MMMM Y')}`}
                    variant='outlined'
                    icon= {<TodayIcon />}
                    clickable
                    color='secondary'
                />
            </Grid>
            <Divider className={classes.divider} />

            <Grid container direction='row' justify='flex-start'>
              <Grid item>
                <Card className={classes.card}>
                  <CardHeader 
                    avatar={
                      <Avatar>TI</Avatar>
                    }
                    action={
                      <IconButton>
                        <MoreVertIcon />
                      </IconButton>
                    }
                    title='TOTAL INSTALLED'
                    subheader='All installed for current month'
                  />
                </Card>
              </Grid>
            </Grid>

      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="collapsible table" size="small">
          <TableHead className={classes.thead}>
            <TableRow>
              <TableCell />
              <TableCell align='center'><strong>TEAMS</strong></TableCell>
              <TableCell align='center'><strong>INSTALLED</strong></TableCell>
              <TableCell align='center'><strong>APPSGEN</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allUsers
            ?.filter(user => user.restrictionlevel === 'teamleader')
            .map(tl => (
              <Row key={tl._id} tl={tl} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
        </div>
    </Grow>
  );
};

export default Home;
