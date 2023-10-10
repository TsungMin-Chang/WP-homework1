import { useState, useRef } from "react";

import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Box from '@mui/material/Box';
import Input from "@mui/material/Input";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import useCards from "@/hooks/useCards";
import { createCard } from "@/utils/client";

// this pattern is called discriminated type unions
// you can read more about it here: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions
// or see it in action: https://www.typescriptlang.org/play#example/discriminate-types
type NewCardDialogProps = {
  open: boolean;
  listId: string;
  onClose: () => void;
};

export default function NewCardDialog(props: NewCardDialogProps) {
  const { open, onClose, listId } = props;

  // using a state variable to store the value of the input, and update it on change is another way to get the value of a input
  // however, this method is not recommended for large forms, as it will cause a re-render on every change
  // you can read more about it here: https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable
  const [title, setTitle] = useState("");
  const [newListId, setNewListId] = useState(listId);
  const { lists, fetchCards } = useCards();
  const textfieldSinger = useRef<HTMLInputElement>(null);
  const textfieldLink = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    try {
      await createCard({
        title: title,
        singer: textfieldSinger.current?.value ?? "",
        link: textfieldLink.current?.value ?? "",
        list_id: listId,
      });
      setTitle("");
      fetchCards();
    } catch (error) {
      alert("Error: Failed to save card");
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className="flex gap-4">
        <ClickAwayListener
          onClickAway={() => {}}
        >
          <Input
            autoFocus
            defaultValue={title}
            onChange={(e) => setTitle(e.target.value)}
            className="grow"
            placeholder="Enter a title for this card..."
          />
        </ClickAwayListener>
        <Select
          value={newListId}
          onChange={(e) => setNewListId(e.target.value)}
        >
          {lists.map((list) => (
            <MenuItem value={list.id} key={list.id}>
              {list.name}
            </MenuItem>
          ))}
        </Select>
      </DialogTitle>
      <DialogContent className="w-[600px]">
        <TextField
          inputRef={textfieldSinger}
          label="Singer"
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
            inputRef={textfieldLink}
            label="Link"
            id="fullWidth"
            variant="outlined"
            sx={{ mt: 2 }}
            autoFocus
            fullWidth
          />
        </Box>
        <DialogActions>
          <Button onClick={handleSave}>save</Button>
          <Button onClick={onClose}>close</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
