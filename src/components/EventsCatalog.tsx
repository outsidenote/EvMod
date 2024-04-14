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
import { EvModElementTypeEnum, IElementData } from '../types/element.types';
import { IElementsStoreRecord } from '../store/ElementsStore';
import { EvModeElementStoreEvent } from '../types/appStore.types';
import { ELEMENT_DATA_KEY } from '../consts';
import EventsList from './EventsList';

export default function EventsCatalog() {
    const [store] = React.useContext(Context)
    const [search, setSearch] = React.useState('');
    const [storedEvents, setStoredEvents] = React.useState(store.list(EvModElementTypeEnum.Event))


    const syncStoredEvents = () => {
        const storedEvents = store.list(EvModElementTypeEnum.Event).filter((el) => !el.originalMiroElementId);
        setStoredEvents([...(storedEvents || [])]);
    }

    const showingEvents = React.useMemo(() => {
        if (!search)
            return storedEvents || [];
        return search && storedEvents ?
            storedEvents.filter(({ elementName }) => elementName.includes(search))
            : []
    }, [storedEvents, search]);

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
            <EventsList eventRecords={showingEvents} />
        </div>
    )
}