import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { Margin } from '@mui/icons-material';

export default function AddElement() {
    const [open, setOpen] = React.useState(false);
    const [elementType, setElementType] = React.useState('');
    const [elementName, setElementName] = React.useState('');

    const handleOpen = (elementType: string) => {
        setElementType(elementType);
        setOpen(true);
    }
    const handleClose = () => {
        setElementType('');
        setOpen(false);
    }

    const getFillColor = () => {
        switch (elementType) {
            case 'Event':
                return '#F5D22B'
            case 'Command':
                return '#2D9BF0'
            case 'Read Model':
                return '#8FD14F'
        }
    }

    const getColor = () => {
        switch (elementType) {
            case 'Event':
                return '#1A1A1A'
            case 'Command':
                return '#FFFFFF'
            case 'Read Model':
                return '#1A1A1A'
        }
    }

    const createShape = async () => {
        return miro.board.createShape({
            content: `<p>${elementName}</p>`,
            shape: 'rectangle',
            style: {
                color: getColor(),
                fillColor: getFillColor(),
                borderColor: '#1A1A1A', // Default border color: '#ffffff` (white)
            },
            x: 0, // Default value: center of the board
            y: 0, // Default value: center of the board
            width: 200,
            height: 100,
        });
    }

    const handleSubmit = async () => {
        await createShape();
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
                <Button variant="contained" color="warning" onClick={() => handleOpen('Event')}>Create Event</Button>
                <Button variant="contained" color="info" onClick={() => handleOpen('Command')}>Create Command</Button>
                <Button variant="contained" color="success" onClick={() => handleOpen('Read Model')}>Create Read Model</Button>
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
                    />
                    <Button variant="outlined" color="info" onClick={handleSubmit}>Create</Button>
                </Box>
            </Modal>
        </div>
    )

}