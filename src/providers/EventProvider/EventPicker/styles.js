import {
  DialogContent as MuiDialogContent,
} from '@mui/material';
import { withStyles } from '@mui/styles';

export const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);
