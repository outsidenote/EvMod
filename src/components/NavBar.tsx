import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Tooltip from '@mui/material/Tooltip';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import HomeIcon from '@mui/icons-material/Home';
import List from '@mui/material/List';

import { Link, useLocation } from 'react-router-dom'

export default function NavBar() {
    const { pathname } = useLocation();
    return (
        <List component="nav">
            <Link to="/">
                <Tooltip title="Home Page" placement="right">
                    <ListItemButton selected={pathname == '/'}>
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                    </ListItemButton>
                </Tooltip>
            </Link>
            <Link to="/element-details">
                <Tooltip title="Element Details" placement="right">
                    <ListItemButton selected={pathname == '/element-details'}>
                        <ListItemIcon>
                            <ManageSearchIcon />
                        </ListItemIcon>
                    </ListItemButton>
                </Tooltip>
            </Link>
            <ListItemButton>
                <ListItemIcon>
                    <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Orders" />
            </ListItemButton>
            <ListItemButton>
                <ListItemIcon>
                    <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Customers" />
            </ListItemButton>
            <ListItemButton>
                <ListItemIcon>
                    <BarChartIcon />
                </ListItemIcon>
                <ListItemText primary="Reports" />
            </ListItemButton>
            <ListItemButton>
                <ListItemIcon>
                    <LayersIcon />
                </ListItemIcon>
                <ListItemText primary="Integrations" />
            </ListItemButton>
        </List>
    )
};