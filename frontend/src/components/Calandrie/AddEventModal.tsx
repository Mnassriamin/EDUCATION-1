import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { ITodo } from "./EventCalendar";

interface EventFormData {
  name: string;
  matiere: string;
  enseignant: string;
  datedebut: Date;
  datefin: Date;
  description: string;
}

interface AddEventModalProps {
  show: boolean;
  handleClose: () => void;
  addEvent: (event: EventFormData) => Promise<void>;
  eventFormData: EventFormData;
  setEventFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
  todos: ITodo[];
  matieres: any[]; // Add matieres prop
}

const AddEventModal: React.FC<AddEventModalProps> = ({
  show,
  handleClose,
  addEvent,
  eventFormData,
  setEventFormData,
  todos,
  matieres,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEventFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await addEvent(eventFormData);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Ajouter un Cours</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="name">
            <Form.Label>Nom du cours</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={eventFormData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="matiere">
            <Form.Label>Matière</Form.Label>
            <Form.Control
              as="select"
              name="matiere"
              value={eventFormData.matiere}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner une matière</option>
              {matieres.map((matiere) => (
                <option key={matiere._id} value={matiere._id}>
                  {matiere.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="datedebut">
            <Form.Label>Date de début</Form.Label>
            <Form.Control
              type="datetime-local"
              name="datedebut"
              value={eventFormData.datedebut.toISOString().slice(0, 16)}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="datefin">
            <Form.Label>Date de fin</Form.Label>
            <Form.Control
              type="datetime-local"
              name="datefin"
              value={eventFormData.datefin.toISOString().slice(0, 16)}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={eventFormData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Annuler
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Ajouter
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEventModal;
