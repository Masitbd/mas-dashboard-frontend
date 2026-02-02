import ProfilePage from "@/app/(dashboard)/dashboard/profile/page";
import UserViewPage from "@/app/(dashboard)/dashboard/profile/view/page";
import { Container } from "@/components/layout/container";
import React from "react";

const MyProfile = () => {
  return (
    <div className="my-7">
      <Container>
        <UserViewPage params={{ page: "public" }} />
      </Container>
    </div>
  );
};

export default MyProfile;
