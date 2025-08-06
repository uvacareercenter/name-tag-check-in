import { useState, useContext, createContext, useCallback, useEffect, Dispatch, SetStateAction } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import axios from 'axios';
import { Container, SettingsButton } from './styles';
import EventPicker from './EventPicker';

export type EventType = {
  id: string;
  label: string;
  startDate: Date;
  endDate: Date;
  creationDate: Date;
  fields: string[];
};

interface EventContextType {
  event: EventType | null;
  setEvent: Dispatch<SetStateAction<EventType | null>>;
  events: EventType[] | null;
  setEvents: Dispatch<SetStateAction<EventType[] | null>>;
  updateEvents: () => Promise<void>;
  display: any[];
}

const defaultEventContext: EventContextType = {
  event: null,
  setEvent: () => {},
  events: null,
  setEvents: () => {},
  updateEvents: async () => {},
  display: [],
};

const EventContext = createContext(defaultEventContext);
export const useEvent = () => useContext(EventContext);

export default function EventProvider({ children }) {
  const { getAccessTokenSilently } = useAuth0();

  const [dialogOpen, setDialogOpen] = useState(true);
  const [event, setEvent] = useState(null);
  const [events, setEvents] = useState(null);
  const [display, setDisplay] = useState([]);

  const updateEvents = useCallback(async () => {
    const token = await getAccessTokenSilently();

    const response = await axios.get('/api/events', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const events = response.data.data.map((event: EventType) => ({
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
      creationDate: new Date(event.creationDate),
      fields: event.fields,
    }));

    setEvents(events);
  }, [getAccessTokenSilently]);

  const fetchDisplayData = useCallback(async () => {
    if (!event || !event.id || !event.fields.includes('display')) return;

    const token = await getAccessTokenSilently();

    const response = await axios.get(`/api/events/uploads/${event.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { data, imageUrls } = response.data;
    const nameToImageMap = imageUrls.reduce((map: Record<string, string>, url: string) => {
      const match = url.match(/\/([^/]+)\.(png|jpg|jpeg|svg)$/i);
      if (match) {
        map[match[1].toLowerCase()] = url;
      }
      return map;
    }, {});

    const updatedData = data
      .filter((item: any) => item['Employers Name'].trim() !== '')
      .map((item: any) => {
        const name = item['Employers Name'].toLowerCase();
        const imageUrl = nameToImageMap[name];
        return {
          ...item,
          imageUrl: imageUrl || "/api/uploads/logos/default.png",
        };
      });

    setDisplay(updatedData);
  }, [event, getAccessTokenSilently]);

  useEffect(() => {
    fetchDisplayData().then();
    const interval = setInterval(fetchDisplayData, 2000);
    return () => clearInterval(interval);
  }, [fetchDisplayData]);

  const handleSettingsClick = () => {
    setDialogOpen(true);
  };

  return (
    <EventContext.Provider
      value={{ event, setEvent, events, setEvents, updateEvents, display }}
    >
      <EventPicker open={dialogOpen} setOpen={setDialogOpen} />
      <Container>
        <AppBar position="relative">
          <Toolbar>
            <SettingsButton onClick={handleSettingsClick} />
            <Typography
              variant="h5"
              style={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                margin: '0 auto'
              }}
            >
              {event ? event.label : 'UVA Career Center'}
            </Typography>
          </Toolbar>
        </AppBar>
        {children}
      </Container>
    </EventContext.Provider>
  );
}
