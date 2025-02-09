import React, { Dispatch, SetStateAction, ChangeEvent } from "react";
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Autocomplete,
  Box,
  Checkbox,
  Typography,
} from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePickerEventFormData, ITodo } from "./EventCalendar";

interface IProps {
  open: boolean;
  handleClose: () => void;
  datePickerEventFormData: DatePickerEventFormData;
  setDatePickerEventFormData: Dispatch<SetStateAction<DatePickerEventFormData>>;
  onAddEvent: (event: DatePickerEventFormData) => Promise<void>;
  todos: ITodo[];
}

const AddDatePickerEventModal = ({
  open,
  handleClose,
  datePickerEventFormData,
  setDatePickerEventFormData,
  onAddEvent,
  todos,
}: IProps) => {
  const { description, start, end, allDay } = datePickerEventFormData;

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDatePickerEventFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDatePickerEventFormData((prevState) => ({
      ...prevState,
      allDay: event.target.checked,
    }));
  };

  const handleTodoChange = (e: React.SyntheticEvent, value: ITodo | null) => {
    setDatePickerEventFormData((prevState) => ({
      ...prevState,
      todoId: value?._id,
    }));
  };

  const handleStartDateChange = (newValue: Date | null) => {
    setDatePickerEventFormData((prevState) => ({
      ...prevState,
      start: newValue || undefined, // Convert null to undefined
    }));
  };

  const handleEndDateChange = (newValue: Date | null) => {
    setDatePickerEventFormData((prevState) => ({
      ...prevState,
      end: newValue || undefined, // Convert null to undefined
    }));
  };

  const isDisabled = () => {
    if (description === "" || start === null) {
      return true;
    }
    if (!allDay && end === null) {
      return true;
    }
    return false;
  };

  // ✅ Fix: `handleSubmit` now passes form data instead of `MouseEvent`
  const handleSubmit = async () => {
    await onAddEvent(datePickerEventFormData);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add event</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To add an event, please fill in the information below.
        </DialogContentText>
        <Box component="form">
          <TextField
            name="description"
            value={description}
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            onChange={onChange}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box mb={2} mt={5}>
              <DateTimePicker
                label="Start date"
                value={start}
                ampm={true}
                minutesStep={30}
                onChange={handleStartDateChange}
                slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
              />
            </Box>

            <Box>
              <Typography variant="caption" color="text" component={"span"}>
                All day?
              </Typography>
              <Checkbox onChange={handleCheckboxChange} checked={allDay} />
            </Box>

            <DateTimePicker
              label="End date"
              disabled={allDay}
              minDate={start || undefined}
              minutesStep={30}
              ampm={true}
              value={allDay ? null : end}
              onChange={handleEndDateChange}
              slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
            />
          </LocalizationProvider>
          <Autocomplete
            onChange={handleTodoChange}
            disablePortal
            id="combo-box-demo"
            options={todos}
            sx={{ marginTop: 4 }}
            getOptionLabel={(option) => option.title}
            renderInput={(params) => <TextField {...params} label="Todo" />}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={handleClose}>
          Cancel
        </Button>
        <Button disabled={isDisabled()} color="success" onClick={handleSubmit}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDatePickerEventModal;
