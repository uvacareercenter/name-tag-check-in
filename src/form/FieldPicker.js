import { CheckboxField } from '../components/form/components';
import { Typography } from '@mui/material';
import { useEvent } from '../providers/EventProvider';

const fieldTypes = [
  { name: 'employer', label: 'Employer' },
  { name: 'alumni', label: 'Alumni' },
  { name: 'parent', label: 'Parent' },
];

export default function FieldPicker() {
  const { event } = useEvent();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '1rem',
      }}
    >
      <Typography variant="subtitle1">Select all that apply:</Typography>
      <div>
        {fieldTypes.map((type) => (
          event.fields.includes(type.name) && (
            <CheckboxField
              key={type.name}
              name={type.name}
              label={type.label}
            />
          )
        ))}
      </div>
    </div>
  );
}
