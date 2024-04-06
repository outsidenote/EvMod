import * as React from 'react';
import { useState, useEffect } from "react";

import JSONInput from 'react-json-editor-ajrm/es';
import locale from 'react-json-editor-ajrm/locale/en';


export default function ElementJsonData({ selectedElement }: { selectedElement: any }) {
    const [jsonData, setJsonData] = useState({})
    const setSelection = async () => {
        if (!selectedElement)
            setJsonData({})
        else setJsonData(await selectedElement.getMetadata('jsonData'))
    }

    useEffect(() => { setSelection() });


    return (
        <JSONInput
            id='a_unique_id'
            placeholder={jsonData}
            locale={locale}
            width='100%'
            height='300px'
            onChange={async (e: any) => {
                console.log('json data has change - going to save:', e.jsObject, 'selected el:', selectedElement);
                await selectedElement.setMetadata('jsonData', e.jsObject);
                setJsonData(e.jsObject);
            }}
        />
    )
}