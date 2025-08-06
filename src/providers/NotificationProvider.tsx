import { createContext, useContext, ReactNode } from 'react';
import { SnackbarProvider, useSnackbar, SnackbarMessage, OptionsObject, SnackbarKey } from 'notistack';

type NotificationFunction = (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey;

const NotificationContext = createContext<NotificationFunction>(() => {
  return '' as SnackbarKey;
});

export const useNotification = () => useContext(NotificationContext);

const InnerNotificationProvider = ({ children }: { children: ReactNode }) => {
  const { enqueueSnackbar } = useSnackbar();

  return (
    <NotificationContext.Provider value={enqueueSnackbar}>
      {children}
    </NotificationContext.Provider>
  );
};

const NotificationProvider = ({ children, ...props }: { children: ReactNode }) => (
  <SnackbarProvider
    autoHideDuration={5000}
    preventDuplicate={true}
    maxSnack={10}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    {...props}
  >
    <InnerNotificationProvider>{children}</InnerNotificationProvider>
  </SnackbarProvider>
);

export default NotificationProvider;
