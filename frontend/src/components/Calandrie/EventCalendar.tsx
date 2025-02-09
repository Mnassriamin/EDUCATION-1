import React, { useState, MouseEvent, useEffect } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
} from "@mui/material";
import {
  Calendar,
  type Event,
  dateFnsLocalizer,
  SlotInfo,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios"; // Import axios

import EventInfo from "./EventInfo";
import AddEventModal from "./AddEventModal";
import EventInfoModal from "./EventInfoModal";
import { AddTodoModal } from "./AddTodoModal";
import AddDatePickerEventModal from "./AddDatePickerEventModal";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export interface ITodo {
  _id: string;
  title: string;
  color?: string;
}

export interface IEventInfo extends Event {
  _id: string;
  name: string;
  matiere: string;
  enseignant: string;
  datedebut: Date;
  datefin: Date;
  description: string;
  etudiants: { enfantId: string; enfantName: string }[];
  todoId?: string; // Add todoId to IEventInfo
  matiereId: string;
  enseignantId: string;
}

export interface EventFormData {
  name: string;
  matiere: string;
  enseignant: string;
  datedebut: Date;
  datefin: Date;
  description: string;
}

export interface DatePickerEventFormData {
  description: string;
  todoId?: string;
  allDay: boolean;
  start?: Date;
  end?: Date;
}

export const generateId = () =>
  (Math.floor(Math.random() * 10000) + 1).toString();

const initialEventFormState: EventFormData = {
  name: "",
  matiere: "",
  enseignant: "",
  datedebut: new Date(),
  datefin: new Date(),
  description: "",
};

const initialDatePickerEventFormData: DatePickerEventFormData = {
  description: "",
  todoId: undefined,
  allDay: false,
  start: undefined,
  end: undefined,
};

const EventCalendar = () => {
  const [openSlot, setOpenSlot] = useState(false);
  const [openDatepickerModal, setOpenDatepickerModal] = useState(false);
  const [openTodoModal, setOpenTodoModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<IEventInfo | null>(null);
  const [eventInfoModal, setEventInfoModal] = useState(false);
  const [events, setEvents] = useState<IEventInfo[]>([]);
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [eventFormData, setEventFormData] = useState<EventFormData>(
    initialEventFormState
  );
  const [
    datePickerEventFormData,
    setDatePickerEventFormData,
  ] = useState<DatePickerEventFormData>(initialDatePickerEventFormData);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Add state for select options
  const [matieres, setMatieres] = useState([]);

  // **IMPORTANT:**  Replace this with your actual way of getting the logged-in user's ID
  const loggedInProfessorId = "65c6e0cae9d3d62177d96328"; //Example ID


  // Load select options from backend
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const matieresResponse = await axios.get(
          "http://localhost:5000/api/matieres"
        );
        setMatieres(matieresResponse.data);
      } catch (error) {
        console.error("Error loading options:", error);
        alert("Failed to load options. Please check the console for details.");
      }
    };

    loadOptions();
  }, []);

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    setOpenSlot(true);
    setCurrentEvent({
      _id: generateId(),
      title: "",
      start: slotInfo.start,
      end: slotInfo.end,
      name: "",
      matiere: "",
      enseignant: "",
      datedebut: slotInfo.start,
      datefin: slotInfo.end,
      description: "",
      etudiants: [],
      matiereId: "",
      enseignantId: "",
    });
  };

  const handleSelectEvent = (event: IEventInfo) => {
    setCurrentEvent(event);
    setEventInfoModal(true);
  };

  const handleClose = () => {
    setEventFormData(initialEventFormState);
    setOpenSlot(false);
  };

  const handleDatePickerClose = () => {
    setDatePickerEventFormData(initialDatePickerEventFormData);
    setOpenDatepickerModal(false);
  };

  const onAddEvent = async (event: EventFormData) => {
    if (!currentEvent?.start || !currentEvent?.end) return;

    // Prepare the data to match the Cours model
    const coursData = {
      name: event.name,
      matiere: event.matiere,
      enseignant: loggedInProfessorId, // Use logged-in professor's ID
      datedebut: currentEvent.start,
      datefin: currentEvent.end,
      description: event.description,
      etudiants: [], // Initialize with an empty array of students
    };

    try {
      // Save the event to the database
      const response = await axios.post(
        "http://localhost:5000/api/cours",
        coursData
      );

      const savedCours = response.data;
      console.log("Event saved to the database:", savedCours);

      // Add the event to the local state
      const newEvent: IEventInfo = {
        ...event,
        _id: savedCours._id,
        start: currentEvent.start,
        end: currentEvent.end,
        datedebut: currentEvent.start,
        datefin: currentEvent.end,
        etudiants: [],
        matiereId: "",
        enseignantId: "",
      };

      setEvents([...events, newEvent]);
      handleClose();
    } catch (error) {
      console.error("Error saving event:", error);
      alert(
        "Failed to save event.  Please check that the backend is running and the API endpoint is correct."
      );
    }
  };

  const onAddEventFromDatePicker = async (event: DatePickerEventFormData) => {
    if (!event.start) return;
  
    const addHours = (date: Date, hours: number): Date => {
      return new Date(date.getTime() + hours * 60 * 60 * 1000);
    };
  
    const getDateOrDefault = (date: Date | undefined): Date =>
      date ? date : new Date();
  
    const newEvent: IEventInfo = {
      ...event,
      _id: generateId(),
      start: getDateOrDefault(event.start),
      end: event.allDay
        ? addHours(getDateOrDefault(event.start), 12)
        : getDateOrDefault(event.end),
      name: "",
      matiere: "",
      enseignant: "",
      datedebut: getDateOrDefault(event.start),
      datefin: event.allDay
        ? addHours(getDateOrDefault(event.start), 12)
        : getDateOrDefault(event.end),
      description: event.description,
      etudiants: [],
      matiereId: "",
      enseignantId: "",
    };
  
    setEvents([...events, newEvent]);
    setDatePickerEventFormData(initialDatePickerEventFormData);
  };
  

  const onDeleteEvent = () => {
    setEvents(events.filter((e) => e._id !== currentEvent?._id));
    setEventInfoModal(false);
  };

  return (
    <Box
      mt={2}
      mb={2}
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
        marginLeft: isSidebarCollapsed ? "70px" : "240px",
        transition: "margin-left 0.3s ease",
      }}
    >
      <Container maxWidth={false}>
        <Card>
          <CardHeader
            title="Calendar"
            subheader="Create Events and Todos and manage them easily"
          />
          <Divider />
          <CardContent>
            <ButtonGroup size="large" variant="contained">
              <Button onClick={() => setOpenDatepickerModal(true)}>
                Add event
              </Button>
              <Button onClick={() => setOpenTodoModal(true)}>
                Create todo
              </Button>
            </ButtonGroup>
            <Divider style={{ margin: 10 }} />
            <AddEventModal
              show={openSlot}
              handleClose={handleClose}
              addEvent={onAddEvent}
              eventFormData={eventFormData}
              setEventFormData={setEventFormData}
              todos={todos}
              matieres={matieres}
            />
            <AddDatePickerEventModal
              open={openDatepickerModal}
              handleClose={handleDatePickerClose}
              datePickerEventFormData={datePickerEventFormData}
              setDatePickerEventFormData={setDatePickerEventFormData}
              onAddEvent={onAddEventFromDatePicker}
              todos={todos}
            />
            <EventInfoModal
              open={eventInfoModal}
              handleClose={() => setEventInfoModal(false)}
              onDeleteEvent={onDeleteEvent}
              currentEvent={currentEvent}
            />
            <AddTodoModal
              open={openTodoModal}
              handleClose={() => setOpenTodoModal(false)}
              todos={todos}
              setTodos={setTodos}
            />
            <Calendar
              localizer={localizer}
              events={events}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              startAccessor="start"
              endAccessor="end"
              defaultView="week"
              eventPropGetter={(event) => ({
                style: {
                  backgroundColor:
                    todos.find((todo) => todo._id === event.todoId)?.color ||
                    "#b64fc8",
                },
              })}
              style={{ height: 600, marginTop: 20 }}
            />
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default EventCalendar;
