import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Dayjs } from 'dayjs';



export enum ProjectManagementStatusEnum {
    DID_NOT_START = "DID_NOT_START",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE",
    BLOCKED = "BLOCKED"
}

export default function SliceMangement() {
    const [status, setStatus] = React.useState<ProjectManagementStatusEnum>(ProjectManagementStatusEnum.DID_NOT_START);
    const [startedAt, setStartedAt] = React.useState<Dayjs>();
    const [finishedAt, setFinishedAt] = React.useState<Dayjs>();
    const [owner, setOwner] = React.useState<string>('');

    const handleStatusChange = (event: SelectChangeEvent) => setStatus(event.target.value as ProjectManagementStatusEnum);
    const handleOwnerChange = (event: React.ChangeEvent<HTMLInputElement>) => setOwner(event.target.value);
    const handleStartedAtChange = (value: Dayjs | null) => value && setStartedAt(value);
    const handleFinishedAtChange = (value: Dayjs | null) => value && setFinishedAt(value);

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth sx={{ marginBottom: '5px' }}>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                    labelId="status-label"
                    id="status"
                    value={status}
                    label="Status"
                    onChange={handleStatusChange}
                >
                    <MenuItem value={ProjectManagementStatusEnum.DID_NOT_START}>{ProjectManagementStatusEnum.DID_NOT_START}</MenuItem>
                    <MenuItem value={ProjectManagementStatusEnum.IN_PROGRESS}>{ProjectManagementStatusEnum.IN_PROGRESS}</MenuItem>
                    <MenuItem value={ProjectManagementStatusEnum.DONE}>{ProjectManagementStatusEnum.DONE}</MenuItem>
                    <MenuItem value={ProjectManagementStatusEnum.BLOCKED}>{ProjectManagementStatusEnum.BLOCKED}</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: '5px' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker label="started at" value={startedAt} onChange={handleStartedAtChange} />
                </LocalizationProvider>
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: '5px' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker label="finished at" value={finishedAt} onChange={handleFinishedAtChange} />
                </LocalizationProvider>
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: '5px' }}>
                <TextField id="owner" label="Owner" variant="outlined" value={owner} onChange={handleOwnerChange} />
            </FormControl>

        </Box>

    );
}