import { Avatar, Container, Divider, Modal, Paper, TextField, Typography } from '@material-ui/core';
import React from 'react';
import useStyles from './style';
import FormatAlignJustifyIcon from '@material-ui/icons/FormatAlignJustify';

const AddSubsModal = ({openModal, handleCloseModal}) => {

    const classes = useStyles();

    return(
        <div>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="Subscribers Info"
                aria-describedby="Subscribers Info"
            >
               <Container component='main' maxWidth='xs'>
                    <Paper className={classes.paper} elevation={6}>
                        <Avatar>
                            <FormatAlignJustifyIcon color='secondary' />
                        </Avatar>
                        <Typography variant='h6'>Subscribers Form</Typography>

                        <Divider className={classes.divider} />

                        <TextField 
                            type='text'
                            name='lastname'
                            label='Last Name'
                            placeholder='Last Name'
                            fullWidth
                        />

                    </Paper>
               </Container>
            </Modal>
        </div>
    )
}

export default AddSubsModal;