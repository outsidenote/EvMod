import * as React from 'react';
import { Context } from './MainLayout';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import { IEventsCatalogItem } from '../types/appStore.type';
import Modal from '@mui/material/Modal';
import ElementJsonData from './ElementJsonData';
import { type Shape } from '@mirohq/websdk-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';








export default function EventsCatalog() {
    const [open, setOpen] = React.useState(false);
    const [eventsCatalog, setEventsCatalog] = React.useContext(Context)
    const [showingEvents, setShowingEvents] = React.useState(eventsCatalog?.toArray() || []);
    const [search, setSearch] = React.useState('');
    const [selectedEvent, setSelectedEvent] = React.useState<Shape>();
    const [selectedEventItem, setSelectedEventItem] = React.useState<IEventsCatalogItem>();



    if (!eventsCatalog)
        return;

    const handleClose = () => {
        setOpen(false);
    }

    const handleEventSelection = async (catalogItem: IEventsCatalogItem) => {
        const el = await miro.board.getById(catalogItem.elementId);
        if (el.type !== 'shape')
            return;

        setSelectedEvent(el as Shape);
        setSelectedEventItem(catalogItem);
        setOpen(true);
    }

    const eventsComponents = showingEvents.map(([eventName, catalogItem]) => (
        <ListItemButton key={eventName} onClick={() => handleEventSelection(catalogItem)}>
            <ListItemText
                primary={`Event: ${eventName}`}
                secondary={`ID: ${catalogItem.elementId}`}
            />
        </ListItemButton>
    ));

    const handleSearch = () => {
        if (!search) {
            setShowingEvents(eventsCatalog.toArray());
            return;
        }
        setShowingEvents(eventsCatalog.toArray().filter(([eventName]) => eventName.includes(search)));
    }

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
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSearch()
                    }
                }}
            />
            <List dense>
                {eventsComponents}
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
                            Event: {selectedEventItem?.elementName}
                        </Typography>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            ID: {selectedEventItem?.elementId}
                        </Typography>
                        <ElementJsonData selectedElement={selectedEvent} />
                    </CardContent>
                </Card>
            </Modal>
        </div>
    )
}