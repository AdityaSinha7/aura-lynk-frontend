import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  Paper, 
  Typography,
  IconButton,
  ListItemSecondaryAction,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ChatSession } from '../../types/chat';

interface SessionListProps {
  sessions: ChatSession[];
  currentSessionId: number;
  onSessionSelect: (session: ChatSession) => void;
  onSessionDelete: (sessionId: number) => void;
  onSessionRename: (sessionId: number) => void;
}

export const SessionList: React.FC<SessionListProps> = ({
  sessions,
  currentSessionId,
  onSessionSelect,
  onSessionDelete,
  onSessionRename,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [sessionToDelete, setSessionToDelete] = React.useState<number | null>(null);

  const handleDeleteClick = (sessionId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setSessionToDelete(sessionId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (sessionToDelete) {
      onSessionDelete(sessionToDelete);
    }
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Paper sx={{ width: 240, height: '100%', overflow: 'auto' }}>
        <List>
          {sessions.map((session) => (
            <ListItem 
              key={session.id} 
              disablePadding
              secondaryAction={
                <Box>
                  <IconButton
                    edge="end"
                    aria-label="rename"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSessionRename(session.id);
                    }}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    edge="end" 
                    aria-label="delete"
                    onClick={(e) => handleDeleteClick(session.id, e)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemButton 
                selected={session.id === currentSessionId}
                onClick={() => onSessionSelect(session)}
              >
                <ListItemText 
                  primary={session.sessionName}
                  secondary={new Date(session.lastMessageAt).toLocaleString()}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        {sessions.length === 0 && (
          <Typography sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
            No chat sessions
          </Typography>
        )}
      </Paper>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Chat Session</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this chat session? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}; 