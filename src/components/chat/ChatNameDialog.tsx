import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material';

interface ChatNameDialogProps {
  open: boolean;
  defaultName?: string;
  onClose: () => void;
  onSave: (name: string) => void;
}

export const ChatNameDialog: React.FC<ChatNameDialogProps> = ({
  open,
  defaultName = '',
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(defaultName);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Chat Name</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Enter chat name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSave()}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} disabled={!name.trim()}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}; 