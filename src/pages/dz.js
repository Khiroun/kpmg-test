import LogoutButton from "@/components/LogoutButton";
import { getTickets, updateTask, uploadFile } from "@/firebase";
import {
  Box,
  Button,
  Tab,
  Tabs,
  Typography,
  Modal,
  Input,
  CircularProgress,
  InputLabel,
} from "@mui/material";
import { useState, useEffect } from "react";

const DZ = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState("");
  const [currentTask, setCurrentTask] = useState("");
  const [tickets, setTickets] = useState([]);
  const doneTickets = tickets.filter((t) => t.status === "done");
  const doingTickets = tickets.filter((t) => t.status !== "done");
  const handleClose = () => setOpen(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const pj = data.get("pj");
    setSubmitting(true);
    const ticket = tickets.find((t) => t.id === currentTask);
    const rest = tickets.filter((t) => t.id !== currentTask);
    setTickets([{ ...ticket, status: "done" }, ...rest]);
    uploadFile(`${currentTask}/${pj.name}`)
      .then((url) => {
        return updateTask(currentTask, {
          status: "done",
          pj: url,
        });
      })
      .finally(() => {
        setSubmitting(false);
        setOpen(false);
      });
  };
  useEffect(() => {
    getTickets().then((tickets) => setTickets(tickets));
  }, []);
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };
  return (
    <div>
      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab label="Tickets en cours" />
        <Tab label="Tickets faits" />
      </Tabs>
      {tabIndex === 0 ? (
        <Box display="flex" flexDirection="column" gap={1} p={1}>
          {doingTickets.length === 0 ? (
            <Typography variant="h3">Pas de tickets</Typography>
          ) : (
            doingTickets.map((t) => {
              return (
                <Box
                  p={1}
                  bgcolor="white"
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    Intitulé: {t.title}
                    <br />
                    Description: {t.description}
                    <br />
                    Deadline: {t.deadline}
                  </Box>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      setCurrentTask(t.id);
                      setOpen(true);
                    }}
                  >
                    Réaliser
                  </Button>
                </Box>
              );
            })
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
          {submitting ? (
            <CircularProgress />
          ) : (
            <>
              <InputLabel>Ajouter une pièce jointe</InputLabel>
              <Input type="file" required fullWidth name="pj" />

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
    </div>
  );
};
export default DZ;
