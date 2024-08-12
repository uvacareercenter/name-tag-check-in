import React, { createContext, useContext } from 'react';
import { SnackbarProvider, useSnackbar } from 'notistack';

const NotificationContext = createContext((_message) => {});
// Custom hook that exposes a useNotification function
// which any component can call to display a Snackbar notification
export const useNotification = () => useContext(NotificationContext);

const InnerNotificationProvider = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();

  return (
    <NotificationContext.Provider value={enqueueSnackbar}>
      {children}
    </NotificationContext.Provider>
  );
};

// Wrap the NotificationProvider with SnackbarProvider
const NotificationProvider = ({ children, ...props }) => (
  <SnackbarProvider autoHideDuration={5000} preventDuplicate={true}
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
