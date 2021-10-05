import { styled } from '@mui/material/styles';
import { Paper, Avatar } from '@mui/material';

export const SearchPaper = styled(Paper)(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '2px 2px',
    with: '100%',
    borderRadius: 0,
    '& .divider':{
        height: '28px'
    },
    '& .inputBase': {
        fontSize: 'small'
    }
}));

export const CardAvatar = styled(Avatar, {
    shouldForwardProp: prop => prop !== "restrictionlevel"
})(({theme, restrictionlevel}) => ({
    background: (restrictionlevel === 'operation manager' || restrictionlevel === 'owner' ? theme.palette.primary.light : theme.palette.secondary.light),
    marginRight: '5px'
}))