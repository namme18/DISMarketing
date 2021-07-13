import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import {
    Typography,
    Box,
    Collapse,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowDown';

const Row = ({row}) =>{
    const [open, setOpen] = useState(false);

    return(
        <>
        <TableRow>
            <TableCell>
                <IconButton arial-label='expand row' size='small' onClick={() => setOpen(!open)}>
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </TableCell>
            <TableCell align='center' component='th' scope='row'>
                {row.team}
            </TableCell>
            <TableCell align='center'>{row.installed}</TableCell>
            <TableCell align='center'>{row.appsgen}</TableCell>
        </TableRow>

        <TableRow>
            <TableCell style={{paddingBottom:0, paddingTop:0}} colSpan={6}>
                <Collapse in={open} unmountOnExit timeout='auto'>
                    <Box margin={1}>
                        <Typography variant='body1' gutterBottom comnponent='div'>Agents Performance</Typography>

                        <Table size='small' arial-label='purchases' dense Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align='center'>Agent</TableCell>
                                    <TableCell align='center'>Installed</TableCell>
                                    <TableCell align='center'>Apssgen</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {row.agentsPerformance.map(agent => (
                                    <TableRow key={agent.agentName}>
                                        <TableCell align='center'>{agent.agentName}</TableCell>
                                        <TableCell align='center'>{agent.agentInstalled}</TableCell>
                                        <TableCell align='center'>{agent.agentAppsGen}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
        </>
    )
}

export default Row;