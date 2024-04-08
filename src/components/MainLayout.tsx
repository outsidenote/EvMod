import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import NavBar from './NavBar';

import { Outlet } from "react-router-dom";
import type { Connector, ItemsCreateEvent, ItemsDeleteEvent } from '@mirohq/websdk-types';
import InMemoryStore from '../store/InMemoryStore';
import { EvModElementTypeEnum, IElementMetadata, MiroElementType } from '../types/element.types';
import { ELEMENT_METADATA_KEY } from '../consts';

type ContextType = [
    InMemoryStore
];
const defaultContext: ContextType = [new InMemoryStore()];
export const Context = React.createContext<ContextType>(defaultContext);

export default function MainLayout() {
    const store = new InMemoryStore();

    React.useEffect(() => {
        // Promise.all([
        //     miro.board.setAppData(EVENTS_CATALOG_KEY, undefined),
        //     miro.board.setAppData(EVENT_IDS_CATALOG_KEY, undefined)
        // ]);

        store.sync();

        miro.board.ui.on('items:delete', handleItemDeleted);
        miro.board.ui.on('items:create', handleItemCreated);
    }, []);

    const handleItemDeleted = async (event: ItemsDeleteEvent) => {
        console.log('MainLayout: DeletedItems:', event.items)
        event.items.forEach(async ({ id }) => {
            const elementTypes = Object.keys(EvModElementTypeEnum);
            let elementType: EvModElementTypeEnum | undefined;

            for (let i = 0; i < elementTypes.length; i++) {
                const elementName = store.getElementName(elementTypes[i] as EvModElementTypeEnum, id);
                if (!!elementName) {
                    elementType = elementTypes[i] as EvModElementTypeEnum;
                    break;
                }
            }
            if (!elementType) return;

            await store.delete(elementType, id);
        })
    }

    const handleItemCreated = async (event: ItemsCreateEvent) => {
        const handleAddedConnectors = async (items: MiroElementType[]) => {
            event.items.filter(item => item.type === 'connector')
                .forEach(async (connector) => {
                    const conn = connector as Connector;
                    const { start, end } = conn

                    if (!start || !end) return;
                    const startId = start.item;
                    const endId = end.item;
                    if (!startId || !endId) return;

                    const startCommand = store.getElementName(EvModElementTypeEnum.Command, startId);
                    const endEvent = store.getElementName(EvModElementTypeEnum.Event, endId);
                    const startEvent = store.getElementName(EvModElementTypeEnum.Event, startId);
                    const endReadModel = store.getElementName(EvModElementTypeEnum.ReadModel, endId);

                    console.log('MainLayout: handleAddedConnectors:', { startCommand, endEvent, startEvent, endReadModel })

                    const connectorType: EvModElementTypeEnum | undefined = (startCommand && endEvent) ?
                        EvModElementTypeEnum.CommandHandler :
                        (
                            startEvent && endReadModel ? EvModElementTypeEnum.Projector :
                                undefined
                        )
                    if (!connectorType) return;

                    const connectorName = `${startCommand || startEvent} -> ${endEvent || endReadModel}`;

                    await store.addElement(connectorType, conn.id, connectorName);
                    console.log('MainLayout: Added: connector:', connectorType, conn.id, connectorName);
                    console.log('MainLayout: connectors list:', store.list(connectorType));
                    const metadata: IElementMetadata = {
                        elementName: connectorName,
                        elementType: connectorType
                    };
                    conn.setMetadata(ELEMENT_METADATA_KEY, JSON.stringify(metadata));
                })
        }

        await handleAddedConnectors(event.items);

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
        <Context.Provider value={[store]}>
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