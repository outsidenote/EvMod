import * as React from 'react';
import { useState, useEffect } from "react";
import CommandHandlerData from './CommandHandlerData';
import ElementJsonData from './ElementJsonData';
import Button from '@mui/material/Button';
import { EvModElementTypeEnum, IElementMetadata, MiroElementType } from '../types/element.types';
import { ELEMENT_METADATA_KEY } from '../consts';
import type { Connector, Card, AppCard, Tag, Embed, Image, Preview, Shape, StickyNote, Text, Frame, Group, Unsupported } from "@mirohq/websdk-types";
import SwimLaneData from './SwimLaneData';
import { Context } from './MainLayout';
import ReadModelData from './ReadModelData';


interface ISelectionHandlerInput {
    items: MiroElementType[]
}

export default function ViewElement() {
    let [selectedElement, setSelectedElement] = useState<MiroElementType | undefined>();
    let [selecting, setSelecting]: any = useState(false);
    let [errMsg, setErrMsg] = useState('');
    const [store] = React.useContext(Context);
    const [elMetadata, setElMetadata] = useState<IElementMetadata>();

    const setSelection = async (items: MiroElementType[]) => {
        const element = items[0]
        console.log('ViewElement: selected element:', element)
        setSelectedElement(element);

        if (!['shape', 'connector'].includes(element.type)) return;
        const metadata = await (element as Shape | Frame).getMetadata(ELEMENT_METADATA_KEY);

        console.log('ViewElement: metadata:', metadata)
        if (metadata) {
            setElMetadata(JSON.parse(metadata.toString()));
            return;
        }
        setElMetadata(metadata as unknown as IElementMetadata);
    }

    const clearSelection = () => {
        setErrMsg('');
        setSelectedElement(undefined);
        setElMetadata(undefined);
    }

    const selectionHandler = async (event: ISelectionHandlerInput) => {
        clearSelection();

        const selectedItems = event.items;
        if (event.items.length != 1) {
            setErrMsg('Please select a single element');
            return;
        }

        // Filter sticky notes from the selected items
        setSelection(selectedItems);

    }

    const handleView = async () => {
        setSelecting(true);
        const items: MiroElementType[] = await miro.board.getSelection()
        await selectionHandler({ items });
        setSelecting(false);
    }

    const getElementDetailsCompoennt = () => {
        if (errMsg || !elMetadata) return;

        switch (elMetadata.elementType) {
            case EvModElementTypeEnum.ReadModel:
                return <ReadModelData selectedElement={selectedElement as Shape} />

            case EvModElementTypeEnum.Event:
            case EvModElementTypeEnum.Command:
                return <ElementJsonData selectedElement={selectedElement} />
            case EvModElementTypeEnum.CommandHandler:
                return <CommandHandlerData />
            case EvModElementTypeEnum.Swimlane:
                return <SwimLaneData selectedElement={selectedElement as Frame} />
            default:
                return;
        }
    }

    return (
        <div>
            <h1>View Element</h1>
            <p>Select an emelemnt in the board to see its data and click the 'View Element' button</p>
            <p style={{ color: "var(--red800)" }}><small>{errMsg}</small></p>
            <Button variant="outlined" color="info" onClick={handleView} disabled={selecting}>View Element</Button>
            {!!elMetadata && <h4><b>{elMetadata.elementType}:</b> {elMetadata.elementName}</h4>}
            {getElementDetailsCompoennt()}

        </div>
    )

}