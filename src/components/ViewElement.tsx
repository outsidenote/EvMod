import * as React from 'react';
import { useState, useEffect } from "react";
import CommandHandlerData from './CommandHandlerData';
import ElementJsonData from './ElementJsonData';
import Button from '@mui/material/Button';
import { IElementMetadata } from '../types/element.types';
import { ELEMENT_METADTA_KEY } from '../consts';


interface ISelectionHandlerInput {
    items: Array<any>
}

export default function ViewElement() {
    let [selectedElement, setSelectedElement]: any = useState();
    let [selecting, setSelecting]: any = useState(false);
    let [errMsg, setErrMsg] = useState('');
    const [elMetadata, setElMetadata] = useState<IElementMetadata>();

    const setSelection = async (items: Array<any>) => {
        const element = items[0]
        console.log('ViewElement: selected element:', element)
        setSelectedElement(element);
        setElMetadata(await element.getMetadata(ELEMENT_METADTA_KEY) || undefined);
    }

    const clearSelection = () => {
        setErrMsg('');
        setSelectedElement();
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
        const items = await miro.board.getSelection()
        await selectionHandler({ items });
        setSelecting(false);
    }

    const isConnector = (): boolean => selectedElement?.type === "connector";

    useEffect(() => {
        // miro.board.ui.on('selection:update', selectionHandler).then(l => console.log('listener added'));

        // miro.board.getSelection().then((items: Array<any>) => {
        //     selectionHandler({ items })
        // })

        // return () => {
        //     miro.board.ui.off('selection:update', selectionHandler).then(l => console.log('listener removed'));
        // }
    }, []);


    return (
        <div>
            <h1>View Element</h1>
            <p>Select an emelemnt in the board to see its data and click the 'View Element' button</p>
            <p style={{ color: "var(--red800)" }}><small>{errMsg}</small></p>
            <Button variant="outlined" color="info" onClick={handleView} disabled={selecting}>View Element</Button>
            {!!elMetadata && <h4><b>{elMetadata.elementType}:</b> {elMetadata.elementName}</h4>}
            {
                !errMsg && !isConnector() && <ElementJsonData selectedElement={selectedElement} />
            }

            {
                !errMsg && isConnector() && <CommandHandlerData />
            }

        </div>
    )

}