import { useState, useEffect, useContext, createContext, useCallback } from 'react';
import { Snackbar, Alert, Button } from '@mui/material';
import { useEvent } from '../EventProvider';

import labelXML from './labelXML';

type PrintFunction = (first?: string, second?: string, third?: string) => void;

const defaultPrint = () => {
  console.error("Print function called without a printer being initialized.");
};

const PrinterContext = createContext<PrintFunction>(defaultPrint);
export const usePrinter = () => useContext(PrinterContext);

const PrinterProvider = ({ children }) => {
  const [printer, setPrinter] = useState(null);
  const [status, setStatus] = useState('loading');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [printerFound, setPrinterFound] = useState(false);

  const { event } = useEvent();

  const hasNameTags = event?.fields?.includes('nameTags');

  const checkPrinter = useCallback(async () => {
    if (!hasNameTags) {
      setPrinter(null);
      setStatus('idle');
      setPrinterFound(false);
      setSnackbarOpen(false);
      return;
    }

    try {
      const devices = await navigator.usb.getDevices();

      const dymoConnected = devices.some((device: any) =>
        device.productName?.toLowerCase().includes('dymo')
      );

      if (dymoConnected) {
        const printers = await window.dymo.label.framework.getPrintersAsync();
        const found = printers[0] || null;

        setPrinter(found);
        setStatus(found ? 'ready' : 'error');
        setPrinterFound(found !== null);
        setSnackbarOpen(true);
      } else {
        setPrinter(null);
        setStatus('error');
        setPrinterFound(false);
        setSnackbarOpen(true);
      }
    } catch (e) {
      console.warn('USB or DYMO printer check failed:', e);
      setPrinter(null);
      setStatus('error');
      setPrinterFound(false);
      setSnackbarOpen(true);
    }
  }, [hasNameTags]);

  const requestPrinterAccess = async () => {
    if (!hasNameTags) return;

    try {
      const device = await navigator.usb.requestDevice({
        filters: [{ vendorId: 0x0922 }]
      });
      console.log('User granted access to device:', device);
      await checkPrinter();
    } catch (error) {
      console.error('User denied USB device access or error:', error);
    }
  };

  useEffect(() => {
    if (!hasNameTags) return;

    checkPrinter().catch(console.error);

    navigator.usb.addEventListener('connect', () => {
      checkPrinter().catch(console.error);
    });
    navigator.usb.addEventListener('disconnect', () => {
      checkPrinter().catch(console.error);
    });

    return () => {
      navigator.usb.removeEventListener('connect', checkPrinter);
      navigator.usb.removeEventListener('disconnect', checkPrinter);
    };
  }, [checkPrinter, hasNameTags]);

  const print = async (first = '', second = '', third = '') => {
    if (status !== 'ready' || !printer) {
      console.log('No printer ready, not printing');
      return;
    }

    const label = window.dymo.label.framework.openLabelXml(labelXML);
    label.setObjectText('Name', first);
    label.setObjectText('Company', second);
    label.setObjectText('Year', third);

    try {
      await label.printAsync(printer.name);
    } catch (error) {
      console.error('Print failed:', error);
    }
  };

  window.printLabel = print;

  return (
    <>
      <PrinterContext.Provider value={print}>
        {children}
      </PrinterContext.Provider>

      {hasNameTags && (
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={printerFound ? 3000 : null}
          onClose={(_, reason) => {
            if (reason === 'clickaway') return;
            setSnackbarOpen(false);
          }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            severity={printerFound ? 'success' : 'info'}
            onClose={() => setSnackbarOpen(false)}
            sx={{ width: '100%' }}
            action={
              !printerFound ? (
                <Button
                  color="inherit"
                  size="small"
                  onClick={requestPrinterAccess}
                >
                  Connect to printer
                </Button>
              ) : null
            }
          >
            {printerFound
              ? 'DYMO Printer found!'
              : 'DYMO Printer not found. Name tags will not print.'}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default PrinterProvider;