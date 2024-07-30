"use client";

import CreateSessionForm from "../client/createSession";
import DeleteSessionForm from "../client/deleteSession";
import {useSessionInit} from "../context/sessionContext";

const AdminSessionController = () => {
  const {sessionInit} = useSessionInit();

  return !sessionInit ? <CreateSessionForm /> : <DeleteSessionForm />;
};

export default AdminSessionController;
