import UserViewPage from "@/components/users/UserView";
import React, { Suspense } from "react";

const UserView = () => {
  return (
    <Suspense>
      <UserViewPage />
    </Suspense>
  );
};

export default UserViewPage;
