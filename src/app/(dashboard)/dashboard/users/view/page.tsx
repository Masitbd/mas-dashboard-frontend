"use client";
import UserViewPage from "@/components/users/UserView";
import React, { Suspense } from "react";

const UserView = () => {
  return (
    <Suspense fallback={<div>Loading....</div>}>
      <UserViewPage />
    </Suspense>
  );
};

export default UserView;
