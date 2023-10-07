import { useEffect, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@mui/material";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ButtonGroup from '@mui/material/ButtonGroup';

import CardList from "@/components/CardList";
import HeaderBar from "@/components/HeaderBar";
import NewListDialog from "@/components/NewListDialog";
import DetailList from "@/components/DetailCard"
import useCards from "@/hooks/useCards";

function App() {
  const { lists, fetchLists, fetchCards } = useCards();
  const [detailListDisplay, setDetailListDisplay] = useState({'state':false, 'id':""});
  const [newListDialogOpen, setNewListDialogOpen] = useState(false);

  useEffect(() => {
    fetchLists();
    fetchCards();
  }, [fetchCards, fetchLists]);

  const handleListClick = (listId: string) => {
    setDetailListDisplay({'state':true, 'id':listId});
  };

  return (
    <>
      <HeaderBar />
      { detailListDisplay.state ? (
          <DetailList 
            listId={ detailListDisplay.id }
            onBack = {() => setDetailListDisplay({'state': false, 'id': ''})}
          />
        ) : (
          <>
            <br/>
            <div className="grid place-items-center">
              <ButtonGroup size="large" variant="text" aria-label="text button group">
                <Button onClick={() => setNewListDialogOpen(true)}>
                  <AddIcon className="mr-2" />
                  Add
                </Button>
                <Button>
                  <DeleteIcon />
                  Delete
                </Button>
              </ButtonGroup>
            </div>
            <main className="mx-auto flex max-h-full flex-row gap-6 px-24 py-12">
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 4, md: 12 }}>
                  { lists.map((list) => (
                    <Grid item xs={2} sm={2} md={3} key={list.id}>
                      <CardList 
                        {...list}
                        onDetail={() => handleListClick(list.id)}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
              <div>
              </div>
              <NewListDialog
                open={newListDialogOpen}
                onClose={() => setNewListDialogOpen(false)}
              />
            </main>
          </>
        )
      }
    </>
  );
}

export default App;
