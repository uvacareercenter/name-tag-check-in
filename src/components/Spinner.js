import { CircularProgress } from '@mui/material';

export default function Spinner() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress />
    </div>
  );
}
