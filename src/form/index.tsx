import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useForm, FormProvider } from 'react-hook-form';
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
      alumni_uva: false,
      alumni_other: false,
      student: false,
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

  const onSubmit = async (data: any) => {
    const isAnySelected = Object.values(data).some(value => value === true);
    if (!isAnySelected) {
      setNotification('Please select at least one attendee type');
      return;
    }

    console.log(data);

    const {
      employer,
      alumni_uva,
      alumni_other,
      student,
      parent,
      other,
      name,
      company,
      title,
      university,
      gradYear
    } = data;

    let line2 = '';
    let line3 = '';

    if (event.fields.includes('nameTags')) {

      // Employer + Alumni
      if (employer && (alumni_uva || alumni_other)) {
        line2 = company;
        if (alumni_uva) {
          line3 = `University of Virginia class of ${gradYear}`;
        } else {
          line3 = `${university} class of ${gradYear}`;
        }

      // Employer
      } else if (employer) {
        line2 = company || '';
        line3 = title || '';

      // UVA Alumni
      } else if (alumni_uva) {
        line2 = `University of Virginia Alumni`;
        line3 = `Class of ${gradYear}`;

      // Other Alumni
      } else if (alumni_other) {
        line2 = `${university} Alumni`;
        line3 = `Class of ${gradYear}`;

      // Student
      } else if (student) {
        line2 = university;
        line3 = 'Student';

      // Other or Parent
      } else if (other || parent) {
        line2 = '';
        line3 = '';
      }
      print(name, line2, line3);
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
      </FormContainer>
    </FormProvider>
  );
}
