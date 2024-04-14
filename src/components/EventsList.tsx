import * as React from 'react';
import { IElementsStoreRecord } from '../store/ElementsStore';
import { Box, Button, ButtonBase, Card, CardActionArea, CardActions, CardContent, Grid, Modal, Typography } from '@mui/material';
import ElementJsonData from './ElementJsonData';
import type { Shape } from '@mirohq/websdk-types';
import { IElementData } from '../types/element.types';
import { ELEMENT_DATA_KEY } from '../consts';
import { WidthFull } from '@mui/icons-material';

interface IComponentProps {
    eventRecords: IElementsStoreRecord[]
}

export default function EventsList({ eventRecords }: IComponentProps) {
    const [open, setOpen] = React.useState(false);
    const [eventData, setEventData] = React.useState<IElementData>();
    const [selectedElement, setSelectedElement] = React.useState<IElementsStoreRecord>();

    const handleClose = () => {
        setOpen(false);
    }

    const handleEventSelection = async (element: IElementsStoreRecord) => {
        const el = await miro.board.getById(element.miroElementId);
        if (el?.type !== 'shape')
            return;

        const dataJson = (await (el as Shape).getMetadata(ELEMENT_DATA_KEY));
        setEventData(dataJson as unknown as IElementData);
        setSelectedElement(element);
        setOpen(true);
    }

    return (
        <Box>
            <Grid container spacing={2}>
                {
                    eventRecords.map(record => (
                        <Grid item xs={6} md={6} lg={4} xl={3} key={record.miroElementId} alignItems={"center"} direction="column" justifyContent="center">
                            <Card
                                variant="outlined"
                                style={{ backgroundColor: "#F5D22B", minHeight: '96px' }}
                                sx={{
                                    ':hover': {
                                        boxShadow: 5, // theme.shadows[20]
                                        cursor: "pointer"
                                    },
                                }}
                            >
                                <ButtonBase onClick={() => handleEventSelection(record)} sx={{ width: '100%' }}>
                                    <CardContent>
                                        <Typography sx={{ fontSize: 10 }} color="text.secondary" gutterBottom>Event</Typography>
                                        <Typography variant="h5" component="div" sx={{ fontSize: 14 }}>{record.elementName}</Typography>
                                    </CardContent>
                                </ButtonBase>
                            </Card>
                        </Grid>
                    ))
                }

            </Grid>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Card>
                    <CardContent>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            Showing Data of:
                        </Typography>
                        <Typography variant="h5" component="div">
                            Event: {selectedElement?.elementName}
                        </Typography>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            ID: {selectedElement?.miroElementId}
                        </Typography>
                        <ElementJsonData data={eventData} readonly={true} />
                    </CardContent>
                </Card>
            </Modal>
        </Box >
    )
}