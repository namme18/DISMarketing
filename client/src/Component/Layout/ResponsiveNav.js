import React from 'react';
import ResponsiveDrawer from './ResponsiveDrawer';
import { useTheme } from '@material-ui/core/styles';
import useStyles from './style';
import {
    Hidden,
    Drawer
} from '@material-ui/core';

const ResponsiveNav = ({ props, handleDrawerToggle, onClickDislogo, mobileOpen }) => {
    
    const theme = useTheme();
    const window = props;
    const classes = useStyles();

    const container = window !== undefined ? () => window().document.body : undefined;

    return(
        <>
            <nav className={classes.drawer} aria-label='mailbox folders'>
                <Hidden mdUp implementation='css'>
                    <Drawer
                        container={container}
                        variant='temporary'
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{paper: classes.drawerPaper}}
                        ModalProps={{keepMounted:true}}
                    >
                        <ResponsiveDrawer handleDrawerToggle={handleDrawerToggle} onClickDislogo={onClickDislogo} mobileOpen={mobileOpen} />
                    </Drawer>
                </Hidden>
                <Hidden mdDown implementation='css'>
                    <Drawer
                        classes={{paper: classes.drawerPaper}}
                        variant='permanent'
                        open
                    >
                       <ResponsiveDrawer handleDrawerToggle={handleDrawerToggle} onClickDislogo={onClickDislogo} mobileOpen={mobileOpen} />
                    </Drawer>
                </Hidden>
            </nav>
        </>
    )
}

export default ResponsiveNav;