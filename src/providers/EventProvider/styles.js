import React from 'react';
import styled from '@emotion/styled';
import { IconButton } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const SettingsButton = styled((props) => (
  <IconButton edge="start" color="inherit" {...props}>
    <SettingsIcon />
  </IconButton>
))`
  margin-right: 0.5em !important;
`;
