import { FormColumnSingle, TextField, SelectField } from './styles';
import { useFormContext } from 'react-hook-form';
import { Button } from '@mui/material';
import { useEvent } from '../providers/EventProvider';
import { CheckboxField } from '../components/form/components';

export default function FormContent() {
  const { event, display } = useEvent();
  const { watch } = useFormContext();
  const [employer, alumni_uva, alumni_other, student, other] = watch([
    'employer',
    'alumni_uva',
    'alumni_other',
    'student',
    'other']);

  const schools = [
    'College and Graduate School of Arts & Sciences',
    'School of Architecture',
    'School of Continuing and Professional Studies',
    'School of Education and Human Development',
    'Darden Graduate School of Business Administration',
    'School of Engineering and Applied Science',
    'Frank Batten School of Leadership and Public Policy',
    'School of Law',
    'McIntire School of Commerce',
    'School of Medicine',
    'School of Nursing',
    'School of Data Science',
  ]
  const employerNames = display.map(item => item['Employers Name']).filter(name => name.trim() !== '');

  const fields = watch();
  const anyChecked = Object.values(fields).some(Boolean);
  if (!anyChecked) return null;
  const isAlumni = alumni_uva || alumni_other;
  const emailLabel = student ? "Institution Email Address" : 'Email';

  return (
    <FormColumnSingle>
      <TextField name="name" label="Full Name" options={{ required: true }} />
      <TextField
        name="email"
        label={emailLabel}
        type="email"
        options={{ required: true }}
      />
      {employer && (
        <>
          {event.fields.includes('display') && !other ? (
            <SelectField
              name="company"
              label="Company"
              items={employerNames}
              options={{ required: true }}
            />
          ) : (
            <TextField
              name="company"
              label="Company"
              options={{ required: employer || alumni_uva || alumni_other }}
            />
          )}
          <TextField
            name="title"
            label="Job Title"
            options={{ required: employer || alumni_uva || alumni_other }}
          />
        </>
      )}
      {(alumni_other || student) && (
        <>
          <TextField name="university" label="University (Abbreviated i.e. JMU, VCU, etc.)" options={{ required: true }} />
        </>
      )}
      {isAlumni && (
        <>
          <TextField
            name="gradYear"
            label="Graduation Year"
            type="number"
            options={{ required: true }}
          />
          {alumni_uva && (
            <>
              <TextField
                name="uvaEmail"
                label="UVA Email Address"
                type="email"
                options={{ required: true }}
              />
              <SelectField
                name="school"
                label="School"
                items={schools}
                options={{ required: true }}
              />
            </>
          )}
        </>
      )}
      {other && (
        <>
          <TextField name="company" label="Company / Line 2 of Nametag" />
          <TextField name="title" label="Job Title / Line 3 of Nametag" />
          <TextField name="reason" label="Reason For Attending" />
        </>
      )}
      {student && (
        <>
          <CheckboxField
            name={'registered'}
            label={'Did You Register for This Event in Handshake?'}
          />
        </>
      )}
      <Button
        variant="contained"
        color="secondary"
        type="submit"
        disabled={!anyChecked}
        sx={{ mt: 3 }}
      >
        Submit
      </Button>
    </FormColumnSingle>
  );
}
