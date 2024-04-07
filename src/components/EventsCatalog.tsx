import * as React from 'react';
import { Context } from './MainLayout';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';




export default function EventsCatalog() {
    const [eventsCatalog, setEventsCatalog] = React.useContext(Context)
    const [showingEvents, setShowingEvents] = React.useState(eventsCatalog?.toArray() || []);
    const [search, setSearch] = React.useState('');


    if (!eventsCatalog)
        return;

    const eventsComponents = showingEvents.map(([eventName, catalogItem]) => (
        <ListItem key={eventName}>
            <ListItemText
                primary={`Event: ${eventName}`}
                secondary={`ID: ${catalogItem.elementId}`}
            />
        </ListItem>
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
        </div>
    )
}