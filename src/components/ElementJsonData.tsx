import * as React from 'react';
import { useState, useEffect } from "react";

import JSONInput from 'react-json-editor-ajrm/es';
import locale from 'react-json-editor-ajrm/locale/en';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { ELEMENT_DATA_KEY } from '../consts';
import { IElementData } from '../types/element.types';


export default function ElementJsonData({ data, readonly }: { data: IElementData | undefined, readonly: boolean }) {
    const [jsonData, setJsonData] = useState<IElementData>();
    React.useEffect(() => {
        console.log('ElementJsonData: data:', data)
        setJsonData(data);
    }, [data]);

    const handleSave = async () => {
        const elementDataSavedEvent = new CustomEvent("elementData:saved", { detail: jsonData });
        console.log('dispatching element data saved event:', elementDataSavedEvent);
        document.dispatchEvent(elementDataSavedEvent);
    };


    if (!!data)
        return (
            <Box>
                <JSONInput
                    id='a_unique_id'
                    placeholder={jsonData}
                    locale={locale}
                    width='100%'
                    height='300px'
                    onChange={async (e: any) => {
                        setJsonData(e.jsObject);
                    }}
                />
                <Button variant="outlined" color="info" onClick={handleSave} disabled={readonly}>Save</Button>
            </Box>
        )
    else return
}