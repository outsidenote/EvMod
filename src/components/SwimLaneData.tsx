import * as React from 'react'
import { Context } from './MainLayout';
import type { Frame } from '@mirohq/websdk-types';
import { EvModElementTypeEnum } from '../types/element.types';
import EventsList from './EventsList';
import { IElementsStoreRecord } from '../store/ElementsStore';

export default function SwimLaneData({ selectedElement }: { selectedElement: Frame | undefined }) {
    if (!selectedElement) return;
    const [store] = React.useContext(Context);
    const [events, setEvents] = React.useState<Array<IElementsStoreRecord>>([]);

    React.useEffect(() => {
        const swimlaneEvents: Array<IElementsStoreRecord> = [];
        selectedElement.childrenIds.forEach(miroElementId => {
            const record = store.getById(EvModElementTypeEnum.Event, miroElementId);
            if (!record) return;
            swimlaneEvents.push(record)
        });
        setEvents(swimlaneEvents)
    }, []);

    return (
        <div>
            <h2>Swim Lane Events</h2>
            <EventsList eventRecords={events} />
        </div>

    )

}