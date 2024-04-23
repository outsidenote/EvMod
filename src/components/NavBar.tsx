import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Tooltip from '@mui/material/Tooltip';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import HomeIcon from '@mui/icons-material/Home';
import List from '@mui/material/List';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

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
            <Link to="/view-element">
                <Tooltip title="View Element" placement="right">
                    <ListItemButton selected={pathname == '/view-element'}>
                        <ListItemIcon>
                            <ManageSearchIcon />
                        </ListItemIcon>
                    </ListItemButton>
                </Tooltip>
            </Link>
            <Link to="/add-element">
                <Tooltip title="Add Element" placement="right">
                    <ListItemButton selected={pathname == '/add-element'}>
                        <ListItemIcon>
                            <PlaylistAddIcon />
                        </ListItemIcon>
                    </ListItemButton>
                </Tooltip>
            </Link>
            <Link to="/events-catalog">
                <Tooltip title="Events Catalog" placement="right">
                    <ListItemButton selected={pathname == '/events-catalog'}>
                        <ListItemIcon>
                            <ListAltIcon />
                        </ListItemIcon>
                    </ListItemButton>
                </Tooltip>
            </Link>
            <Link to="/project-management">
                <Tooltip title="Project Management" placement="right">
                    <ListItemButton selected={pathname == '/project-management'}>
                        <ListItemIcon>
                            <AssignmentTurnedInIcon />
                        </ListItemIcon>
                    </ListItemButton>
                </Tooltip>
            </Link>
        </List>
    )
};