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
import AddEditCompte from "./AddCompte";

export default function ComptesList() {
  const [comptes, setComptes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCompte, setSelectedCompte] = useState(null);

  const fetchComptes = async () => {
    try {
      // Mise à jour de l'URL pour récupérer les comptes comptables
      const response = await axios.get("http://localhost:5000/api/comptescomptables");
      setComptes(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des comptes comptables :", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Mise à jour de l'URL pour supprimer un compte comptable
      await axios.delete(`http://localhost:5000/api/comptescomptables/${id}`);
      fetchComptes();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const handleEdit = (compte) => {
    setSelectedCompte(compte);
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setSelectedCompte(null);
    setOpenDialog(true);
  };

  useEffect(() => {
    fetchComptes();
  }, []);

  return (
    <Container
      sx={{
        maxWidth: "100%",
        paddingTop: 0,
        marginTop: -10,
        overflowX: "auto", // Permet un défilement horizontal si nécessaire
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
          Liste des Comptes Comptables
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
          Ajouter un Compte
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
              <TableCell sx={{ fontWeight: "bold", width: "20%", whiteSpace: "nowrap" }}>
                Numéro de Compte
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "40%", whiteSpace: "nowrap" }}>
                Libellé
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "20%", whiteSpace: "nowrap" }}>
                Numéro Compte Commercial
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  width: "20%",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {comptes.map((compte) => (
              <TableRow
                key={compte._id}
                sx={{
                  "&:hover": {
                    backgroundColor: "#f1f1f1",
                  },
                }}
              >
                <TableCell sx={{ width: "20%", whiteSpace: "nowrap" }}>
                  {compte.num_cpte}
                </TableCell>
                <TableCell sx={{ width: "40%", whiteSpace: "nowrap" }}>
                  {compte.libelle}
                </TableCell>
                <TableCell sx={{ width: "20%", whiteSpace: "nowrap" }}>
                  {compte.num_cpte_com}
                </TableCell>
                <TableCell sx={{ width: "20%", textAlign: "center", whiteSpace: "nowrap" }}>
                  <IconButton onClick={() => handleEdit(compte)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(compte._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {openDialog && (
        <AddEditCompte
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          fetchComptes={fetchComptes}
          compte={selectedCompte}
        />
      )}
    </Container>
  );
}
