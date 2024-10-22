import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '@mui/material';
import axios from 'axios';
import { FormContainer } from './styles';
import FieldPicker from './FieldPicker';
import FormContent from './FormContent';
import { useEvent } from '../providers/EventProvider';
import { useNotification } from '../providers/NotificationProvider';
import { usePrinter } from '../providers/PrinterProvider';

export default function Form() {
  const { getAccessTokenSilently } = useAuth0();

  const { event } = useEvent();

  const methods = useForm({
    defaultValues: {
      employer: false,
      alumni: false,
      parent: false,
      other: false,
    },
  });
  const { handleSubmit, reset } = methods;
  const setNotification = useNotification();
  const print = usePrinter();

  // Reset the form on event change
  useEffect(() => {
    reset();
  }, [event, reset]);

  const onSubmit = async (data) => {
    if (!(data.employer || data.alumni || data.parent || data.other)) {
      setNotification('Please select at least one attendee type');
      return;
    }

    console.log(data);

    if (event.fields.includes('nameTags')) {
      if (data.alumni) {
        print(data.name, data.company, `Class of ${data.gradYear}`);
      } else if (data.employer) {
        print(data.name, data.company, data.title);
      } else {
        print(data.name);
      }
    }

    const token = await getAccessTokenSilently();

    await axios.post(
      '/api/submission',
      { submission: data, event },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    reset();
  };

  if (!event) return <div />;
  return (
    <FormProvider {...methods}>
      <FormContainer autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <FieldPicker />
        <FormContent />
        <Button variant="contained" color="secondary" type="submit">
          Submit
        </Button>
      </FormContainer>
    </FormProvider>
  );
}
