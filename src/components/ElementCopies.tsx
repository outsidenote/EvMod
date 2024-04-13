import * as React from 'react'
import { IElementsStoreRecord } from '../store/ElementsStore'
import { Context } from './MainLayout';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import type { IElementMetadata } from '../types/element.types';
import Stack from '@mui/material/Stack';



interface IComponentProps {
    metadata: IElementMetadata,
    elementId: string
}

export default function ElementCopies({ metadata, elementId }: IComponentProps) {

    const [allelements, setAllElements] = React.useState<IElementsStoreRecord[]>([]);
    const [currentelement, setCurrentelement] = React.useState<number>(1);
    const [store] = React.useContext(Context);

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentelement(value);
        const copyElementSelectedEvent = new CustomEvent("copyElement:selected", { detail: allelements[value - 1] });
        document.dispatchEvent(copyElementSelectedEvent);
    };

    React.useEffect(() => {
        const { copyOf, elementType } = metadata
        const originId = copyOf || elementId;
        const copies = store.listCopies(elementType, originId);
        const originRecord = store.getById(elementType, originId);
        if (!originRecord)
            throw new Error('origin record was not found');
        const allEls = [originRecord, ...copies]
        setAllElements(allEls);
    }, []);

    React.useEffect(() => {
        if (!allelements || !allelements.length) return;
        const currElementIndex = allelements.findIndex(el => el.miroElementId === elementId);
        if (!~currElementIndex) throw new Error(`Current element index not found. '\n${allelements}\n${elementId}`);
        setCurrentelement(currElementIndex + 1);
    }, [allelements]);

    return (
        allelements.length > 1 &&
        <Stack spacing={2}>
            <Typography>Element copies (first is origin)</Typography>
            <Pagination
                count={allelements.length}
                onChange={handleChange}
                page={currentelement}
            />
        </Stack>
    )

}