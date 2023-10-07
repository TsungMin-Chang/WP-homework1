import { useRef, useState } from "react";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
  
import DeleteIcon from "@mui/icons-material/Delete";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import useCards from "@/hooks/useCards";
import type { CardProps } from "./Card";
import { deleteList, updateList } from "@/utils/client";

export type CardListProps = {
  id: string;
  name: string;
  cards: CardProps[];
  onDetail: () => void;
};

export default function CardList({ id, name, cards, onDetail }: CardListProps) {
  const [edittingName, setEdittingName] = useState(false);
  const { fetchLists } = useCards();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpdateName = async () => {
    if (!inputRef.current) return;

    const newName = inputRef.current.value;
    if (newName !== name) {
      try {
        await updateList(id, { name: newName });
        fetchLists();
      } catch (error) {
        alert("Error: Failed to update list name");
      }
    }
    setEdittingName(false);
  };

  const handleDelete = async () => {
    try {
      await deleteList(id);
      fetchLists();
    } catch (error) {
      alert("Error: Failed to delete list");
    }
  };
  
  return (
    <>
      <Paper className="w-80 p-6">
        <div className="flex gap-4">
          <button onClick={onDetail} style={{zIndex: 1}}>
            <Card sx={{ maxWidth: 345 }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  image="https://upload.wikimedia.org/wikipedia/en/4/41/IU_-_Lilac.png"
                  alt="album cover"
                />
                <CardContent>
                  {edittingName ? (
                    <ClickAwayListener onClickAway={handleUpdateName}>
                      <Input
                        autoFocus
                        defaultValue={name}
                        className="grow"
                        placeholder="Enter a new name for this list..."
                        sx={{ fontSize: "1.5rem" }}
                        inputRef={inputRef}
                      />
                    </ClickAwayListener>
                  ) : (
                    <button
                      onClick={(event) => {setEdittingName(true); event.stopPropagation();}}
                      className="w-full rounded-md p-2 hover:bg-white/10"
                      style={{zIndex: 2}}
                    >
                      <Typography gutterBottom variant="h5" component="div">
                        {name}
                      </Typography>
                    </button>
                  )}
                  <Typography variant="body2" color="text.secondary" style={{textAlign: 'center'}}>
                    Total of {cards.length} songs.
                  </Typography>
                  <div className="grid place-items-center">
                    <IconButton color="error" onClick={handleDelete}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </CardContent>
              </CardActionArea>
            </Card>
          </button>
        </div>
      </Paper>
    </>
  );
}
