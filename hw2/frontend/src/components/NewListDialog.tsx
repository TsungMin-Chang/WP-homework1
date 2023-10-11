import { useRef } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Box from '@mui/material/Box';

import useCards from "@/hooks/useCards";
import { createList } from "@/utils/client";

type NewListDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function NewListDialog({ open, onClose }: NewListDialogProps) {
  // using a ref to get the dom element is one way to get the value of a input
  // another way is to use a state variable and update it on change, which can be found in CardDialog.tsx
  const textfieldName = useRef<HTMLInputElement>(null);
  const textfieldDescription = useRef<HTMLInputElement>(null);
  const { lists, fetchLists } = useCards();
  const existedListNames = lists.map((list) => {return list.name})

  const handleAddList = async () => {
    if (!textfieldName.current!.value) {
      alert("Name cannot be blank!")
      return;
    }
    if (!textfieldDescription.current!.value) {
      alert("Description cannot be blank!")
      return;
    }
    if (existedListNames.includes(textfieldName.current!.value)) {
      alert("This name has been used by another list! Please choose another name.");
      return;
    }
    try {
      await createList({ name: textfieldName.current!.value, description: textfieldDescription.current!.value });
      fetchLists();
    } catch (error) {
      alert("Error: Failed to create list");
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add a list</DialogTitle>
      <DialogContent>
        <TextField
          inputRef={textfieldName}
          label="List Name"
          variant="outlined"
          sx={{ mt: 2 }}
          autoFocus
        />
        <br />
        <Box
          sx={{
            width: 500,
            maxWidth: '100%',
          }}
        >
          <TextField
            inputRef={textfieldDescription}
            label="List Description"
            id="fullWidth"
            variant="outlined"
            sx={{ mt: 2 }}
            autoFocus
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAddList}>add</Button>
        <Button onClick={onClose}>cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
