import * as React from 'react';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';

type SnackbarProps = {
  open: boolean;
  message: string;
  onClose: (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => void;
};

export default function SnackbarComponent({
  open,
  message,
  onClose,
}: SnackbarProps) {
  const action = (
    <>
      <Button color="secondary" size="small" onClick={onClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={onClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      message={message}
      action={action}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    />
  );
}
