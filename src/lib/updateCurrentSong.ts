"use client";

import {socket} from "./socket";

export const updateCurrentSong = async () => {
  return fetch("/api/song", {
    method: "GET",
  })
    .then(async (res) => {
      return await res.json();
    })
    .then(async (data) => {
      socket.emit("send-song", data);
    });
};
