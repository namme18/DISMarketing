import React from 'react';
import { Modal, Container, Paper, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTyp = styled(Typography)(({theme}) => ({
    cursor:'pointer',
    fontWeight: 600,
    ':hover': {
        color: theme.palette.error.dark,
        transform: 'scale(1.1)'
    }
}))

const AttachmentsModal = ({open, setOpen, img}) => {

    const handleCloseModal = (e, reason) => {
        if(reason === 'backdropClick'){
            return;
        }
        setOpen(false);
    }

    return(
        <Modal
            open={open}
            onClose={handleCloseModal}
            aria-labelledby='attachments file'
            aria-describedby='attachments file'
        >
            <Container maxWidth='md' component={Paper} sx={{mt: 5}}>
                <Grid container flexDirection='column' alignItems='center' justifyContent='center' style={{paddingBottom: '30px'}}>
                    <Grid item container justifyContent='flex-end' sx={{padding:'5px'}}>
                        <StyledTyp onClick={handleCloseModal} variant='body2' color='textSecondary'>Close</StyledTyp>
                    </Grid>
                    <Grid item container justifyContent='center' alightItems='center' sx={{height: '80vh', width: '90%'}}>
                        <img style={{height:'100%', width:'100%', objectFit: 'cover', borderRadius: '20px', border:'3px solid black'}} src={img} alt='attachments'/>
                    </Grid>
                </Grid>
            </Container>
        </Modal>
    )
}

export default AttachmentsModal;