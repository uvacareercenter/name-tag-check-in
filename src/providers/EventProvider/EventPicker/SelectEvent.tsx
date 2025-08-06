import { useEffect, useMemo, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Typography,
  IconButton, Button,
  List, ListItem, ListItemText, ListItemButton,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import {
  Delete as DeleteIcon,
  QueuePlayNext as DisplayIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import axios from 'axios';
import Spinner from '../../../components/Spinner';
import { useEvent } from '../';
import Display from '../Dialogs/Display/Display';
import Admin from '../Dialogs/Admin/Admin';
import { EventType } from '../'

export default function SelectEvent({ open, handleClose }) {
  const { getAccessTokenSilently } = useAuth0();
  const { event, setEvent, events, updateEvents } = useEvent();
  const [display, setDisplay] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<EventType | null>(null);
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // Re-fetching events on dialog open
  useEffect(() => {
    if (open) {
      updateEvents().catch(error => console.error('Failed to update events:', error));
    }
  }, [open, updateEvents]);

  return useMemo(() => {
    const handleSelectEvent = (selectedEvent: EventType) => {
      if (!event || selectedEvent.id !== event.id) {
        setEvent(selectedEvent);
        handleClose();
      }};

    const handleConfirmDeleteOpen = (event: EventType) => {
      setConfirmDeleteOpen(event);
    };

    const handleDelete = async () => {
      const token = await getAccessTokenSilently();
      await axios.delete('/api/events', {
        params: { id: confirmDeleteOpen.id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEvent(null);
      await updateEvents();
      setConfirmDeleteOpen(null);
    };

    const handleDisplayClick = (selectedEvent: EventType) => {
      if (!event || selectedEvent.id !== event.id) {
        setEvent(selectedEvent);
      }
      setDisplay(true);
    };

    const handleAdminClick = (selectedEvent: EventType) => {
      if (!event || selectedEvent.id !== event.id) {
        setEvent(selectedEvent);
      }
      setAdmin(true);
    };

    if (!events) return <Spinner />;
    if (!events.length)
      return (
        <Typography variant="subtitle1" align="center">
          No events have been created yet - try creating one above.
        </Typography>
      );
    return (
      <>
        <List>
          {events
            .sort((a, b) => {
              const today = new Date();
              const aDiff = Math.abs(new Date(a.startDate).getTime() - today.getTime());
              const bDiff = Math.abs(new Date(b.startDate).getTime() - today.getTime());
              return aDiff - bDiff;
            })
            .map((listEvent) => {
              let dateText = `${listEvent.startDate.toDateString()}`
              if (listEvent.startDate.getTime() !== listEvent.endDate.getTime())
                dateText = `${listEvent.startDate.toDateString()} - ${listEvent.endDate.toDateString()}`;

              return (
                <ListItem
                  key={listEvent.id}
                  secondaryAction={
                    <>
                      {listEvent.fields.includes('display') &&
                        currentDate >= listEvent.startDate && currentDate <= listEvent.endDate && (
                          <>
                            <IconButton onClick={() => handleAdminClick(listEvent)}>
                              <AdminIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDisplayClick(listEvent)}>
                              <DisplayIcon />
                            </IconButton>
                          </>
                        )}
                      <IconButton edge="end" onClick={() => handleConfirmDeleteOpen(listEvent)}>
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                  disablePadding
                >
                  <ListItemButton
                    selected={event && event.id === listEvent.id}
                    onClick={() => handleSelectEvent(listEvent)}
                  >
                    <ListItemText
                      primary={listEvent.label}
                      secondary={dateText}
                      style={{ maxWidth: '80%', whiteSpace: 'nowrap' }}
                      sx={{
                        maxWidth: '80%',
                        whiteSpace: 'nowrap',
                        '& .MuiTypography-root': {
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        },
                        '& .MuiTypography-secondary': {
                          whiteSpace: 'pre-line',
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
        </List>
        {display &&
          <Display open={display} setOpen={setDisplay} />
        }
        {admin &&
          <Admin open={admin} setOpen={setAdmin} />
        }

        <Dialog open={!!confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(null)}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete the event "{confirmDeleteOpen?.label}"?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDeleteOpen(null)}>Cancel</Button>
            <Button onClick={handleDelete} color="secondary">Delete</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }, [
    admin,
    event,
    events,
    display,
    setEvent,
    currentDate,
    handleClose,
    updateEvents,
    confirmDeleteOpen,
    getAccessTokenSilently]);
}
