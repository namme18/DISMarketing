import React from 'react'
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledGrid = styled(Grid)(({theme}) => ({
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: '10px',
    cursor: 'pointer',
    boxShadow: '2px 2px 2px 1px rgba(0, 0, 0, 0.3)',
    borderTop: '1px solid rgba(0,0,0,0.2)',
    '&:hover':{
        boxShadow: '2px 2px 2px 1px rgba(0, 0, 0, 0.5)'
    }
}))

const List = () => {
    return (
        <StyledGrid container justifyContent='space-between' alignItems='center'>
            <Grid item>
                first item              
            </Grid>
            <Grid item>
                second item
            </Grid>
        </StyledGrid>
    )
}

export default List
