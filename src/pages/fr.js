import LogoutButton from "@/components/LogoutButton";
import { addTicket, getTickets } from "@/firebase";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Input,
  InputLabel,
  Modal,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
const FR = () => {
  const [open, setOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [tickets, setTickets] = useState([]);
  useEffect(() => {
    getTickets().then((tickets) => setTickets(tickets));
  }, []);
  const doneTickets = tickets.filter((t) => t.status === "done");
  const doingTickets = tickets.filter((t) => t.status !== "done");
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const onChange = () => setError("");
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = data.get("title");
    const description = data.get("description");
    const deadline = data.get("deadline");
    if (!(title && description && deadline))
      return setError("Veillez renseignez tout les champs");
    const ticket = {
      title,
      description,
      deadline,
    };
    setAdding(true);
    addTicket(ticket).finally(() => {
      setAdding(false);
      handleClose();
    });
    setTickets([ticket, ...tickets]);
  };
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };
  return (
    <div style={{ padding: "1rem" }}>
      <Button variant="contained" onClick={handleOpen}>
        Créer un ticket
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            mt: "15%",
            bgcolor: "white",
            width: "70%",
            padding: "1rem",
            ml: "15%",
          }}
        >
          {error && <Alert severity="error">{error}</Alert>}
          {adding ? (
            <CircularProgress />
          ) : (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Intitulé du ticket"
                name="title"
                autoFocus
                onChange={onChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="description"
                label="Description"
                onChange={onChange}
              />
              <InputLabel>Deadline</InputLabel>
              <Input
                type="date"
                required
                fullWidth
                name="deadline"
                onChange={onChange}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Confirmer
              </Button>
            </>
          )}
        </Box>
      </Modal>
      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab label="Tickets en cours" />
        <Tab label="Tickets faits" />
      </Tabs>
      {tabIndex === 0 ? (
        <Box display="flex" flexDirection="column" gap={1} p={1}>
          {doingTickets.length === 0 ? (
            <Typography variant="h3">Pas de tickets</Typography>
          ) : (
            doingTickets.map((t) => (
              <Box p={1} bgcolor="white">
                Intitulé: {t.title}
                <br />
                Description: {t.description}
                <br />
                Deadline: {t.deadline}
              </Box>
            ))
          )}
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" gap={1} p={1}>
          {doneTickets.length === 0 ? (
            <Typography variant="h3">Pas de tickets</Typography>
          ) : (
            doneTickets.map((t) => (
              <Box p={1} bgcolor="white">
                Intitulé: {t.title}
                <br />
                Description: {t.description}
                <br />
                <Button>
                  <a href={t.pj} download>
                    Télécharger
                  </a>
                </Button>
              </Box>
            ))
          )}
        </Box>
      )}
      <LogoutButton />
    </div>
  );
};
export default FR;
