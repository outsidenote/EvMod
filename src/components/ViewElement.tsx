import * as React from 'react';
import JSONInput from 'react-json-editor-ajrm/es';
import locale from 'react-json-editor-ajrm/locale/en';
import { useState, useEffect } from "react";


export default function ViewElement() {
    let [jsonData, setJsonData] = useState({});
    let [selectedElement, setSelectedElement]: any = useState();
    let [errMsg, setErrMsg] = useState('');
    let [listenerAdded, setListenerAdded] = useState(false);

    const setSelection = async (items: Array<any>) => {
        const element = items[0]
        console.log('selected element:', element)
        setSelectedElement(element);
        setJsonData(await element.getMetadata('jsonData'))
    }

    const clearSelection = () => {
        setErrMsg('');
        setJsonData({});
        setSelectedElement();
    }

    const selectionHandler = async (event: any) => {
        clearSelection();

        const selectedItems = event.items;
        if (event.items.length != 1) {
            setErrMsg('Please select a single element');
            setJsonData({});
            return;
        }

        // Filter sticky notes from the selected items
        setSelection(selectedItems);

    }
    if (!listenerAdded) {
        miro.board.ui.on('selection:update', selectionHandler).then(l => console.log('listener:', l));
        setListenerAdded(true);
    }
    return (
        <div>
            <h1>View Element</h1>
            <p>Select an emelemnt in the board to see its data</p>
            <p style={{ color: "var(--red800)" }}><small>{errMsg}</small></p>
            {
                !errMsg && (<div className="cs1 ce12">
                    <JSONInput
                        id='a_unique_id'
                        placeholder={jsonData}
                        locale={locale}
                        width='100%'
                        height='300px'
                        onChange={async (e: any) => {
                            console.log('json data has change - going to save:', e.jsObject, 'selected el:', selectedElement);
                            await selectedElement.setMetadata('jsonData', e.jsObject);
                        }}
                    />
                </div>)

            }

            <div className="cs1 ce12">
                <a
                    className="button button-primary"
                    target="_blank"
                    href="https://developers.miro.com"
                >
                    Read the documentation
                </a>
            </div>
        </div>
    )

}