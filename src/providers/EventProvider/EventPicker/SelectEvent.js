import React, { useEffect, useMemo, useState } from 'react';
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

export default function SelectEvent({ open, handleClose }) {
  const { getAccessTokenSilently } = useAuth0();
  const { event, setEvent, events, updateEvents } = useEvent();
  const [display, setDisplay] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const currentDate = new Date().setHours(0, 0, 0, 0);

  // Re-fetching events on dialog open
  useEffect(() => {
    if (open) updateEvents();
  }, [open, updateEvents]);

  return useMemo(() => {
    const handleSelectEvent = (selectedEvent) => {
      if (!event || selectedEvent.id !== event.id) {
        setEvent(selectedEvent);
        handleClose();
      }};

    const handleConfirmDeleteOpen = (event) => {
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
      updateEvents();
      setConfirmDeleteOpen(false);
    };

    const handleDisplayClick = (selectedEvent) => {
      if (!event || selectedEvent.id !== event.id) {
        setEvent(selectedEvent);
      }
      setDisplay(true);
    };

    const handleAdminClick = (selectedEvent) => {
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
              const aDiff = Math.abs(new Date(a.startDate) - today);
              const bDiff = Math.abs(new Date(b.startDate) - today);
              return aDiff - bDiff;
            })
            .map((listEvent) => {
              let dateText = `${listEvent.startDate.toDateString()}`
              if (listEvent.startDate.getTime() !== listEvent.endDate.getTime())
                dateText = `${listEvent.startDate.toDateString()} - ${listEvent.endDate.toDateString()}`;

              return (
                <ListItem
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
                    key={listEvent.id}
                    button
                    selected={event && event.id === listEvent.id}
                    onClick={() => handleSelectEvent(listEvent)}
                  >
                    <ListItemText
                      primary={listEvent.label}
                      secondary={dateText}
                      style={{ maxWidth: '80%', whiteSpace: 'nowrap' }}
                      primaryTypographyProps={{
                        style: { overflow: 'hidden', textOverflow: 'ellipsis' }
                      }}
                      secondaryTypographyProps={{
                        style: { whiteSpace: 'pre-line' },
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

        <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete the event "{confirmDeleteOpen?.label}"?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
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
