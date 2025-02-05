import React, { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import EventIcon from "@mui/icons-material/Event";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import FolderIcon from "@mui/icons-material/Folder";
import SettingsIcon from "@mui/icons-material/Settings";  // Icône pour Paramètres
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../appStore";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Sidenav() {
  const theme = useTheme();
  const navigate = useNavigate();
  const open = useAppStore((state) => state.dopen);
  const [openFichiers, setOpenFichiers] = useState(false);

  const handleFichiersClick = () => {
    setOpenFichiers(!openFichiers);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {/* Home */}
          <ListItem disablePadding sx={{ display: "block" }} onClick={() => navigate("/")}>
            <ListItemButton sx={{ minHeight: 48, justifyContent: open ? "initial" : "center", px: 2.5 }}>
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : "auto", justifyContent: "center" }}>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={"Home"} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>

          {/* Fichiers de base */}
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton sx={{ minHeight: 48, justifyContent: open ? "initial" : "center", px: 2.5 }} onClick={handleFichiersClick}>
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : "auto", justifyContent: "center" }}>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary={"Fichiers de base"} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>

          {openFichiers && (
            <List component="div" disablePadding>
              <ListItem disablePadding sx={{ display: "block", pl: open ? 4 : 2 }} onClick={() => navigate("/journaux")}>
                <ListItemButton sx={{ minHeight: 40, justifyContent: open ? "initial" : "center", px: 2.5 }}>
                  <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : "auto", justifyContent: "center" }}>
                    <EventIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Journaux"} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding sx={{ display: "block", pl: open ? 4 : 2 }} onClick={() => navigate("/comptescomptables")}>
                <ListItemButton sx={{ minHeight: 40, justifyContent: open ? "initial" : "center", px: 2.5 }}>
                  <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : "auto", justifyContent: "center" }}>
                    <AccountBalanceIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Comptes"} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            </List>
          )}
        </List>

        <Divider />

        {/* Settings */}
        <ListItem disablePadding sx={{ display: "block" }} onClick={() => navigate("/settings")}>
          <ListItemButton sx={{ minHeight: 48, justifyContent: open ? "initial" : "center", px: 2.5 }}>
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : "auto", justifyContent: "center" }}>
              <SettingsIcon /> {/* Icône Settings */}
            </ListItemIcon>
            <ListItemText primary={"Settings"} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
      </Drawer>
    </Box>
  );
}
