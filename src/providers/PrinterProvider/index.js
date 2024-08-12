import React, { useState, useEffect, useContext, createContext } from 'react';
import { useKonami } from 'react-konami-code';

import Error from './Error';
import labelXML from './labelXML';

const defaultPrint = () => {
  console.error("Print function called without a printer being initialized.");
};

const PrinterContext = createContext(defaultPrint);
export const usePrinter = () => useContext(PrinterContext);

const PrinterProvider = ({ children }) => {
  const [printer, setPrinter] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    // Logs Dymo debug messages
    // window.dymo.label.framework.trace = 1;

    const getPrinter = async () => {
      const printers = await window.dymo.label.framework.getPrintersAsync();

      if (!printers.length) {
        throw new Error('No printers found');
      } else {
        setPrinter(printers[0]);
        setStatus('ready');
      }
    };

    getPrinter().catch((e) => {
      console.error(e);
      setStatus('error');
    });
  }, []);

  const print = (first = '', second = '', third = '') => {
    if (status !== 'ready' || !printer) {
      console.log('No printer ready, not printing');
      return;
    }

    const label = window.dymo.label.framework.openLabelXml(labelXML);

    label.setObjectText('Name', first);
    label.setObjectText('Company', second);
    label.setObjectText('Year', third);

    label.printAsync(printer.name);
  };
  // Exposing to global context (for potential debug usage in devtools)
  window.printLabel = print;

  useKonami(() => {
    print('f', 'f', 'f');
  });

  if (status === 'loading') return <div />;
  if (status === 'error') return <Error onConfirm={() => setStatus('ready')} />;

  return (
    <PrinterContext.Provider value={print}>{children}</PrinterContext.Provider>
  );
};

export default PrinterProvider;
