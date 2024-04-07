import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import NavBar from './NavBar';
import * as Immutable from 'immutable';

import { Outlet } from "react-router-dom";
import { EventsCatalogType, IEventsCatalogItem } from '../types/appStore.type';
import { ElementTypeEnum } from '../types/element.types';
import { EVENTS_CATALOG_KEY } from '../consts';
import { Store } from '@mui/icons-material';

type ContextType = [EventsCatalogType | undefined, React.Dispatch<React.SetStateAction<EventsCatalogType>> | undefined]
const defaultContext: ContextType = [undefined, undefined];
export const Context = React.createContext<ContextType>(defaultContext);

export default function MainLayout() {
    const [eventsCatalog, setEventsCatalog] = useState<EventsCatalogType>(Immutable.Map());
    React.useEffect(() => {
        miro.board.getAppData(EVENTS_CATALOG_KEY)
            .then(catalogObj => {
                const catalogMap: EventsCatalogType = catalogObj ? Immutable.Map<string, IEventsCatalogItem>(catalogObj) : Immutable.Map<string, IEventsCatalogItem>();
                return catalogMap;
            })
            .then((catalogMap) => { setEventsCatalog(catalogMap) });
    }, []);

    const drawerWidth: number = 240;


    const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
        ({ theme, open }) => ({
            '& .MuiDrawer-paper': {
                position: 'relative',
                whiteSpace: 'nowrap',
                width: drawerWidth,
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
                boxSizing: 'border-box',
                ...(!open && {
                    overflowX: 'hidden',
                    transition: theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                    width: theme.spacing(7),
                    [theme.breakpoints.up('sm')]: {
                        width: theme.spacing(9),
                    },
                }),
            },
        }),
    );

    const [open, setOpen] = React.useState(false);



    return (
        <Context.Provider value={[eventsCatalog, setEventsCatalog]}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Drawer variant="permanent" open={open}>
                    <NavBar />
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                        <Outlet />
                    </Container>
                </Box>
            </Box>
        </Context.Provider>
    );
};