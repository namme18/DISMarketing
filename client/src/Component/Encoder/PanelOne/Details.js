import React, { useRef, useState } from 'react'
import { Grow, Grid, Avatar, Typography, IconButton, Stack, Box, Select, MenuItem, TextField, Button } from '@mui/material';
import { TextareaAutosize  } from '@mui/base';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';
import { useDispatch } from 'react-redux';
import { getErrors } from '../../../redux/reducers/errorReducer';
import { updateSubsByAdmin } from '../../../redux/reducers/subsActions/updateSubsByAdmin';

function useQuery(){
    return new URLSearchParams(useLocation().search);
}

const StyledContainer = styled(Grid)(({theme}) => ({
    padding: '10px'
}));

const StyledStack = styled(Stack)(({theme}) => ({
    margin: '0px 5px', 
    backgroundColor: theme.palette.primary.main, 
    color: theme.palette.getContrastText(theme.palette.primary.main),
    borderRadius: '10px',
    padding: '10px',
}));

const Details = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const query= useQuery();
    const subID = query.get('subID');
    const agentID = query.get('agentID');
    const value = query.get('value');
    const dateFrom = query.get('dateFrom');
    const dateTo = query.get('dateTo');
    const agent1 = useSelector(state => state.authReducer.allUsers);
    const agent = agent1?.filter(agent => agent._id === agentID)[0];
    const forspp = useSelector(state => state.subsReducer.forspp);
    const sub = forspp?.filter(sub => sub._id === subID)[0];
    const subArray = sub !== undefined ? Object.entries(sub):null;
    const item = subArray?.filter(objItem => objItem[0] !== 'attachments' && objItem[0] !== '_id' && objItem[0] !== '__v' && objItem[0] !== 'teamleader' && objItem[0] !== 'agent').map(obj => obj[0] === 'fullname' ? {name: obj[0], value: obj[1].join(' ')} : obj[0] === 'sppstatus' ? {name: obj[0], value: obj[1].status} : {name: obj[0], value: obj[1]});
    const refContainer = useRef([])
    const [data, setData] = useState({
        subID, 
        position: 'admin',
        sppRemarks: '',
        accountNumber: '',
        msg: ''
    })

    const handleDownloadImages = () => {
            const imgArray = refContainer.current;
            const download_next = (i) => {
                if(i >= imgArray.length){
                    return
                }
                refContainer.current[i].click();
                setTimeout(() => {
                    download_next(i + 1);
                },2000);
            }
        download_next(0);
    }

    const onChange = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }

    const clearData = () => {
        setData({
            sppRemarks: '',
            accountNumber: '',
            msg: ''
        });
    }
    console.log(data);
    const handleSubmit = () => {
        if((data.sppRemarks === 'spp done' && data.accountNumber === '') || (data.sppRemarks === '')){
            const errData = {
                msg: 'Please Enter Required Fields',
                status: 500,
                id: 'FAILED!'
            }
           return dispatch(getErrors(errData));
        }
        dispatch(updateSubsByAdmin(data))
            .then(res => {
                if(res.payload){
                    clearData();
                    history.push(`/home/encoder/forspplist?value=${value}&dateFrom=${dateFrom}&dateTo=${dateTo}`);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    return (
        <Grow in>
            <StyledContainer container>
                <Grid item container justifyContent='flex-start' alignItems='center'>
                    <Avatar sx={{mr: 1}} src={agent?.profilePicture} alt={agent?.username}></Avatar>
                    <Typography variant='subtitle1'>{agent?.username.split(' ')?.map(name => name[0].toUpperCase()+name.substring(1)).join(' ')}</Typography>
                </Grid>

                <Grid item container flexDirection='row' md={12} sx={{mt:1, ml:6}}>
                    <Grid item container flexDirection='row' justifyContent='flex-start' alignItems='center' sx={{marginBottom: '5px'}}>
                            <Typography variant='subtitle1' color='textSecondary'>Attachments: </Typography>
                        {sub?.attachments.map((obj, index) => (
                            <>
                            <Avatar key={obj.id} src={obj.img} alt='file' sx={{height: '30px', width: '30px', ml: 1, cursor: 'pointer'}}></Avatar>
                            <a ref={(element) => refContainer.current[index] = element} href={obj.img} download></a>
                            </>
                        ))}
                            <IconButton onClick={handleDownloadImages} sx={{color: theme => theme.palette.getContrastText(theme.palette.primary.light),bgcolor: theme => theme.palette.primary.light, height: '30px', width: '30px', ml: 1}}>
                                <DownloadIcon />
                            </IconButton>
                    </Grid>

                    {item?.map((item, index) => (
                        <Grid item container key={index} style={{padding: '1px'}} md={4} sm={6} xs={12}>
                            <Grid item container sx={{border: '1px solid lightgray', padding: '5px'}} justifyContent='flex-start' alignItems='center'>
                                <Typography variant='body2' color='textSecondary'>{item.name[0].toUpperCase()+item.name.substring(1)}:&nbsp;</Typography>
                                <Typography variant='body2' >{item.value}</Typography>
                            </Grid>
                        </Grid>
                    ))}
                </Grid>

                <Grid item container flexDirection='column' sx={{border:'1px solid skyblue', maxWidth:{sm: '100%', md:'70%'}, mt:1, ml:6, padding: '1px'}}>
                    <Typography variant='subtitle1' sx={{padding:'5px', fontWeight: 600}}>Remarks Conversation:</Typography>
                    {sub?.sppstatus?.remarks?.map((data, index) => (
                        <Grid item container key={index} sx={{padding: '10px'}} flexDirection={data.position === 'agent' ? 'row' : 'row-reverse'} justifyContent='flex-start'>
                            <Typography variant='body2' sx={{fontWeight: '600'}} color={data.position === 'agent' ? 'secondary' : 'primary'}>{data.position === 'agent' ? 'Agent:' : ':Admin'}</Typography>
                            <StyledStack direction='column'>
                                <Typography variant='caption'>{data.msg}</Typography>
                                <Stack direction='row' spacing={1}>
                                    {data?.attachments?.map((file, index) => (
                                        <Box key={index}>
                                        <a href={file} download><Avatar src={file} sx={{height: '20px', width: '20px'}}>File</Avatar></a>
                                        </Box>
                                     ))}
                                </Stack>
                            </StyledStack>
                        </Grid>
                    ))}
                </Grid>

                <Grid item direction='column' container sx={{mt:1, ml:6, maxWidth:{xs: '100%', sm:'40%'}}}>
                    <Select
                        name='sppRemarks'
                        imputProps={{'aria-label': 'Without label'}}
                        onChange={onChange}
                        sx={{mb:1}}
                        displayEmpty
                        required
                        variant='standard'
                    >
                        <MenuItem disabled><Typography variant='body2' color='textSecondary'>Remarks...</Typography></MenuItem>
                        <MenuItem value='for compliance'><Typography variant='body2' color='textSecondary'>For Compliance</Typography></MenuItem>
                        <MenuItem value='spp done'><Typography variant='body2' color='textSecondary'>Spp Done</Typography></MenuItem>
                    </Select>
                    
                    {data.sppRemarks === 'spp done' && (
                        <TextField
                            type='text'
                            name='accountNumber'
                            onChange={onChange}
                            label='Account Number'
                            InputLabelProps={{shrink: true}}
                            placeholder='Account Number'
                            required
                            variant='standard'
                            sx={{mb:1}}
                        />
                    )}

                    <TextareaAutosize 
                        name='msg'
                        onChange={onChange}
                        label='Message'
                        InputLabelProps={{shrink: true}}
                        placeholder='Optional'
                        variant='standard'
                        minRows={5}
                        style={{marginBottom: '10px', width: '100%', padding: '5px'}}
                    />

                    <Button
                        onClick={handleSubmit}
                        variant='contained'
                        sx={{borderRadius: 0}}
                    >
                        Submit
                    </Button>
                </Grid>

            </StyledContainer>
        </Grow>
    )
}

export default Details
