import styled from '@emotion/styled';
import {
  TextField as FormTextField,
  SelectField as FormSelectField,
} from '../components/form/components';
import { RegisterOptions } from 'react-hook-form';

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const FormColumnSingle = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2em;
  width: 25em;
  align-items: center;
`;

export const TextField = ({ ...props }: {
    name: any;
    label?: string;
    type?: string;
    options?: RegisterOptions;
    disabled?: boolean;
  },
) => (
  <FormTextField
    fullWidth
    variant="outlined"
    style={{ marginTop: '1em' }}
    {...props}
  />
);

export const SelectField = ({ ...props }: {
  name: any;
  label?: string;
  options?: RegisterOptions;
  items: any;
}) => (
  <FormSelectField
    fullWidth
    variant="outlined"
    disabled={false}
    style={{ marginTop: '1em' }}
    {...props}
  />
);

