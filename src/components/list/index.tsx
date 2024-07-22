"use client";

import {Song} from "@prisma/client";
import {useEffect, useState} from "react";
import {columns, columnsAdmin} from "./column";
import {DataTable} from "./data-table";
import {Button} from "../ui/button";

type SongListProps = {
  type?: "admin" | "user";
  initialCountDownTime?: number;
};

const SongList = ({
  type: userType = "user",
  initialCountDownTime: initialCountDownTimeProps = 30,
}: SongListProps) => {
  const initialCountDownTime = initialCountDownTimeProps; // Initial countdown time
  const [songs, setSongs] = useState<Song[]>([]);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [count, setCount] = useState(initialCountDownTime);
  let intervalId: NodeJS.Timeout;
  let countDownTime = initialCountDownTime; // Initial countdown time

  const fetchSongs = () => {
    fetch("/api/song")
      .then((res) => res.json())
      .then((data) => {
        setSongs(data);
      });
  };

  useEffect(() => {
    if (buttonDisabled) {
      setTimeout(() => {
        setButtonDisabled(false);
      }, 5000); // Reset button after 5 seconds
    } else {
      intervalId = setInterval(() => {
        countDownTime -= 1;
        setCount(countDownTime);

        if (countDownTime === 0) {
          fetchSongs(); // Fetch songs when countdown reaches 0
          setButtonDisabled(true); // Disable the button

          setTimeout(() => {
            setButtonDisabled(false);
            setCount(initialCountDownTime); // Reset the countdown time
          }, 5000); // Reset after 5 seconds
        }
      }, 1000); // Update every second

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [buttonDisabled]);

  const handleReloadTableClick = () => {
    if (buttonDisabled) return;

    setButtonDisabled(true); // Disable the button

    fetchSongs(); // Fetch songs immediately
  };

  const column = userType === "admin" ? columnsAdmin : columns;
  return (
    <>
      <section className="grid grid-rows-[auto,1fr] w-full h-full gap-4">
        <div className="flex justify-end items-center gap-8">
          <p>ตารางเพลงจะรีโหลดภายใน {count} วินาที</p>
          <Button onClick={handleReloadTableClick} disabled={buttonDisabled}>
            รีโหลดตาราง
          </Button>
        </div>
        <DataTable columns={column} data={songs} />
      </section>
    </>
  );
};

export default SongList;
