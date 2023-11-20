"use client";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Divider } from '@mui/material';

import React, { useEffect, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import { pusherClient } from "@/lib/pusher/client";
import type { Document, User } from "@/lib/types/db";

type PusherPayload = {
  senderId: User["id"];
  document: Document;
};

interface Position {
  x: number;
  y: number;
  id: string;
}

function DocPage() {

  const { docId } = useParams();
  const documentId = Array.isArray(docId) ? docId[0] : docId;
  const [document, setDocument] = useState<Document | null>(null);
  const [toRefresh, setRefresh] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0, id: "" });
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [onHiddens, setHiddens] = useState<number[]>([]);
  const [title, setTitle] = useState("");
  const [textInput, setTextInput] = useState("");

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const router = useRouter();
  const searchParams = useSearchParams();  

  useEffect(() => {
    const isNew = searchParams.get("new")==="1";
    if(isNew) {
      window.document.getElementById('sandra')?.click();
    }
  }, []);

  useEffect(() => {
    if (!documentId) return;
    const fetchDocument = async () => {
      const res = await fetch(`/api/documents/${documentId}`);
      if (!res.ok) {
        setDocument(null);
        router.push("/docs");
        return;
      }
      const data = await res.json();
      setDocument(data);
      setRefresh(false);
    };
    fetchDocument();
  }, [documentId, router, userId, toRefresh]);

  useEffect(() => {
    if (document && userId) {
      const members = document.members;
      const others = Object.values(members).filter((_, index) => Object.keys(members)[index] !== userId);
      setTitle(others.join(', '));
    }
  }, [documentId, userId, router, toRefresh]);

  // Subscribe to pusher events
  useEffect(() => {
    if (!documentId) return;
    // Private channels are in the format: private-...
    const channelName = `private-${documentId}`;

    try {
      const channel = pusherClient.subscribe(channelName);
      channel.bind("doc:update", ({ senderId, document: received_document }: PusherPayload) => {
        if (senderId === userId) {
          return;
        }
        // [NOTE] 2023.11.18 - This is the pusher event that updates the dbDocument.
        setDocument(received_document);
        router.refresh();
      });
    } catch (error) {
      console.error(error);
      router.push("/docs");
    }

    // Unsubscribe from pusher events when the component unmounts
    return () => {
      pusherClient.unsubscribe(channelName);
    };
  }, [documentId, router, userId, toRefresh]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget as unknown as HTMLInputElement[];
    e.preventDefault();
    e.stopPropagation();
    console.log("form input", form[0].value);
    if (!form[0].value){
      alert("Enter Something!");
      return;
    }
    const res = await fetch(`/api/documents/${documentId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        documentDisplayId: documentId,
        authorDisplayId: userId,
        content: form[0].value
      }),
    });
    if (!res.ok) {
      return;
    }
    setTextInput("");
    setRefresh(true);
  }
  const handleRetrieve = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setShowMenu(false);
    setPosition({x: event.pageX, y: event.pageY, id: event.currentTarget.id} as Position);
    setShowMenu(true);
  };
  const handleRetrieveMyself = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setShowMenu(false);
    setHiddens([...onHiddens, parseInt(event.currentTarget.id)]);
  };
  const handleRetrieveEveryone = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const id = event.currentTarget.id;
    const res = await fetch(`/api/documents/retrieve/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    setShowMenu(false);
    if (!res.ok) {
      alert("Something Bad happened");
    }
    setRefresh(true);
  };
  return (
    <div className="w-full" onClick={()=>setShowMenu(false)}>
      <nav className="sticky top-0 flex w-full justify-between p-2 shadow-sm">
        <h2>Chatting with {title}</h2>
      </nav>
      { document ? 
        <Container 
          style={{
            overflow: 'scroll', 
            height: '90vh', 
            display:'flex',
            flexDirection: 'column-reverse'
          }}>
          {Object.keys(document.data)
            .sort()
            .reverse()
            .filter(key=>!onHiddens.includes(parseInt(key)))
            .map((key) => (
            <div key={key} onContextMenu={handleRetrieve} id={key}>
              <div 
                style={{
                  fontSize: "18px",
                  textAlign: document.data[key].authorDisplayId === userId ? "right" : "left"
                }}
              >
                {document.members[document.data[key].authorDisplayId]+":"}
              </div>
              <div 
                style={{
                  fontSize: "20px",
                  textAlign: document.data[key].authorDisplayId === userId ? "right" : "left"
                }}
              >
                {document.data[key].content}
              </div>
              <Divider />
            </div>
          ))}
        </Container> : 
        <></>
      }
         <Form style={{
          position: 'fixed', bottom: '0', width:"100%"
        }} onSubmit={handleSubmit}>
          <Row className="mb-3" style={{display: "flex"}}>
            <Form.Group as={Col} style={{width:"60%"}}>
              <Form.Control
                placeholder="Please say something"
                aria-label="... ..."
                aria-describedby="basic-addon2"
                style={{width:"100%"}}
                onChange={(e) => setTextInput(e.currentTarget.value)}
                value={textInput}
              />
            </Form.Group>
            <Form.Group as={Col} style={{width:"40%"}}>
              <Button variant="outline-secondary" id="button-addon2" type='submit' style={{width:"35%"}}>
                Send
              </Button>
            </Form.Group>
          </Row>
        </Form>
      {showMenu ? 
        <div
          style={{ 
            top: position.y, 
            left: position.x , 
            position: 'absolute', 
            zIndex: 1000, 
            backgroundColor: 'white',
            border: '1px solid black',
          }}
        >
          <div>
            <Button 
              onClick={handleRetrieveMyself}
              id={position.id}
              onMouseOver={(e)=>e.currentTarget.style.background='blue'}
              onMouseLeave={(e)=>e.currentTarget.style.background='white'}
              style={{width: "100%"}}>
              {document && document.data[parseInt(position.id)]?.authorDisplayId === userId ? 
                "Unsend for me" : 'Hidden '.concat(
                  document ? document.members[document.data[parseInt(position.id)]?.authorDisplayId] : "Others",
                  "'s message")}
            </Button>
          </div>
          { document && document.data[parseInt(position.id)]?.authorDisplayId === userId ?
            <div>
            <Button 
              onClick={handleRetrieveEveryone}
              id={position.id}
              onMouseOver={(e)=>e.currentTarget.style.background='blue'}
              onMouseLeave={(e)=>e.currentTarget.style.background='white'}
              style={{width: "100%"}}
            >
              Unsend for everyone
            </Button>
          </div> : <></>}
        </div> : <></>}
    </div>
  );
}

export default DocPage;
