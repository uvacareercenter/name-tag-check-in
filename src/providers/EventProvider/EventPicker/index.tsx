import { useState, SyntheticEvent } from 'react';
import { Dialog, Tab, Tabs, IconButton } from '@mui/material';
import { DialogContent } from './styles';
import { useNotification } from '../../NotificationProvider';
import { useEvent } from '../';
import CloseIcon from '@mui/icons-material/Close';
import CreateEvent from './CreateEvent';
import SelectEvent from './SelectEvent';

export default function EventPicker({ open, setOpen }) {
  const { event } = useEvent();
  const setNotification = useNotification();
  const [activeTab, setActiveTab] = useState(0);

  const handleForceClose = ()  => {
    setOpen(false);
  };

  const handleClose = ()  => {
    if (!event) setNotification('Select or create an event before continuing');
    else setOpen(false);
  };

  const handleTabChange = (_: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <div style={{ position: 'relative' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Create Event" style={{ top: '0.3em' }} />
          <Tab label="Select Event" style={{ top: '0.3em' }} />
        </Tabs>
        <IconButton onClick={handleClose} style={{
          position: 'absolute', top: '0.4rem', right: '0.5rem' }}>
          <CloseIcon />
        </IconButton>
      </div>

        <DialogContent>
          <div style={{ display: activeTab === 0 ? 'block' : 'none' }}>
            <CreateEvent handleClose={handleForceClose} />
          </div>
          <div style={{ display: activeTab === 1 ? 'block' : 'none' }}>
            <SelectEvent open={open} handleClose={handleForceClose} />
          </div>
        </DialogContent>
    </Dialog>
);
}
