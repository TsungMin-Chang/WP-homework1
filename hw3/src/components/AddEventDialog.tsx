"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";

import useTweet from "@/hooks/useTweet";
import useUser from "@/hooks/useUser";
import useLike from "@/hooks/useLike";

import FormControl from '@mui/material/FormControl';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Input from "@mui/material/Input";

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Dayjs } from 'dayjs';

type NewPublicationDialogProps = {
    open: boolean;
    onClose: () => void;
};

export default function NewPublicationDialog({ open, onClose }: NewPublicationDialogProps) {

  const { username, userid } = useUser();
  const { postTweet, loading } = useTweet();
  const { likeTweet } = useLike();

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [title, setTitle] = useState<string>("");
  const [timeStart, setTimeStart] = useState<Dayjs | null>(null);
  const [timeEnd, setTimeEnd] = useState<Dayjs | null>(null);

  const handleSave = async () => {

    if (!userid) return;
    const userid_int = parseInt(userid);
    if (!userid_int) return;

    if (!title) {
      alert("Title cannot be blank!");
      return;
    } 
    if (!timeStart || !('$d' in timeStart && timeStart['$d'] instanceof Date)) {
      alert("Start Time cannot be blank!");
      return;
    }
    if (!timeEnd || !('$d' in timeEnd && timeEnd['$d'] instanceof Date)) {
      alert("End Time cannot be blank!");
      return;
    }

    if(timeStart.valueOf() >= timeEnd.valueOf()){
      alert("Event start time should be earlier than the event end time!");
      return;
    }
    
    if(timeEnd.valueOf() - timeStart.valueOf() > 604800000){
      alert("The event can only last for at most 7 days!");
      return;
    }
    
    // console.log(userid_int);
    // console.log(timeStart['$d'].valueOf());
    // console.log(timeEnd['$d'].valueOf());
    // console.log(title);

    try {
      const tweetid = await postTweet({
        userId: userid_int,
        timestart: timeStart['$d'].valueOf(),
        timeend: timeEnd['$d'].valueOf(),
        content: title,
      });

      await likeTweet({
        tweetId: tweetid,
        userId: parseInt(userid),
      });

      const params = new URLSearchParams(searchParams);
      params.set("username", username!);
      params.set("userid", userid.toString());
      router.push(`${pathname}tweet/${tweetid}?${params.toString()}`);

      handleClose();
    } catch (e) {
      alert("Error posting tweet");
      handleClose();
    }
  };

  const handleClose = () => {
    setTitle("");
    setTimeStart(null);
    setTimeEnd(null);
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className="flex gap-4">
        <FormControl sx={{ m: 1, minWidth: 510 }}>
          <ClickAwayListener
            onClickAway={() => {}}
          >
            <Input
              autoFocus
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value as string)}
              className="grow"
              placeholder="Enter an event title..."
            />
          </ClickAwayListener>
        </FormControl>
      </DialogTitle>
      <DialogContent className="w-[600px]">
        <FormControl sx={{ m: 1, minWidth: 510 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DateTimePicker']}>
              <DateTimePicker 
                label="From"
                onChange={(e: Dayjs | null) => setTimeStart(e)}
              />
            </DemoContainer>
          </LocalizationProvider>
        </FormControl>  
        <FormControl sx={{ m: 1, minWidth: 510 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DateTimePicker']}>
              <DateTimePicker 
                label="To"
                onChange={(e: Dayjs | null) => setTimeEnd(e)}
              />
            </DemoContainer>
          </LocalizationProvider>
        </FormControl>  
        <DialogActions>
          <Button 
            onClick={handleSave}
            disabled={loading}
          >
            add
          </Button>
          <Button 
            onClick={handleClose}
            disabled={loading}
          >
            close
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}
