import React from 'react';
import { 
    Typography,
    Box,
    Divider,
    Card,
    CardContent,
    Grid
} from '@material-ui/core';
import { format } from 'date-fns';

const Payout = ({dislogo, deductions, payoutFrom, payoutTo, classes, SSS, PHIC, CA, totalCommi, VAT, user, HDMF, commiPercentage, activePayout}) => {
        const incentives = user.incentives?.map(inc => parseFloat(inc.amount)).reduce((a, b) => a + b, 0).toFixed(2);
        const deductions2 = user.deductions?.map(ded => parseFloat(ded.amount)).reduce((a, b) => a + b, 0).toFixed(2);
    return(
        <Card className={classes.card} elevation={5}>
            <CardContent>
                <Grid container direction='row' alignItems='center' justify='center' spacing={2}>
                    <Grid item>
                        <img alt='DISMarketin' src={dislogo} style={{height:80}} />
                    </Grid>
                    <Grid item>
                        <Typography align='center' style={{lineHeight:'17px'}} variant='h6' comnponent='p'>DIS Marketing Services</Typography>
                        <Typography align='center' style={{lineHeight:'17px'}} variant='subtitle1' comnponent='p' color='textSecondary'>San Andres, Victorial, Tarlac</Typography>
                        <Typography align='center' style={{lineHeight:'17px'}} variant='subtitle1' comnponent='p' color='textSecondary'>Date: {format(new Date(), 'do MMMM Y')}</Typography>
                    </Grid>
                </Grid>
                <br/>
                <Box  display='flex' justifyContent='flex-start' alignItems='center'>
                    <Typography variant='subtitle1'><strong>Employee:</strong></Typography>
                    <Typography display='inline' noWrap variant='body2' color='textSecondary'>&nbsp;{user.username?.split(' ').map(name => name[0].toUpperCase()+name.substring(1)).join(' ')}</Typography>
                </Box>
                <Box display='flex' justifyContent='flex-start' alignItems='center'>
                    <Typography variant='subtitle1'><strong>Position:</strong></Typography>
                    <Typography display='inline' noWrap variant='body2' color='textSecondary'>&nbsp;{user && user?.restrictionlevel[0].toUpperCase()+user.restrictionlevel.substring(1)}</Typography>
                </Box>
                <Box display='flex' justifyContent='flex-start' alignItems='center'>
                    <Typography variant='subtitle1'><strong>Dc:</strong></Typography>
                    <Typography display='inline' noWrap variant='body2' color='textSecondary'>&nbsp;{`${payoutFrom?.split(' ')[0]} ${payoutFrom?.split(' ')[1]} - ${payoutTo}`}</Typography>
                </Box>
                <Divider />
                <Box display='flex' justifyContent='space-between' alignItems='center'>
                    <Typography variant='subtitle1'><strong>Earnings</strong></Typography>
                    <Typography variant='subtitle1'><strong>Amount</strong></Typography>
                </Box>
                {activePayout?.map((sub, index) => (
                    <Box display='flex' justifyContent='space-between' alignItems='center' key={index}>
                        <Typography variant='body2' display='block' style={{maxWidth: '50%'}} noWrap color='textSecondary'>{`${sub.fullname.map(n => n[0].toUpperCase()+n.substring(1)).join(' ')}`}</Typography>
                        <Typography variant='body2' display='block' style={{maxWidth: '50%'}} noWrap color='textSecondary'>{sub.plan}|P{(parseFloat(sub.plan)*parseFloat(commiPercentage)).toFixed(2)}</Typography>
                    </Box>
                ))}
                <Box display='flex' justifyContent='space-between' alignItems='center'>
                    <Typography variant='subtitle1'><strong>Incentives</strong></Typography>
                </Box>
                {user.incentives?.map((inc, index) => (
                    <Box display='flex' justifyContent='space-between' alignItems='center' key={index}>
                        <Typography variant='body2' display='block' style={{maxWidth: '50%'}} noWrap color='textSecondary'>{`${inc.remarks?.split(' ').map(n => n[0].toUpperCase()+n.substring(1)).join(' ')}`}</Typography>
                        <Typography variant='body2' display='block' style={{maxWidth: '50%'}} noWrap color='textSecondary'>P{parseFloat(inc.amount).toFixed(2)}</Typography>
                    </Box>
                ))}
                    <Typography variant='body2' style={{fontWeight:'bold'}}>Deductions</Typography>
                    <Divider />
                    <Box display='flex' justifyContent='space-between' alignItems='center'>
                        <Typography variant='body2' display='block' style={{maxWidth: '50%'}} noWrap color='textSecondary'>SSS prem.</Typography>
                        <Typography variant='body2' display='block' style={{maxWidth: '50%'}} noWrap color='textSecondary'>{SSS}</Typography>
                    </Box>
                    <Box display='flex' justifyContent='space-between' alignItems='center'>
                        <Typography variant='body2' display='block' style={{maxWidth: '50%'}} noWrap color='textSecondary'>PHIC prem.</Typography>
                        <Typography variant='body2' display='block' style={{maxWidth: '50%'}} noWrap color='textSecondary'>{PHIC}</Typography>
                    </Box>
                    <Box display='flex' justifyContent='space-between' alignItems='center'>
                        <Typography variant='body2' display='block' style={{maxWidth: '50%'}} noWrap color='textSecondary'>HDMF prem.</Typography>
                        <Typography variant='body2' display='block' style={{maxWidth: '50%'}} noWrap color='textSecondary'>{HDMF}</Typography>
                    </Box>
                    <Box display='flex' justifyContent='space-between' alignItems='center'>
                        <Typography variant='body2' display='block' style={{maxWidth: '50%'}} noWrap color='textSecondary'>CASH ADVANCE</Typography>
                        <Typography variant='body2' display='block' style={{maxWidth: '50%'}} noWrap color='textSecondary'>{CA}</Typography>
                    </Box>
                    <Box display='flex' justifyContent='space-between' alignItems='center'>
                        <Typography variant='body2' display='block' style={{maxWidth: '50%'}} noWrap color='textSecondary'>VAT 5%</Typography>
                        <Typography variant='body2' display='block' style={{maxWidth: '50%'}} noWrap color='textSecondary'>{parseFloat(totalCommi*VAT).toFixed(2)}</Typography>
                    </Box>
                    {user.deductions?.map((ded, index) => (
                        <Box display='flex' justifyContent='space-between' alignItems='center' key={index}>
                            <Typography variant='body2' display='block' style={{maxWidth: '50%'}} noWrap color='textSecondary'>{`${ded.remarks?.split(' ').map(n => n[0].toUpperCase()+n.substring(1)).join(' ')}`}</Typography>
                            <Typography variant='body2' display='block' style={{maxWidth: '50%'}} noWrap color='textSecondary'>{parseFloat(ded.amount).toFixed(2)}</Typography>
                        </Box>
                     ))}
                    <Divider />
                    <Box display='flex' justifyContent='space-between' alignItems='center'>
                        <Typography variant='subtitle1'><strong>Net Income</strong></Typography>
                        <Typography variant='subtitle1'><strong>{parseFloat(deductions)+parseFloat(incentives)-parseFloat(deductions2).toFixed(2)}</strong></Typography>
                    </Box>
            </CardContent>
        </Card>
    )
}

export default Payout;