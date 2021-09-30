import { Typography } from "@mui/material"
import { styled } from '@mui/material/styles'

export const PointersTypography = styled(Typography)(({theme}) => ({
    fontWeight: 'bold',
    backgroundColor: theme.palette.success.light,
    color: theme.palette.getContrastText(theme.palette.success.main),
    padding: theme.spacing(.5, .5),
    borderRadius: '50%',
    flexGrow: 1,
    display: 'inline',
    whiteSpace: 'nowrap',
    width: '20px'
}))

export const ValuesTypography = styled(Typography)(({theme}) => ({
    textTransform: 'capitalize',
    fontWeight: 'bold'
}))
