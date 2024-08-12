import styled from '@emotion/styled';
import {
  TextField as FormTextField,
  SelectField as FormSelectField,
} from '../components/form/components';

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

export const TextField = (props) => (
  <FormTextField
    fullWidth
    variant="outlined"
    style={{ marginTop: '1em' }}
    {...props}
  />
);

export const SelectField = (props) => (
  <FormSelectField
    fullWidth
    variant="outlined"
    style={{ marginTop: '1em' }}
    {...props}
  />
);
