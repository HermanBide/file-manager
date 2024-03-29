"use client";

import { Button } from "@/components/ui/button";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { generateUploadUrl } from "../../convex/files";
import React, { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(2).max(200),
  file: z.custom<FileList>((val) => val instanceof FileList, "Required")
  .refine((files) => files.length > 0, "required")
});

export default function Home() {
  const organization = useOrganization();
  const user = useUser();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      file: undefined,
    },
  });
  
  const fileRef = form.register("file")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    console.log(values.file);
    if(!orgId) return

    const postUrl = await generateUploadUrl();

    const result = await fetch(postUrl, {
      method: "POST",
      headers: {"Content-type": values.file[0].type},
      body: values.file[0],
    })
    const { storageId } = await result.json()
  try{
    await createFile({
      name: values.title,
      fileId: storageId,
      orgId,
      type: "image"
    });
    form.reset();
    setIsFileDialogOpen(false);
    toast({
      variant: "success", title: "file uploaded", description: "Everyone can view your file"
    })
  } catch(err) {
    toast({
      variant: "destructive", title: "something went wrong", description: "file could not be uploaded "
    })
  }
  
  }

let orgId: string | undefined = undefined;
if(organization?.isLoaded && user.isLoaded) {
  orgId = organization.organization?.id?? user.user?.id;
}

const [isFileDialogOpen, setIsFileDialogOpen] = useState(false)

const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");
const createFile = useMutation(api.files.createFile);

  return (
    <main className="container mx-auto pt-12">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Your Files</h1>
        <Dialog open={isFileDialogOpen} onOpenChange={(isOpen ) => {setIsFileDialogOpen(isOpen); form.reset()}} >
          <DialogTrigger asChild>
            <Button>Upload File</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-4">Upload your file here</DialogTitle>
              <DialogDescription>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field: {onChange}, ...field }) => (
                        <FormItem>
                          <FormLabel>title</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="file"
                      render={() => (
                        <FormItem>
                          <FormLabel>File</FormLabel>
                          <FormControl>
                            <Input type="file" {...fileRef} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={form.formState.isSubmitting} className="flex gap-1">
                      {form.formState.isSubmitting && (<Loader2 className=" h-4 w-4 animate-spin"/>) }Submit</Button>
                  </form>
                </Form>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      {files?.map((file: any) => {
        return <div key={file._id}>{file.name}</div>;
      })}
      <Button
        onClick={() => {

        }}
      >
        send file
      </Button>
    </main>
  );
}
