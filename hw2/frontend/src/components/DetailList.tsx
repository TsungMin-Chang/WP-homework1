import { useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";

import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import NewCardDialog from "./NewCardDialog";
import UpdateCardDialog from "./UpdateCardDialog";
import useCards from "@/hooks/useCards";
import { deleteCard } from "@/utils/client";

// look up type
// import type { CardListProps } from "./CardList";
import type { CardProps } from "./CardList";

type clickedCardProps = {
  listId: string;
  onBack: () => void;
};

export default function DetailCard({ listId, onBack }: clickedCardProps) {
  const { lists, fetchCards } = useCards();
  
  const [openNewCardDialog, setOpenNewCardDialog] = useState(false);
  const [updateCardDialogOpen, setUpdateCardDialogOpen] = useState({'state': false, 'data': {} as CardProps});
  const clickedList = lists.filter((list) => list.id === listId)[0];
  const ids = clickedList.cards.map((ele) => {return ele.id});
  const [bufferDelete, setBufferDelete] = useState([] as string[]);
  
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => { setShow(true); }
  const handleDelete = async () => {
    try {
      await deleteCard(bufferDelete.join('_'));
      fetchCards();
      handleClose();
      setBufferDelete([]);
    } catch (error) {
      alert("Error: Failed to delete cards");
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
                {clickedList.description}
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
          <Button onClick={handleShow}>
            <DeleteIcon />
            Delete
          </Button>
        </ButtonGroup>
        <div className="container">
          <Form>
            <div className="mb-3">
                <div className="row">
                  <div className="col-sm-1 col-lg-1 d-flex">
                    <Form.Check // prettier-ignore
                      type="checkbox"
                      id='all'
                      checked={bufferDelete.length === clickedList.cards.length}
                      onChange={() => {
                        setBufferDelete(bufferDelete.length === clickedList.cards.length ? [] : [...ids]);
                      }}
                    />
                  </div>
                  <div className="col-sm-5 col-lg-2 d-flex">
                    <Typography gutterBottom>
                      Title
                    </Typography>
                  </div>
                  <div className="col-sm-6 col-lg-2 d-flex">
                    <Typography gutterBottom>
                      Singer
                    </Typography>
                  </div>
                  <div className="col-sm-8 col-lg-5 d-flex">
                    <Typography gutterBottom>
                      Link
                    </Typography>
                  </div>
                  <div className="col-sm-4 col-lg-2 d-flex">
                    <Typography gutterBottom>
                      Edit
                    </Typography>
                  </div> 
                </div>
              </div>
            {clickedList.cards.map((ele) => (
              <div key={ele.id} className="mb-3">
                <div className="row" key={ele.id}>
                  <div className="col-sm-1 col-lg-1 d-flex">
                    <Form.Check // prettier-ignore
                      type="checkbox"
                      id={ele.id}
                      checked={bufferDelete.includes(ele.id)}
                      onChange={() => {setBufferDelete(bufferDelete.includes(ele.id) ? bufferDelete.filter((cardId) => cardId !== ele.id) : [...bufferDelete, ele.id])}}
                    />
                  </div>
                  <div className="col-sm-5 col-lg-2 d-flex">
                    <Typography gutterBottom>
                      {ele.title}
                    </Typography>
                  </div>
                  <div className="col-sm-6 col-lg-2 d-flex">
                    <Typography gutterBottom>
                      {ele.singer}
                    </Typography>
                  </div>
                  <div className="col-sm-8 col-lg-5 d-flex">
                    <Typography gutterBottom>
                      <a href={ele.link} target='_blank'>{ele.link}</a>
                    </Typography>
                  </div>
                  <div className="col-sm-4 col-lg-2 d-flex">
                    <Button color="secondary" onClick={() => setUpdateCardDialogOpen({'state': true, 'data': ele})}>
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </Form>
        </div>
        <br/>
        <Button variant="outlined" onClick={onBack}>
          Back to Home
        </Button>
        <NewCardDialog
          open={openNewCardDialog}
          onClose={() => setOpenNewCardDialog(false)}
          listId={listId}
        />
        <Modal show={show} onHide={handleClose} style={{ color: 'black' }}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              {bufferDelete.length === 0 ? <p>It seems like no song was chosen, please choose to delete!</p> : <p>Are you sure to delete these songs?</p>}
              {clickedList.cards.map((ele) => (bufferDelete.includes(ele.id) ? <li>{ele.title}</li> : <></>))}
          </Modal.Body>
          <Modal.Footer>
            {bufferDelete.length === 0 ? (
              <Button variant="contained" color="success" onClick={handleClose}>
                Ok
              </Button>
            ) : (
              <>
                <Button variant="contained" color="error" onClick={handleClose}>
                  No
                </Button>
                <Button variant="contained" color="success" onClick={handleDelete}>
                  Yes
                </Button>
              </>
            )}
          </Modal.Footer>
        </Modal>
        <UpdateCardDialog
          open={updateCardDialogOpen.state}
          {...updateCardDialogOpen.data}
          onClose={() => setUpdateCardDialogOpen({'state': false, 'data': {} as CardProps})}
        />
      </div>
    </>
  );
}