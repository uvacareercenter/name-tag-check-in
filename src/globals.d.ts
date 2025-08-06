export {};

declare global {
  interface Navigator {
    usb?: any;
  }
  interface Window {
    dymo?: {
      label: {
        framework: {
          getPrintersAsync(): Promise<{ name: string }[]>;
          openLabelXml(labelXml: string): {
            setObjectText(objectName: string, text: string): void;
            printAsync(printerName: string): Promise<void>;
          };
        };
      };
    };
    printLabel?: (first?: string, second?: string, third?: string) => void;
  }
}
