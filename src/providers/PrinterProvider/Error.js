import React from 'react';
import { Container } from '@mui/material';
import { Paper, Heading, Body, SubmitButton } from './styles';

const PrinterError = ({ onConfirm }) => (
  <Container maxWidth="md">
    <Paper>
      <Heading>Printer not found!</Heading>
      <Body>
        The application was unable to connect to a valid DYMO printer. Here are
        some debugging steps you can try:
      </Body>
      <ul>
        <li>
          <Body>Ensure the blue light on the printer is lit.</Body>
        </li>
        <li>
          <Body>
            In Windows, under Control Panel > View devices and printers ensure
            the printer (likely DYMO LabelWriter 450 Turbo) is displayed, is set
            as the default printer, and there is only one copy of DYMO
            LabelWriter showing in the printer list. If any of these conditions
            exist, restart the computer.
          </Body>
        </li>
        <li>
          <Body>
            In the taskbar, ensure the DYMO Label Web Service is running.
          </Body>
        </li>
      </ul>
      <Body>
        If this does not solve the issue, contact support.
        <br />
        <br />
        Though printing will not work, saving data to the server will still work
        as expected. If desired, the application can be accessed in this mode.
      </Body>
      <SubmitButton onClick={onConfirm}>Proceed</SubmitButton>
    </Paper>
  </Container>
);

export default PrinterError;
