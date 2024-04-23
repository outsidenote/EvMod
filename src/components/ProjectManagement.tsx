import * as React from 'react'
import IconButton from '@mui/material/Button';
import { Context } from './MainLayout'
import { EvModElementTypeEnum } from '../types/element.types';
import { IElementsStoreRecord } from '../store/ElementsStore';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SliceMangement from './SliceManagement';
import SelectAllIcon from '@mui/icons-material/SelectAll';

const statusColors = {
    DID_NOT_START: "#E6E6E6",
    IN_PROGRESS: "#FCC266",
    DONE: "#8FD14F",
    BLOCKED: "#FF0226"
}

export default function ProjectManagement() {
    const [store] = React.useContext(Context);
    const [commandHandlers, setCommandHandlers] = React.useState<IElementsStoreRecord[]>([]);
    const [projectors, setProjectors] = React.useState<IElementsStoreRecord[]>([]);
    const [events, setEvents] = React.useState<IElementsStoreRecord[]>([]);
    const [screens, setScreens] = React.useState<IElementsStoreRecord[]>([]);
    const [processors, setProcessors] = React.useState<IElementsStoreRecord[]>([]);

    React.useEffect(() => {
        setCommandHandlers(store.list(EvModElementTypeEnum.CommandHandler));
        setProjectors(store.list(EvModElementTypeEnum.Projector));
        setEvents(store.list(EvModElementTypeEnum.Event).filter((el) => !el.originalMiroElementId));
        setScreens(store.list(EvModElementTypeEnum.Screen).filter((el) => !el.originalMiroElementId));
        setProcessors(store.list(EvModElementTypeEnum.Processor).filter((el) => !el.originalMiroElementId));
    }, []);

    const handleLocate = async (id: string) => {
        await miro.board.deselect();
        await miro.board.select({ id });
        const item = await miro.board.getSelection();
        await miro.board.viewport.zoomTo(item);
        await miro.board.viewport.setZoom(1);
    };

    const displaySlices = (records: IElementsStoreRecord[]) => (
        records.map(record =>
            <Accordion key={record.miroElementId}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`commandHandler-${record.miroElementId}-content`}
                    id={`commandHandler-${record.miroElementId}-header`}
                    sx={{ bgcolor: Object.values(statusColors)[Math.floor(Math.random() * Object.keys(statusColors).length)] }}
                >
                    <IconButton size='small' onClick={(e) => { e.stopPropagation(); handleLocate(record.miroElementId); }}>
                        <SelectAllIcon />
                    </IconButton>
                    {record.elementName}
                </AccordionSummary>
                <AccordionDetails>
                    <SliceMangement />
                </AccordionDetails>
            </Accordion>
        )
    );

    return (
        <div>
            <h2>Projet Management</h2>
            <h3>Events Definitions</h3>
            {displaySlices(events)}
            <h3>Command Handlers</h3>
            {displaySlices(commandHandlers)}
            <h3>Projectors</h3>
            {displaySlices(projectors)}
            <h3>Screens</h3>
            {displaySlices(screens)}
            <h3>Processors</h3>
            {displaySlices(processors)}
        </div>
    )
}