import * as React from 'react';
import JSONInput from 'react-json-editor-ajrm/es';
import locale from 'react-json-editor-ajrm/locale/en';
import { useState } from "react";


export default function SelectionDetails() {
    let [jsonData, setJsonData] = useState({});
    let selectedElement: any;
    let [errMsg, setErrMsg] = useState('');

    miro.board.ui.on('selection:update', async (event) => {
        const selectedItems = event.items;
        if (event.items.length != 1) {
            setErrMsg('Please select a single element');
            setJsonData({});
            return;
        }
        setErrMsg('');
        setJsonData({});

        // Filter sticky notes from the selected items
        const element = selectedItems[0]
        setJsonData(await element.getMetadata('jsonData'))

    });

    return (
        <div>
            <h1>Element Details</h1>
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
                            console.log('json data has change - going to save:', e.jsObject);
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