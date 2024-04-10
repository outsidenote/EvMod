import * as React from 'react';
import { useState } from "react";
import CommandHandlerData from './CommandHandlerData';
import ElementJsonData from './ElementJsonData';
import Button from '@mui/material/Button';
import { EvModElementTypeEnum, IElementMetadata, MiroElementType } from '../types/element.types';
import { ELEMENT_METADATA_KEY } from '../consts';
import type { Connector, Card, AppCard, Tag, Embed, Image, Preview, Shape, StickyNote, Text, Frame, Group, Unsupported } from "@mirohq/websdk-types";
import SwimLaneData from './SwimLaneData';
import ReadModelData from './ReadModelData';

const miroItemTypesWithMetadata = ['shape', 'connector', 'image'];

interface ISelectionHandlerInput {
    items: MiroElementType[]
}

const getMetadata = async (element: Shape | Frame | Image) => {
    const metadataJson = await (element as Shape | Frame | Image).getMetadata(ELEMENT_METADATA_KEY);
    if (!metadataJson) return;
    return JSON.parse(metadataJson.toString()) as unknown as IElementMetadata;
}

export default function ViewElement() {
    let [selectedElement, setSelectedElement] = useState<MiroElementType | undefined>();
    let [selecting, setSelecting]: any = useState(false);
    let [errMsg, setErrMsg] = useState('');
    const [elMetadata, setElMetadata] = useState<IElementMetadata>();

    const setSelection = async (items: MiroElementType[]) => {
        const element = items[0]
        console.log('ViewElement: selected element:', element)
        setSelectedElement(element);

        const metadata = miroItemTypesWithMetadata.includes(element.type) ?
            await getMetadata(element as Shape | Frame | Image) : undefined;

        console.log('ViewElement: metadata:', metadata)
        setElMetadata(metadata as unknown as IElementMetadata | undefined);
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
        setSelection(selectedItems);

    }

    const handleView = async () => {
        setSelecting(true);
        const items: MiroElementType[] = await miro.board.getSelection()
        await selectionHandler({ items });
        setSelecting(false);
    }

    const getElementDetailsCompoennt = () => {
        if (errMsg) return;

        console.log('getElementDetailsCompoennt: elMetadata?.elementType:', elMetadata?.elementType);
        console.log('getElementDetailsCompoennt: selectedElement?.type:', selectedElement?.type);

        switch (elMetadata?.elementType) {
            case EvModElementTypeEnum.ReadModel:
                return <ReadModelData selectedElement={selectedElement as Shape} />

            case EvModElementTypeEnum.Event:
            case EvModElementTypeEnum.Command:
                return <ElementJsonData selectedElement={selectedElement} />
            case EvModElementTypeEnum.CommandHandler:
                return <CommandHandlerData />
            default:
                if (selectedElement?.type === 'frame')
                    return <SwimLaneData selectedElement={selectedElement as Frame} />
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