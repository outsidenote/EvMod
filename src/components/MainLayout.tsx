import * as React from 'react';
import { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import NavBar from './NavBar';
import * as Immutable from 'immutable';

import { Outlet } from "react-router-dom";
import { EventsCatalogType, IEventsCatalogItem } from '../types/appStore.type';
import { EVENTS_CATALOG_KEY, EVENT_IDS_CATALOG_KEY } from '../consts';
import type { ItemsDeleteEvent, Shape } from '@mirohq/websdk-types';

type ContextType = [
    EventsCatalogType | undefined,
    Function | undefined,
    Immutable.Map<string, string>,
    Function | undefined
];
const defaultContext: ContextType = [undefined, undefined, Immutable.Map<string, string>(), undefined];
export const Context = React.createContext<ContextType>(defaultContext);

export default function MainLayout() {
    const [eventsCatalog, _setEventsCatalog] = useState<EventsCatalogType>(Immutable.Map());
    const [eventsIdsCatalog, _setEventsIdsCatalog] = useState<Immutable.Map<string, string>>(Immutable.Map())

    const eventsIdsCatalogRef = React.useRef(eventsIdsCatalog);
    const setEventsIdsCatalog = (data: Immutable.Map<string, string>) => {
        eventsIdsCatalogRef.current = data;
        _setEventsIdsCatalog(data);
    };
    const eventsCatalogRef = React.useRef(eventsCatalog);
    const setEventsCatalog = (data: EventsCatalogType) => {
        eventsCatalogRef.current = data;
        _setEventsCatalog(data);
    };

    React.useEffect(() => {
        // Promise.all([
        //     miro.board.setAppData(EVENTS_CATALOG_KEY, undefined),
        //     miro.board.setAppData(EVENT_IDS_CATALOG_KEY, undefined)
        // ]);
        miro.board.getAppData(EVENTS_CATALOG_KEY)
            .then(catalogObj => {
                const catalogMap: EventsCatalogType = catalogObj ? Immutable.Map<string, IEventsCatalogItem>(catalogObj) : Immutable.Map<string, IEventsCatalogItem>();
                return catalogMap;
            })
            .then((catalogMap) => { setEventsCatalog(catalogMap) });
        miro.board.getAppData(EVENT_IDS_CATALOG_KEY)
            .then(idsObj => {
                const idsMap: Immutable.Map<string, string> = idsObj ? Immutable.Map<string, string>(idsObj) : Immutable.Map<string, string>();
                return idsMap;
            })
            .then((idsMap) => {
                setEventsIdsCatalog(idsMap);
                console.log('MainLayout: Ids catalog:', idsMap);
            });

        console.log('MainLaout: EventsIdsCatalog:', eventsIdsCatalog);

        miro.board.ui.on('items:delete', handleItemDeleted);
    }, []);

    const handleItemDeleted = async (event: ItemsDeleteEvent) => {
        console.log('MainLayout: DeletedItems:', event.items)
        console.log('MainLayout: will check whether to delete from:', eventsIdsCatalogRef.current)
        let updatedCatalog = eventsCatalogRef.current;
        let updatedIds = eventsIdsCatalogRef.current;
        let numDeletes = 0
        event.items.forEach(async ({ id }) => {
            const eventName = updatedIds.get(id)
            if (!eventName)
                return
            updatedCatalog = updatedCatalog.remove(eventName);
            updatedIds = updatedIds.remove(id);
            numDeletes++;
        })
        if (numDeletes > 0) {
            setEventsCatalog(updatedCatalog);
            setEventsIdsCatalog(updatedIds);
            await Promise.all([
                miro.board.setAppData(EVENTS_CATALOG_KEY, updatedCatalog.toObject()),
                miro.board.setAppData(EVENT_IDS_CATALOG_KEY, updatedIds.toObject())
            ]);
        }
    }

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
        <Context.Provider value={[eventsCatalog, setEventsCatalog, eventsIdsCatalog, setEventsIdsCatalog]}>
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