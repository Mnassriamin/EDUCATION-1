import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import axios from "axios";

export default function AddCompte({ open, onClose, fetchComptes, compte }) {
  const [form, setForm] = useState(compte || { num_cpte: "", libelle: "", num_cpte_com: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (compte) {
        // Modifier un compte existant
        await axios.put(`http://localhost:5000/api/comptescomptables/${compte._id}`, form);
      } else {
        // Ajouter un nouveau compte
        await axios.post("http://localhost:5000/api/comptescomptables", form);
      }
      fetchComptes(); // Met à jour la liste des comptes
      onClose(); // Ferme la boîte de dialogue
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{compte ? "Modifier Compte" : "Ajouter Compte"}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Numéro de Compte"
          name="num_cpte"
          fullWidth
          value={form.num_cpte}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Libellé"
          name="libelle"
          fullWidth
          value={form.libelle}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Numéro Compte Com"
          name="num_cpte_com"
          fullWidth
          value={form.num_cpte_com}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained">
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
