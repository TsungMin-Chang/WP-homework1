"use client"

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import ClickAwayListener from "@mui/material/ClickAwayListener";
import FormControl from '@mui/material/FormControl';
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";

type MySearchBarProp = {
  username: string;
  userid: number;
}

export default function MySearchBar({username, userid}: MySearchBarProp) {

    const [keyWord, setKeyWord] = useState("");
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const  handleSearch = async () => {
      const params = new URLSearchParams(searchParams);
      params.set("username", username!);
      params.set("userid", userid.toString());
      params.set("keyword", keyWord);
      router.push(`${pathname}?${params.toString()}`);
    }
  
    return (
      <>
        <FormControl sx={{ m: 1, minWidth: 510 }}>
          <ClickAwayListener
            onClickAway={() => {}}
          >
            <Input
              autoFocus
              value={keyWord}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyWord(e.target.value as string)}
              className="grow"
              placeholder="Enter a keyword to search"
            />
          </ClickAwayListener>
        </FormControl>
        <Button 
          onClick={handleSearch}
        >
          Search
        </Button>
      </>
    )
}