import * as React from 'react';
import { useState } from "react";
import CommandHandlerData from './CommandHandlerData';
import ElementJsonData from './ElementJsonData';


export default function ViewElement() {
    let [selectedElement, setSelectedElement]: any = useState();
    let [errMsg, setErrMsg] = useState('');
    let [listenerAdded, setListenerAdded] = useState(false);

    const setSelection = async (items: Array<any>) => {
        const element = items[0]
        console.log('selected element:', element)
        setSelectedElement(element);
    }

    const clearSelection = () => {
        setErrMsg('');
        setSelectedElement();
    }

    const selectionHandler = async (event: any) => {
        clearSelection();

        const selectedItems = event.items;
        if (event.items.length != 1) {
            setErrMsg('Please select a single element');
            return;
        }

        // Filter sticky notes from the selected items
        setSelection(selectedItems);

    }
    if (!listenerAdded) {
        miro.board.ui.on('selection:update', selectionHandler).then(l => console.log('listener:', l));
        setListenerAdded(true);
    }

    const isConnector = (): boolean => selectedElement?.type === "connector";
    return (
        <div>
            <h1>View Element</h1>
            <p>Select an emelemnt in the board to see its data</p>
            <p style={{ color: "var(--red800)" }}><small>{errMsg}</small></p>
            {
                !errMsg && !isConnector() && <ElementJsonData selectedElement={selectedElement} />
            }

            {
                !errMsg && isConnector() && <CommandHandlerData />
            }

        </div>
    )

}