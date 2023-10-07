import { useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";

import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import Paper from "@mui/material/Paper";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';

import type { GridColDef} from '@mui/x-data-grid';
import { DataGrid, GridValueGetterParams } from '@mui/x-data-grid';

import CardDialog from "./CardDialog";
import useCards from "@/hooks/useCards";
import { deleteCard, updateCard } from "@/utils/client";

// look up type
// import type { CardListProps } from "./CardList";
// import type { CardProps } from "./Card";

export type clickedCardProps = {
  listId: string;
  onBack: () => void;
};

export default function DetailCard({ listId, onBack }: clickedCardProps) {
  const { lists, fetchCards } = useCards();
  
  const [openNewCardDialog, setOpenNewCardDialog] = useState(false);
  const [selectedCards, setSelectedCards] = useState('');
  
  const clickedList = lists.filter((list) => list.id === listId)[0];
  const rows = clickedList.cards;
  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Title', width: 250 },
    { field: 'description', headerName: 'Description', width: 500 },
    { field: 'description', headerName: 'Description', width: 500 }, 
  ];

  const handleDelete = async () => {
    try {
      console.log('hihi', selectedCards);
      await deleteCard(selectedCards);
      fetchCards();
    } catch (error) {
      alert("Error: Failed to delete list");
    } 
  };
  
  return (
    <>
      <div className="grid place-items-center">
        <Card sx={{ display: 'flex' }}>
          <CardMedia
              component="img"
              sx={{ width: 151 }}
              image="https://upload.wikimedia.org/wikipedia/en/4/41/IU_-_Lilac.png"
              alt="album cover"
            />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: '1 0 auto' }}>
              <Typography component="div" variant="h5">
                {clickedList.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" component="div">
                {clickedList.name} will be changed to some description.
              </Typography>
            </CardContent>
          </Box>
        </Card>
        <br/>
        <ButtonGroup variant="text" aria-label="text button group">
          <Button onClick={() => setOpenNewCardDialog(true)}>
            <AddIcon className="mr-2" />
            Add
          </Button>
          <Button onClick={handleDelete}>
            <DeleteIcon />
            Delete
          </Button>
        </ButtonGroup>
        <div style={{ textAlign: 'center', margin: 'auto', display: 'flex', alignItems: 'center'}}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            onRowSelectionModelChange={(e) => {
              const buffer2: string[] = [];
              e.map((value) => {
                const buffer: string[] = [];
                Object.entries(value).map((arr) => buffer.push(arr[1]))
                buffer2.push(buffer.join(''));
              });
              setSelectedCards(buffer2.join('_'));
            }}
          />
        </div>
        <br/>
        <Button variant="outlined" onClick={onBack}>
          Back to Home
        </Button>
        <CardDialog
          variant="new"
          open={openNewCardDialog}
          onClose={() => setOpenNewCardDialog(false)}
          listId={listId}
        />
      </div>
    </>
  );
}

