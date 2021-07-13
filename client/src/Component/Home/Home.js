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
  Divider
} from '@material-ui/core';
import ImportantDevicesIcon from '@material-ui/icons/ImportantDevices';
import CreateData from './CreateData';
import Row from './Row';
import { format } from 'date-fns';
import TodayIcon from '@material-ui/icons/Today';

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

  const rows = [
    CreateData('team1', 159, 6.0),
    CreateData('team2', 237, 9.0),
    CreateData('team3', 262, 16.0),
    CreateData('team4', 305, 3.7),
    CreateData('team5', 356, 16.1),
  ];

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
            {rows.map(row => (
              <Row key={row.name} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
        </div>
    </Grow>
  );
};

export default Home;
