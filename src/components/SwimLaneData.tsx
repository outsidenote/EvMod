import * as React from 'react'
import { Context } from './MainLayout';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import type { Frame } from '@mirohq/websdk-types';


interface ISwimLaneEvent {
    id: string,
    eventName: string
}

export default function SwimLaneData({ selectedElement }: { selectedElement: Frame | undefined }) {
    if (!selectedElement) return;
    const [_, __, eventsIdsCatalog] = React.useContext(Context);
    const [events, setEvents] = React.useState<Array<ISwimLaneEvent>>([]);

    React.useEffect(() => {
        const swimlaneEvents: Array<ISwimLaneEvent> = [];
        selectedElement.childrenIds.forEach(id => {
            const eventName = eventsIdsCatalog.get(id);
            if (!eventName) return;

            swimlaneEvents.push({ eventName, id })
        });
        setEvents(swimlaneEvents)
    }, []);

    const evtComponents = events.map(({ id, eventName }) => (
        (
            <ListItemButton key={id}>
                <ListItemText
                    primary={`Event: ${eventName}`}
                    secondary={`ID: ${id}`}
                />
            </ListItemButton>)))

    return (
        <div>
            <h2>Swim Lane Events</h2>
            <List dense>
                {evtComponents}
            </List>
        </div>

    )

}