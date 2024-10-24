import { useAuth0 } from '@auth0/auth0-react';
import { useEvent } from '../';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { Typography, Button, Tooltip } from '@mui/material';
import { TextField, CheckboxField } from '../../../components/form/components';
import axios from 'axios';
import { useNotification } from '../../NotificationProvider';
import { saveAs } from 'file-saver';
import { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers';

const userTypes = [
  { name: 'employer', label: 'Employer' },
  { name: 'alumni', label: 'Alumni' },
  { name: 'parent', label: 'Parent' },
  { name: 'other', label: 'Other' },
];

const eventFeatures = [
  { name: 'nameTags',
    label: 'Name Tags',
    tooltip: 'Do you want this event to print a corresponding name tag?'
  },
  { name: 'display',
    label: 'Display',
    tooltip: 'Do you want to display checked-in employers on the TV?'
  }
];

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: 'auto',
  padding: '0.5em 1em'
};

const sectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

export default function CreateEvent({ handleClose }) {
  const { getAccessTokenSilently } = useAuth0();
  const { setEvent, updateEvents } = useEvent();
  const addNotification = useNotification();

  const methods = useForm({
    defaultValues: {
      fields: {
        employer: true,
        alumni: true,
        parent: false,
        other: true,
        nameTags: true,
        display: false
      },
    },
  });

  const { control, handleSubmit, reset, register } = methods;
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [fileName, setFileName] = useState('');
  const watchDisplay = useWatch({ name: 'fields.display', control: control });
  const csvFile = useWatch({ name: 'csvFile', control: control });

  const downloadCSV = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get('../api/uploads/event_template.csv', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'text/csv' });
      saveAs(blob, 'event_template.csv');
    } catch (error) {
      console.error('Error downloading the CSV file:', error);
      addNotification('Failed to download CSV file');
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formatName = file.name.length > 20
        ? `${file.name.slice(0, 12)}...${file.name.slice(-8)}`
        : file.name;
      setFileName(formatName);
    }
  };

  const onSubmit = async (data) => {
    let error = false;
    const { fields } = data;

    if (!(fields.employer || fields.alumni || fields.parent || fields.other)) {
      addNotification('At least one user type must be selected');
      error = true;
    }

    if (startDate < new Date().setHours(0, 0, 0, 0)) {
      addNotification('Start date cannot be earlier than today');
      error = true;
    }

    if (startDate > endDate) {
      addNotification('End date must be after start date');
      error = true;
    }

    if (fields.display && (!csvFile || csvFile.length === 0)) {
      addNotification('Please upload a CSV file for display');
      error = true;
    }

    if (csvFile && fileName.slice(-4) !== '.csv') {
      addNotification('File is not a CSV');
      error = true;
    }

    if (error === true) {
      return
    }

    const activeFields = Object.entries(fields)
      .filter(([, value]) => value)
      .map(([key]) => key);

    const cleanLabel = data.eventName
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-_]/g, '')
      .toLowerCase();

    const formData = new FormData();
    formData.append('name', cleanLabel);
    formData.append('label', data.eventName);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    activeFields.forEach(field => formData.append('fields[]', field));

    if (fields.display && csvFile && csvFile.length > 0) {
      formData.append('csvFile', csvFile[0]);
    }

    const token = await getAccessTokenSilently();

    const response = await axios.post('/api/events', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const newEvent = response.data.data;

    await updateEvents();
    setEvent(newEvent);
    reset();
    handleClose();
  };

  return (
    <FormProvider {...methods}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <form
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          style={formStyle}>

          <TextField
            name="eventName"
            label="Event Name"
            options={{ required: true }}
            variant="outlined"
            style={{ minWidth: 300, margin: '0 0 1.5rem 0' }}
          />

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            width: '90%',
            marginBottom: '1rem' }}
          >
            <DatePicker
              label="Start Date"
              value={startDate || null}
              minDate={Date.now() || null}
              options={{ required: true }}
              onChange={(newDate) => setStartDate(newDate)}
              renderInput={(params) => <TextField {...params} />}
            />
            <Typography>–</Typography>
            <DatePicker
              label="End Date"
              value={endDate || null}
              minDate={startDate || null}
              options={{ required: true }}
              onChange={(newDate) => setEndDate(newDate)}
              renderInput={(params) => <TextField {...params} />}
            />
          </div>


          <div style={sectionStyle}>
            <Typography variant="h6">Check-in Users</Typography>
            <div>
              {userTypes.map((type) => (
                <CheckboxField
                  key={type.name}
                  name={`fields.${type.name}`}
                  label={type.label}
                />
              ))}
            </div>
          </div>

          <div style={sectionStyle}>
            <Typography variant="h6">Event Features</Typography>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {eventFeatures.map((feature) => (
                <Tooltip title={feature.tooltip} key={feature.name}>
                  <div>
                    <CheckboxField
                      name={`fields.${feature.name}`}
                      label={feature.label} />
                  </div>
                </Tooltip>
              ))}
            </div>
          </div>

          {watchDisplay && (
            <div style={sectionStyle}>
              <Typography variant="h6">Upload CSV</Typography>
              <Button variant="contained" onClick={downloadCSV}
                      style={{ margin: '1em 0' }}
              >
                Download Template
              </Button>

              <Button variant="contained" component="label"
                      style={{ backgroundColor: 'gray', margin: '0 0 1em' }}>
                Upload File
                <input
                  type="file"
                  accept=".csv"
                  {...register("csvFile", {
                    onChange: (e) => { handleFileChange(e); }
                  })}
                  hidden
                />
              </Button>
              {fileName &&
                <span style={{marginBottom: '1rem'}}>
                  File selected: {fileName}
                </span>}
            </div>
          )}

          <Button variant="contained" color="secondary" type="submit"
                  style={{ margin: '0.5em 0', padding: '0.5em', width: '50%' }}
          >
            Create
          </Button>
        </form>
      </LocalizationProvider>
    </FormProvider>
  );
}
