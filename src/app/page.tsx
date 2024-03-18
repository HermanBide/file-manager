"use client";

import { Button } from "@/components/ui/button";
import {

  useOrganization,
} from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const { isLoading, organization } = useOrganization();
  const user = useUser();

  const orgId: string | undefined = undefined;

  // const orgId = organization?.id ?? user.user?.id;

  if(user.user?.id && orgId.)

  const createFile = useMutation(api.files.createFile);
  const files = useQuery(api.files.getFiles, isLoading ? { orgId } : "skip");
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button
        onClick={() => {
          if (!organization) return;
          createFile({ name: "hello man", orgId: organization.id });
        }}
      >
        send file
      </Button>
      {files?.map((file: any) => {
        return <div key={file._id}>{file.name}</div>;
      })}
    </main>
  );
}
