import {
  DialogContent as MuiDialogContent,
} from '@mui/material';
import { styled } from '@mui/material/styles';

export const DialogContent = styled(MuiDialogContent)(({ theme }) => ({
  padding: theme.spacing(2),
}));
