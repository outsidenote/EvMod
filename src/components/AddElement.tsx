import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import CogsIcon from './CogsIcon';
import ScreenIcon from './ScreenIcon';
import Crop169Icon from '@mui/icons-material/Crop169';
import { EvModElementTypeEnum } from '../types/element.types';
import type { Frame, Group, Shape } from '@mirohq/websdk-types';
import { Context } from './MainLayout';

const cogsIcon = `<svg version="1.1" id="svg2" xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 1200 1200" enable-background="new 0 0 1200 1200"> <path id="path4627" d="M910.143,91.119l-16.916,81.053c-17.338,2.724-34.037,7.74-49.691,14.743 l-58.229-58.825l-66.309,53.661l45.354,69.303c-10.104,13.862-18.357,29.104-24.623,45.503l-82.85-0.374l-8.906,84.87l81.055,16.914 c2.723,17.329,7.746,33.897,14.742,49.545l-58.824,58.376l53.66,66.31l69.303-45.43c13.852,10.098,29.119,18.435,45.504,24.698 l-0.375,82.774l84.871,8.904l16.838-81.053c17.346-2.722,34.035-7.666,49.695-14.669l58.301,58.825l66.309-53.735l-45.428-69.229 c10.104-13.857,18.43-29.108,24.697-45.503l82.773,0.3l8.906-84.87l-81.053-16.765c-2.725-17.354-7.66-34.103-14.67-49.77 l58.824-58.227l-53.734-66.309l-69.229,45.354c-13.869-10.111-29.17-18.428-45.578-24.697l0.373-82.774L910.143,91.119 L910.143,91.119z M924.211,288.25c2.668,0.009,5.373,0.09,8.084,0.374c43.355,4.555,74.756,43.384,70.201,86.741 c-4.555,43.355-43.385,74.83-86.742,70.274c-43.355-4.555-74.83-43.384-70.275-86.739 C849.748,318.253,884.203,288.111,924.211,288.25L924.211,288.25z M315.23,295.21l-11.375,112.711 c-23.205,6.187-45.185,15.324-65.486,27.092l-87.714-71.696l-82.55,82.55l71.698,87.788c-11.768,20.308-20.91,42.272-27.092,65.484 L0,610.44v116.751l112.71,11.376c6.182,23.191,15.334,45.118,27.092,65.41l-71.698,87.789l82.55,82.55l87.789-71.697 c20.292,11.758,42.219,20.91,65.411,27.093l11.375,112.71h116.752l11.301-112.71c23.212-6.183,45.178-15.325,65.484-27.093 l87.788,71.697l82.55-82.55l-71.697-87.714c11.768-20.302,20.906-42.281,27.092-65.485l112.711-11.376V610.44L634.5,599.138 c-6.186-23.225-15.314-45.243-27.092-65.561l71.697-87.714l-82.55-82.549l-87.713,71.696 c-20.316-11.775-42.336-20.905-65.562-27.093l-11.301-112.71H315.23V295.21z M373.606,560.82 c59.649,0,107.996,48.348,107.996,107.996c0,59.647-48.347,107.994-107.996,107.994c-59.648,0-107.996-48.347-107.996-107.994 C265.61,609.168,313.958,560.82,373.606,560.82L373.606,560.82z M869.279,705.039l-11.9,59.273 c-12.188,1.993-23.873,5.653-34.877,10.776l-41.012-43.033l-46.553,39.292l31.883,50.667c-7.102,10.143-12.959,21.308-17.363,33.306 l-58.15-0.301l-6.287,62.118l56.955,12.35c1.912,12.678,5.41,24.851,10.328,36.298l-41.312,42.659l37.721,48.497l48.721-33.229 c9.736,7.386,20.441,13.454,31.957,18.037l-0.225,60.621l59.648,6.511l11.824-59.349c12.189-1.991,23.869-5.579,34.875-10.702 l41.014,43.033l46.625-39.291l-31.957-50.668c7.104-10.139,12.959-21.312,17.363-33.306l58.229,0.226l6.211-62.043l-56.953-12.35 c-1.914-12.695-5.402-24.911-10.328-36.372l41.311-42.585l-37.719-48.572l-48.646,33.229c-9.746-7.396-20.498-13.449-32.031-18.036 l0.299-60.546L869.279,705.039L869.279,705.039z M879.158,849.183c1.873,0.009,3.783,0.092,5.688,0.301 c30.473,3.331,52.521,31.745,49.32,63.465c-3.201,31.719-30.449,54.748-60.922,51.416s-52.596-31.746-49.395-63.466 C826.85,871.161,851.039,849.081,879.158,849.183L879.158,849.183z"/></svg>`

export default function AddElement() {
    const [open, setOpen] = React.useState(false);
    const [elementType, setElementType] = React.useState<EvModElementTypeEnum | undefined>();
    const [elementName, setElementName] = React.useState('');
    const [store] = React.useContext(Context)

    const handleOpen = (elementType: EvModElementTypeEnum) => {
        setElementType(elementType);
        setOpen(true);
    }
    const handleClose = () => {
        setElementType(undefined);
        setOpen(false);
    }

    const getFillColor = () => {
        switch (elementType) {
            case EvModElementTypeEnum.Event:
                return '#F5D22B'
            case EvModElementTypeEnum.Command:
                return '#2D9BF0'
            case EvModElementTypeEnum.ReadModel:
                return '#8FD14F'
            case EvModElementTypeEnum.Screen:
                return '#FFFFFF'
            default:
                return '#FFFFFF'
        }
    }

    const getColor = () => {
        switch (elementType) {
            case EvModElementTypeEnum.Event:
                return '#1A1A1A'
            case EvModElementTypeEnum.Command:
                return '#FFFFFF'
            case EvModElementTypeEnum.ReadModel:
                return '#1A1A1A'
            case EvModElementTypeEnum.Processor:
            case EvModElementTypeEnum.Screen:
                return '#000000'
            default:
                return '#000000'
        }
    }

    const getWidth = () => {
        if (elementType == 'Screen')
            return 300;
        return 200;
    };

    const getHeight = () => {
        if (elementType == 'Screen')
            return 150;
        return 100;
    };

    const createShape = async () => {
        const viewport = await miro.board.viewport.get();

        if (!!elementType && [
            EvModElementTypeEnum.Event,
            EvModElementTypeEnum.Command,
            EvModElementTypeEnum.ReadModel,
            EvModElementTypeEnum.Screen].includes(elementType)) {
            return miro.board.createShape({
                content: `<p>${elementName}</p>`,
                shape: 'rectangle',
                style: {
                    color: getColor(),
                    fillColor: getFillColor(),
                    borderColor: '#1A1A1A'
                },
                x: viewport.x + viewport.width / 2, // Default value: center of the board
                y: viewport.y + viewport.height / 2, // Default value: center of the board
                width: getWidth(),
                height: getHeight(),
            });
        }

        else if (elementType == EvModElementTypeEnum.Processor) {
            const recPromise = miro.board.createShape({
                content: `<p>${elementName}</p>`,
                shape: 'rectangle',
                style: {
                    color: getColor(),
                    borderColor: '#1A1A1A',
                    textAlignVertical: 'bottom'
                },
                x: 0, // Default value: center of the board
                y: 0, // Default value: center of the board
                width: 200,
                height: 100,
            })
            const cogsPromise = miro.board.createImage({
                title: 'This is an image',
                url: `data:image/svg+xml;base64,${btoa(cogsIcon)}`,
                width: 70, // Set either 'width', or 'height'
            })

            const items = await Promise.all([recPromise, cogsPromise]);
            return miro.board.group({ items })
        }
        else if (elementType == EvModElementTypeEnum.Swimlane) {
            return miro.board.createFrame({
                title: elementName,
                style: {
                    fillColor: '#ffffff',
                },
                x: 0, // Default value: horizontal center of the board
                y: 0, // Default value: vertical center of the board
                width: 10000,
                height: 400,
            });

        }
        return;
    }

    const addElementRecord = async (element: Shape | Frame | Group): Promise<void> => {
        if (!elementType)
            throw new Error('No Element Type');
        console.log('AddElement: addElementRecord: elementType:', elementType)
        await store.addElement(elementType, element.id, elementName)
    }

    const handleSubmit = async () => {
        const shape = await createShape();
        if (!shape) throw new Error('shape was not created');
        await addElementRecord(shape);
        handleClose();
    }

    const style = {
        position: 'absolute' as 'absolute',
        top: '20%',
        left: '0%',
        width: '100%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <div>
            <h1>Add Element</h1>
            <p>Create a new element by clicking on one of the buttons</p>
            <Stack spacing={2} direction="column">
                <Button variant="contained" color="warning" onClick={() => handleOpen(EvModElementTypeEnum.Event)}>{EvModElementTypeEnum.Event}</Button>
                <Button variant="contained" color="info" onClick={() => handleOpen(EvModElementTypeEnum.Command)}>{EvModElementTypeEnum.Command}</Button>
                <Button variant="contained" color="success" onClick={() => handleOpen(EvModElementTypeEnum.ReadModel)}>{EvModElementTypeEnum.ReadModel}</Button>
                <Button startIcon={<CogsIcon />} variant="outlined" color="info" onClick={() => handleOpen(EvModElementTypeEnum.Processor)}>{EvModElementTypeEnum.Processor}</Button>
                <Button startIcon={<ScreenIcon />} variant="outlined" color="info" onClick={() => handleOpen(EvModElementTypeEnum.Screen)}>{EvModElementTypeEnum.Screen}</Button>
                <Button startIcon={<Crop169Icon />} variant="outlined" color="info" onClick={() => handleOpen(EvModElementTypeEnum.Swimlane)}>{EvModElementTypeEnum.Swimlane}</Button>
            </Stack>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="body1" component="h6" style={{ marginBottom: '20px' }} >
                        Create new {elementType}
                    </Typography>
                    <TextField
                        id="name"
                        label={"Name of " + elementType}
                        value={elementName}
                        placeholder="Some Name"
                        style={{ width: '100%', marginBottom: '20px' }}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setElementName(event.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSubmit()
                            }
                        }}
                    />
                    <Button variant="outlined" color="info" onClick={handleSubmit}>Create</Button>
                </Box>
            </Modal>
        </div>
    )

}