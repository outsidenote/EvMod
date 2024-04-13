import * as React from 'react';
import { useState } from "react";
import CommandHandlerData from './CommandHandlerData';
import ElementJsonData from './ElementJsonData';
import Button from '@mui/material/Button';
import { EvModElementTypeEnum, IElementData, IElementMetadata, MiroElementType } from '../types/element.types';
import { ELEMENT_DATA_KEY, ELEMENT_METADATA_KEY } from '../consts';
import { Connector, Card, AppCard, Tag, Embed, Image, Preview, Shape, StickyNote, Text, Frame, Group, Unsupported, Json, SelectionUpdateEvent } from "@mirohq/websdk-types";
import SwimLaneData from './SwimLaneData';
import ReadModelData from './ReadModelData';
import { Context } from './MainLayout';
import { setElementLink, unsetElementLink } from '../utils';
import { IElementsStoreRecord } from '../store/ElementsStore';

const miroItemTypesWithMetadata = ['shape', 'connector', 'image'];

export interface IElementDataSavedEvent {
    detail: IElementData
}

interface ISelectionHandlerInput {
    items: MiroElementType[]
}

const getMetadata = async (element: Shape | Frame | Image) => {
    const metadataJson = await (element as Shape | Frame | Image).getMetadata(ELEMENT_METADATA_KEY);
    if (!metadataJson) return;
    return JSON.parse(metadataJson.toString()) as unknown as IElementMetadata;
}

export default function ViewElement() {
    const [selectedElement, setSelectedElement] = useState<MiroElementType | undefined>();
    const [originElement, setOriginElement] = useState<MiroElementType | undefined>();
    const [selecting, setSelecting]: any = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [elMetadata, setElMetadata] = useState<IElementMetadata>();
    const [elementData, setElementData] = useState<IElementData>();
    const [saving, setSaving] = useState(false);
    const [settingNewOrigin, setSettingNewOrigin] = useState<boolean>(false);
    const [store] = React.useContext(Context);

    const handleElementDataSaved = (originalElement: MiroElementType | undefined) => {
        console.log('building handler with originElement:', originElement)
        return async (e: Event) => {
            console.log('received dispatch, originElement:', originElement)
            if (!originElement) return;
            console.log('go origin element')
            setSaving(true);
            console.log('saving json data');
            const data = (e as unknown as IElementDataSavedEvent).detail;
            console.log('ViewElement: saving data:', data)
            await (originElement as Shape | Image).setMetadata(ELEMENT_DATA_KEY, data as unknown as Json);
            setSaving(false);
        }
    };

    React.useEffect(() => {
        const handler = handleElementDataSaved(originElement)
        document.addEventListener("elementData:saved", handler);
        return () => {
            document.removeEventListener("elementData:saved", handler);
        }
    }, [originElement])

    const setSelection = async (items: MiroElementType[]) => {
        const element = items[0]
        console.log('ViewElement: selected element:', element)
        setSelectedElement(element);

        const metadata = miroItemTypesWithMetadata.includes(element.type) ?
            await getMetadata(element as Shape | Frame | Image) : undefined;

        console.log('ViewElement: metadata:', metadata)
        setElMetadata(metadata as unknown as IElementMetadata | undefined);


        const originEl = !!metadata?.copyOf ?
            await miro.board.getById(metadata.copyOf) :
            element;
        console.log('ViewElement: originElement:', originEl);
        setOriginElement(originEl as MiroElementType);

        if (!originEl) return;

        const elData = originEl.type !== 'frame' && await (originEl as Shape | Image).getMetadata(ELEMENT_DATA_KEY) || {};
        console.log('Viewelement:: element data:', elData);
        setElementData(elData as unknown as IElementData);
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
        const selectionUpdateHandler = async (event: SelectionUpdateEvent) => {
            const newSelectedItems = event.items;
            if (newSelectedItems.length !== 1 || newSelectedItems[0].id !== selectedItems[0].id) {
                clearSelection();
                miro.board.ui.off('selection:update', selectionUpdateHandler);
                console.log('unsubscribed to selection event. SelectedElement.id', selectedItems[0].id)
            }

        }
        setSelection(selectedItems);
        miro.board.ui.on('selection:update', selectionUpdateHandler);
        console.log('subscribed to selection event. SelectedElement.id', selectedItems[0].id)

    }

    const handleView = async () => {
        setSelecting(true);
        const items: MiroElementType[] = await miro.board.getSelection()
        await selectionHandler({ items });
        setSelecting(false);

    }

    const getElementDetailsCompoennt = () => {
        if (errMsg) return;

        switch (elMetadata?.elementType) {
            case EvModElementTypeEnum.ReadModel:
                return <ReadModelData selectedElement={originElement as Shape} />

            case EvModElementTypeEnum.Event:
            case EvModElementTypeEnum.Command:
                return <ElementJsonData data={elementData} readonly={saving} />
            case EvModElementTypeEnum.CommandHandler:
                return <CommandHandlerData />
            default:
                if (selectedElement?.type === 'frame')
                    return <SwimLaneData selectedElement={originElement as Frame} />
                return;
        }
    }

    const handleSetAsOrigin = async () => {
        setSettingNewOrigin(true);
        try {
            const { copyOf, elementType } = elMetadata || {};
            if (!copyOf) return;
            const currentOriginElemnt = await miro.board.getById(copyOf);
            if (!currentOriginElemnt) throw new Error('current origin was not found on board.');
            if (!miroItemTypesWithMetadata.includes(currentOriginElemnt.type)) return;

            let newOriginRecord: IElementsStoreRecord | undefined;
            let currentOriginRecord: IElementsStoreRecord | undefined;
            const copies: IElementsStoreRecord[] = [];

            store.list(elementType as EvModElementTypeEnum)
                .forEach(record => {
                    if (record.miroElementId === copyOf)
                        return currentOriginRecord = record;
                    else if (record.miroElementId === selectedElement?.id)
                        return newOriginRecord = record;
                    else if (record.originalMiroElementId === copyOf)
                        return copies.push(record);
                    return;
                });

            if (!newOriginRecord || !currentOriginRecord) throw new Error('not enough records found.');

            console.log('>> newOriginRecord:', newOriginRecord, 'currentOriginRecord:', currentOriginRecord, 'copies:', copies);

            await Promise.all([
                (selectedElement as Shape).setMetadata(ELEMENT_DATA_KEY, elementData as unknown as Json),
                (currentOriginElemnt as Shape).setMetadata(ELEMENT_DATA_KEY, {})
            ]);

            newOriginRecord.originalMiroElementId = undefined;
            currentOriginRecord.originalMiroElementId = newOriginRecord.miroElementId;
            copies.forEach(record => record.originalMiroElementId = newOriginRecord?.miroElementId);

            const updateNewOriginMetadata = async () => {
                const metadata = elMetadata;
                if (metadata) metadata.copyOf = undefined;
                setElMetadata(metadata);
                return (selectedElement as Shape).setMetadata(ELEMENT_METADATA_KEY, JSON.stringify(metadata));
            }

            await Promise.all([
                unsetElementLink(selectedElement as Shape),
                setElementLink(currentOriginElemnt as Shape, newOriginRecord.miroElementId),
                updateNewOriginMetadata(),
                ...[...copies, currentOriginRecord].map(record => miro.board.getById(record.miroElementId)
                    .then(el => Promise.all([
                        setElementLink(el as Shape, newOriginRecord?.miroElementId),
                        (el as Shape).getMetadata(ELEMENT_METADATA_KEY)
                            .then(metadataStr => {
                                const metadata: IElementMetadata = JSON.parse(metadataStr as string);
                                metadata.copyOf = newOriginRecord?.miroElementId;
                                return (el as Shape).setMetadata(ELEMENT_METADATA_KEY, JSON.stringify(metadata))
                            })
                    ]))
                )
            ]);
        } finally {
            setSettingNewOrigin(false);
        }

    };

    return (
        <div>
            <h1>View Element</h1>
            <p>Select an emelemnt in the board to see its data and click the 'View Element' button</p>
            <p style={{ color: "var(--red800)" }}><small>{errMsg}</small></p>
            <Button variant="outlined" color="info" onClick={handleView} disabled={selecting}>View Element</Button>
            <hr />
            {!!elMetadata?.copyOf && <Button variant="outlined" color="info" onClick={handleSetAsOrigin} disabled={settingNewOrigin}>Set as Origin</Button>}
            {!!elMetadata && <h4><b>{elMetadata.elementType}:</b> {elMetadata.elementName}</h4>}
            {getElementDetailsCompoennt()}

        </div>
    )

}