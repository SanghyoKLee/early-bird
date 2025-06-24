"use client";

import React from "react";
import { useSession } from "next-auth/react";
import SignOutButton from "./SignOutButton";

const UserStats = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>You are not logged in.</div>;
  }
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Home Page</h1>
      <h2 className="text-xl mb-2">Logged in as:</h2>
      <p className="mb-1">
        <strong>ID:</strong> {session.user?.id}
      </p>
      <p className="mb-1">
        <strong>Name:</strong> {session.user?.username}
      </p>
      <p className="mb-1">
        <strong>Email:</strong> {session.user?.email}
      </p>
      <SignOutButton />
    </div>
  );
};

export default UserStats;
