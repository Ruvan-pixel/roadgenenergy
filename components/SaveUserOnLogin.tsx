"use client"

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { saveUserData } from "@/db"

const SaveUserOnLogin = () => {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      saveUserData(user);
    }
  }, [user]);

  return null;
};

export default SaveUserOnLogin;
