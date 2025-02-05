import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import AddEditJournal from "./AddJournal";

export default function JournalList() {
  const [journals, setJournals] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState(null);

  const fetchJournals = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/journals");
      setJournals(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des journaux :", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/journals/${id}`);
      fetchJournals();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const handleEdit = (journal) => {
    setSelectedJournal(journal);
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setSelectedJournal(null);
    setOpenDialog(true);
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  return (
    <Container
      sx={{
        maxWidth: "100%",
        paddingTop: 0,
        marginTop: 0,
        overflowX: "auto", // Permet un défilement horizontal si nécessaire
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333" }}>
          Liste des Journaux
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{
            backgroundColor: "#007BFF",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#0056b3",
            },
          }}
          onClick={handleAdd}
        >
          Ajouter un Journal
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          overflow: "hidden",
          marginTop: 2,
        }}
      >
        <Table sx={{ minWidth: 700 }}>
          <TableHead sx={{ backgroundColor: "#f4f6f9" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", width: "15%" }}>
                Numéro
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "65%" }}>
                Libellé
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  width: "20%",
                  textAlign: "center",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {journals.map((journal) => (
              <TableRow
                key={journal._id}
                sx={{
                  "&:hover": {
                    backgroundColor: "#f1f1f1",
                  },
                }}
              >
                <TableCell sx={{ width: "15%" }}>{journal.numero}</TableCell>
                <TableCell sx={{ width: "65%" }}>{journal.libelle}</TableCell>
                <TableCell
                  sx={{
                    width: "20%",
                    textAlign: "center",
                  }}
                >
                  <IconButton onClick={() => handleEdit(journal)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(journal._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {openDialog && (
        <AddEditJournal
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          fetchJournals={fetchJournals}
          journal={selectedJournal}
        />
      )}
    </Container>
  );
}
