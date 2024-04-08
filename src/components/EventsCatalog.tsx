import * as React from 'react';
import { Context } from './MainLayout';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import ElementJsonData from './ElementJsonData';
import { type Shape } from '@mirohq/websdk-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { EvModElementTypeEnum } from '../types/element.types';
import { IElementsStoreRecord } from '../store/ElementsStore';
import { EvModeElementStoreEvent } from '../types/appStore.types';

export default function EventsCatalog() {
    const [open, setOpen] = React.useState(false);
    const [store] = React.useContext(Context)
    const [search, setSearch] = React.useState('');
    const [selectedEvent, setSelectedEvent] = React.useState<Shape>();
    const [selectedElement, setSelectedElement] = React.useState<IElementsStoreRecord>();
    const [storedEvents, setStoredEvents] = React.useState(store.list(EvModElementTypeEnum.Event))


    const syncStoredEvents = () => {
        const storedEvents = store.list(EvModElementTypeEnum.Event);
        setStoredEvents([...(storedEvents || [])]);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleEventSelection = async (element: IElementsStoreRecord) => {
        const el = await miro.board.getById(element.miroElementId);
        if (el.type !== 'shape')
            return;

        setSelectedEvent(el as Shape);
        setSelectedElement(element);
        setOpen(true);
    }

    const showingEvents = React.useMemo(() => {
        if (!search)
            return storedEvents || [];
        return search && storedEvents ?
            storedEvents.filter(({ elementName }) => elementName.includes(search))
            : []
    }, [storedEvents, search]);

    const eventsComponenets = React.useMemo(() => showingEvents.map((el) => {
        return (
            <ListItemButton key={el.miroElementId + showingEvents.length} onClick={() => handleEventSelection(el)}>
                <ListItemText
                    primary={`Event: ${el.elementName}`}
                    secondary={`ID: ${el.miroElementId}`}
                />
            </ListItemButton>)
    }), [showingEvents])


    React.useEffect(() => {
        const handleChange = (event: EvModeElementStoreEvent) => {
            console.log('EventsCatalog: store change. Checking... ')
            if (event.elementType !== EvModElementTypeEnum.Event)
                return;
            console.log('EventsCatalog: events changed, syncing... ')
            syncStoredEvents();
        }
        console.log('EventsCatalog: adding store listener')
        store.onChange.on(handleChange)
        syncStoredEvents();
        return () => {
            console.log('EventsCatalog: removing store listener')
            store.onChange.off(handleChange);
        }
    }, []);



    return (
        <div>
            <h2>Events Catalog</h2>
            <TextField
                id="search-event"
                label={"Search"}
                value={search}
                placeholder="Search Events..."
                style={{ width: '100%', marginBottom: '20px' }}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setSearch(event.target.value);
                }}
            />
            <List dense>
                {eventsComponenets}
            </List>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Card>
                    <CardContent>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            Showing Data of:
                        </Typography>
                        <Typography variant="h5" component="div">
                            Event: {selectedElement?.elementName}
                        </Typography>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            ID: {selectedElement?.miroElementId}
                        </Typography>
                        <ElementJsonData selectedElement={selectedEvent} />
                    </CardContent>
                </Card>
            </Modal>
        </div>
    )
}