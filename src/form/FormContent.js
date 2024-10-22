import { FormColumnSingle, TextField, SelectField } from './styles';
import { useFormContext } from 'react-hook-form';
import { useEvent } from '../providers/EventProvider';

export default function FormContent() {
  const { event, display } = useEvent();
  const { watch } = useFormContext();
  const [employer, alumni, parent, other] = watch(['employer', 'alumni', 'parent', 'other']);
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

  if (!(employer || alumni || parent || other)) return null;
  return (
    <FormColumnSingle>
      <TextField name="name" label="Full Name" options={{ required: true }} />
      <TextField
        name="email"
        label="Email"
        type="email"
        options={{ required: true }}
      />
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
          options={{ required: employer || alumni || other }}
        />
      )}
      <TextField
        name="title"
        label="Job Title"
        options={{ required: employer || alumni || other }}
      />
      {alumni && (
        <>
          <TextField name="uvaEmail" label="UVA Email Address" type="email" />
          <TextField
            name="gradYear"
            label="Graduation Year"
            type="number"
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
    </FormColumnSingle>
  );
}
