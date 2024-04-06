import * as React from 'react'
import { useState } from 'react'
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';


const channels = [
    'KafKa',
    'REST API',
    'RabbitMQ',
];

export default function CommandHandlerData() {
    const [commandHandlerName, setCommandHandlerName] = useState('')
    const [serviceName, setServiceName] = useState('')
    const [supportedChannels, setSupportedChannels] = React.useState<string[]>([]);

    const handleChannelsChange = (event: SelectChangeEvent<typeof supportedChannels>) => {
        const {
            target: { value },
        } = event;
        setSupportedChannels(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <Box>
            <FormControl fullWidth>
                <h5>Command Handler Data</h5>
            </FormControl>
            <FormControl fullWidth>
                <TextField
                    id="commandHandlerName"
                    label={"Name of Command Handler"}
                    value={commandHandlerName}
                    placeholder="Some Name"
                    style={{ width: '100%', marginBottom: '20px' }}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setCommandHandlerName(event.target.value);
                    }}
                />
            </FormControl>
            <FormControl fullWidth>
                <TextField
                    id="serviceName"
                    label={"Name of Service"}
                    value={serviceName}
                    placeholder="Some Service Name..."
                    style={{ width: '100%', marginBottom: '20px' }}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setServiceName(event.target.value);
                    }}
                />
            </FormControl>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Input Channels</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={supportedChannels}
                    label="Input Channels"
                    onChange={handleChannelsChange}
                    multiple
                    input={<OutlinedInput label="Input Channels" />}
                >
                    {channels.map((channel) => (
                        <MenuItem
                            key={channel}
                            value={channel}
                        >
                            {channel}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>

    )

}