import { useState, useRef } from "react";

import { Delete as DeleteIcon } from "@mui/icons-material";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from '@mui/material/Box';

import useCards from "@/hooks/useCards";
import { deleteCard, updateCard } from "@/utils/client";

// this pattern is called discriminated type unions
// you can read more about it here: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions
// or see it in action: https://www.typescriptlang.org/play#example/discriminate-types

type UpdateCardDialogProps = {
  open: boolean;
  listId: string;
  id: string;
  title: string;
  singer: string;
  link: string;
  onClose: () => void;
};

export default function UpdateCardDialog(props: UpdateCardDialogProps) {
  const { open, onClose, listId, id, title, singer, link } = props;
  const { lists, fetchCards } = useCards();

  const [edittingTitle, setEdittingTitle] = useState(false);
  // using a state variable to store the value of the input, and update it on change is another way to get the value of a input
  // however, this method is not recommended for large forms, as it will cause a re-render on every change
  // you can read more about it here: https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable
  const [newTitle, setNewTitle] = useState(title);
  const textfieldSinger = useRef<HTMLInputElement>(null);
  const textfieldLink = useRef<HTMLInputElement>(null);
  const existedCardNames = lists.map((list) => {return list.cards.map((card) => {return card.title})}).flat();
  existedCardNames.filter((cardName) => cardName !== title);

  const handleSave = async () => {
    if (!newTitle) {
      alert("Title cannot be blank!");
      return;
    }
    if (!textfieldSinger.current!.value) {
      alert("Singer cannot be blank!");
      return;
    }
    if (!textfieldLink.current!.value) {
      alert("Link cannot be blank!");
      return;
    }
    if (existedCardNames.includes(newTitle)) {
      alert("This name has been used by another card! Please choose another name.");
      return;
    }
    try {
        if ( newTitle === title && 
            textfieldSinger.current?.value === singer && 
            textfieldLink.current?.value === link  
        ) return
        await updateCard(id, {
          title: newTitle,
          singer: textfieldSinger.current!.value,
          link: textfieldLink.current!.value,
          list_id: listId,
        });
        setNewTitle("");
        fetchCards();
    } catch (error) {
      alert("Error: Failed to save card");
    } finally {
      onClose();
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCard(id);
      fetchCards();
    } catch (error) {
      alert("Error: Failed to delete card");
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className="flex gap-4">
        {edittingTitle ? (
          <ClickAwayListener
            onClickAway={() => { setEdittingTitle(false) }}
          >
            <Input
              autoFocus
              defaultValue={title}
              onChange={(e) => setNewTitle(e.target.value)}
              className="grow"
              placeholder="Enter a title for this card..."
            />
          </ClickAwayListener>
        ) : (
          <button
            onClick={() => setEdittingTitle(true)}
            className="w-full rounded-md p-2 hover:bg-white/10"
          >
            <Typography className="text-start">{title}</Typography>
          </button>
        )}
        <IconButton color="error" onClick={handleDelete}>
            <DeleteIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className="w-[600px]">
        <TextField
          defaultValue={singer}
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
            defaultValue={link}
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