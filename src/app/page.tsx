"use client"

import { Button } from "@/components/ui/button";
import { SignInButton, SignOutButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";


export default function Home() {
  const createFile = useMutation(api.files.createFile);
  const files = useQuery(api.files.getFiles);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SignedIn>
      <SignOutButton />
      <Button>Sign out</Button>
      </SignedIn>
      <SignedOut>
      <SignInButton mode="modal">
        <Button>Sign in</Button>
      </SignInButton>
      </SignedOut>

      <Button onClick={() => createFile({name: "hello man"})}>send file</Button>
    {files?.map((file) =>{
      return <div key={file._id}>{file.name}</div>
    })}
    </main>
  );
}
