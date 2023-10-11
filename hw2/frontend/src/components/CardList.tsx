import React, { useRef, useState } from "react";

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
import { deleteList, updateList } from "@/utils/client";

export type CardProps = {
  id: string;
  title: string;
  singer: string;
  link: string;
  listId: string;
};

export type CardListProps = {
  id: string;
  name: string;
  description: string;
  cards: CardProps[];
};

type CardListPropsInner = {
  id: string;
  name: string;
  description: string;
  cards: CardProps[];
  onDetail: () => void;
  deleteMode: number;
};

export default function CardList({ id, name, cards, onDetail, deleteMode }: CardListPropsInner) {
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

  const handleDelete = async (event: React.MouseEvent<HTMLElement>) => {
    try {
      event.stopPropagation();
      await deleteList(id);
      fetchLists();
    } catch (error) {
      alert("Error: Failed to delete list");
    }
  };

  const editName = (event: React.MouseEvent<HTMLElement>) => {
    setEdittingName(true); 
    event.stopPropagation();
  };
  
  return (
    <>
      <Paper className="w-80 p-6">
        <div className="flex gap-4">
          <button onClick={onDetail} style={{zIndex: 1}}>
            <Card sx={{ maxWidth: 345 }}>
              <CardActionArea>
                <div style={{height:'140'}}>
                  <div style={{float: 'right', position: 'absolute', right: '0px', top: '0px'}}>
                  {(deleteMode === 1) ? (
                      <IconButton 
                        color="error" 
                        onClick={(event) => handleDelete(event)} 
                        style={{zIndex: 3}}
                      >
                        <DeleteIcon />
                      </IconButton>
                  ) : (
                    <></>
                  )}
                  </div>
                  <CardMedia
                    component="img"
                    height="140"
                    image="https://upload.wikimedia.org/wikipedia/en/4/41/IU_-_Lilac.png"
                    alt="album cover"
                    style={{position: 'relative'}}
                  />
                </div>
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
                      onClick={(event) => editName(event)}
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
                </CardContent>
              </CardActionArea>
            </Card>
          </button>
        </div>
      </Paper>
    </>
  );
}
