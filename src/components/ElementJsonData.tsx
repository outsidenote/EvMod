import * as React from 'react';
import { useState, useEffect } from "react";

import JSONInput from 'react-json-editor-ajrm/es';
import locale from 'react-json-editor-ajrm/locale/en';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';


export default function ElementJsonData({ selectedElement }: { selectedElement: any }) {
    const [jsonData, setJsonData] = useState({})
    const [saving, setSaving] = useState(false);

    const setSelection = async () => {
        console.log('ElementJsonData: setting selection:', selectedElement)
        if (!selectedElement)
            setJsonData({})
        else {
            const elData = selectedElement.type !== 'frame' && await selectedElement.getMetadata('jsonData') || {};
            console.log('ElementJsonData: elData:', elData)
            setJsonData(elData)
        }
    }

    const handleSave = async () => {
        setSaving(true);
        console.log('saving json data');
        await selectedElement.setMetadata('jsonData', jsonData)
        setSaving(false);
    };

    useEffect(() => { setSelection() }, [selectedElement]);



    if (!!selectedElement)
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
                <Button variant="outlined" color="info" onClick={handleSave} disabled={saving}>Save</Button>
            </Box>
        )
    else return
}