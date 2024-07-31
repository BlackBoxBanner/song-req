"use client";

import CreateSessionForm from "@/components/client/createSession";
import DeleteSessionForm from "@/components/client/deleteSession";
import {useSessionInit} from "@/components/context/sessionContext";

const AdminSessionController = () => {
  const {sessionInit} = useSessionInit();

  return sessionInit ? <DeleteSessionForm /> : <CreateSessionForm />;
};

export default AdminSessionController;
