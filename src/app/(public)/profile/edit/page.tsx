import ProfilePage from "@/app/(dashboard)/dashboard/profile/page";
import { Container } from "@/components/layout/container";
import React from "react";

const ProfileEditPage = () => {
  return (
    <div className="my-7">
      <Container>
        <ProfilePage params={{ page: "public" }} />
      </Container>
    </div>
  );
};

export default ProfileEditPage;
