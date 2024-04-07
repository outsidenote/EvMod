import * as React from 'react';
import { useState, useEffect } from "react";
import CommandHandlerData from './CommandHandlerData';
import ElementJsonData from './ElementJsonData';

interface ISelectionHandlerInput {
    items: Array<any>
}

export default function ViewElement() {
    let [selectedElement, setSelectedElement]: any = useState();
    let [errMsg, setErrMsg] = useState('');

    const setSelection = async (items: Array<any>) => {
        const element = items[0]
        console.log('selected element:', element)
        setSelectedElement(element);
    }

    const clearSelection = () => {
        setErrMsg('');
        setSelectedElement();
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

    const isConnector = (): boolean => selectedElement?.type === "connector";

    useEffect(() => {
        miro.board.ui.on('selection:update', selectionHandler).then(l => console.log('listener added'));

        miro.board.getSelection().then((items: Array<any>) => {
            selectionHandler({ items })
        })

        return () => {
            miro.board.ui.off('selection:update', selectionHandler).then(l => console.log('listener removed'));
        }
    }, []);


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