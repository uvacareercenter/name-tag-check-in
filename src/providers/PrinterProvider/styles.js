import React from 'react';
import styled from '@emotion/styled';
import { Paper as MuiPaper, Typography, Button } from '@mui/material';

export const Paper = styled(MuiPaper)`
  margin-top: 2em;
  padding: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Heading = styled((props) => (
  <Typography variant="h3" component="h1" {...props} />
))`
  margin-bottom: 2rem !important;
`;

export const Body = styled((props) => (
  <Typography variant="body1" component="p" {...props} />
))`
  font-size: 1.3em !important;
`;

export const SubmitButton = styled((props) => (
  <Button color="secondary" variant="contained" {...props} />
))`
  margin-top: 2rem !important;
`;
