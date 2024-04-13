import * as React from 'react'
import { Context } from './MainLayout';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import type { Shape } from '@mirohq/websdk-types';
import { EvModElementTypeEnum } from '../types/element.types';
import { IElementsStoreRecord } from '../store/ElementsStore';
import { eventNames } from 'process';



export default function ReadModelData({ selectedElement }: { selectedElement: Shape | undefined }) {
    if (!selectedElement) return;
    const [store] = React.useContext(Context);
    const [events, setEvents] = React.useState<IElementsStoreRecord[]>([]);

    React.useEffect(() => {
        setEvents([]);
        const readModelName = store.getElementName(EvModElementTypeEnum.ReadModel, selectedElement.id)
        if (!readModelName) return;
        const readModelEvents: IElementsStoreRecord[] = store.list(EvModElementTypeEnum.Projector)
            .filter(({ elementName }) => elementName.endsWith(`-> ${readModelName}`))
            .map(projector => {
                const elementName = projector.elementName.split(' -> ')[0]
                console.log('ReadModelData: projector eventName:', elementName);
                if (!elementName) throw new Error('Event of Projector not found: ' + projector.elementName);
                const miroElementId = store.getMiroElementId(EvModElementTypeEnum.Event, elementName);
                if (!miroElementId) throw new Error('Event id not found for Projector: ' + projector.elementName);
                return { miroElementId, elementName }
            });
        setEvents(readModelEvents)
    }, []);

    const evtComponents = events.map(({ miroElementId, elementName }) => (
        (
            <ListItemButton key={miroElementId}>
                <ListItemText
                    primary={`Event: ${elementName}`}
                    secondary={`ID: ${miroElementId}`}
                />
            </ListItemButton>)))

    return (
        <div>
            <h2>Read Model Events</h2>
            <List dense>
                {evtComponents}
            </List>
        </div>

    )

}