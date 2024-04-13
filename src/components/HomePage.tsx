import * as React from 'react';
import Button from '@mui/material/Button';
import { Context } from './MainLayout'
import { EvModElementTypeEnum } from '../types/element.types';
import { IElementsStoreRecord } from '../store/ElementsStore';



export default function HomePage() {
    const [scanning, setScanning] = React.useState(false);
    const [store] = React.useContext(Context);

    const handleDbScan = async () => {
        setScanning(true);

        const handleElementTypeScan = async (elementType: EvModElementTypeEnum) => {
            const records = store.list(elementType);
            console.log('starting scan for:', elementType, 'store:', records);
            await new Promise((resolve, reject) => {
                handleIdScan(records, 0, elementType, resolve, reject)
            })

        }

        const handleIdScan = async (
            records: IElementsStoreRecord[],
            index: number,
            elementType: EvModElementTypeEnum,
            resolve: (value: unknown) => void,
            reject: (value: unknown) => void
        ) => {
            if (records.length <= index) {
                console.log('finished scan for:', elementType, 'store:', store.list(elementType));
                return resolve(undefined);
            }
            const record = records[index];
            // console.log('Scan: record:', record)
            try {
                await miro.board.getById(record.miroElementId)
                // console.log('Scan: record:', record, 'found in item:', item);
            } catch (error: any) {
                // console.log('Scan: error message:', error.message);
                if (!error.message.includes('Can not retrieve item with id'))
                    throw reject(error);
                // console.log('Scan: going to delete:', elementType, record)
                await store.delete(elementType, record.miroElementId);
            }
            setTimeout(async () => handleIdScan(records, index + 1, elementType, resolve, reject), 500)
        }

        const elemntTypeScanPromisesChain = Object.keys(EvModElementTypeEnum)
            .map(key => EvModElementTypeEnum[key as keyof typeof EvModElementTypeEnum])
            .reduce((chain, elementType) => chain.then(() => handleElementTypeScan(elementType as EvModElementTypeEnum))
                , Promise.resolve());

        await elemntTypeScanPromisesChain;
        setScanning(false);

    }

    return (
        <div>
            <h1>Welcome to EvModel</h1>
            <p>We hope this plugin will help you with event modeling.</p>
            <p>Enjoy!</p>

            <Button variant="contained" color="info" onClick={handleDbScan} disabled={scanning}>Scan DB for outdated elements</Button>

        </div>
    )
}