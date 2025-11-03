"use client"

import { useMutation, useQuery } from "@tanstack/react-query";
import { useState} from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";





export default function Page() {

  const router = useRouter();
  const [value, setValue] = useState("")

  const trpc = useTRPC();
  const { data: message } = useQuery(trpc.message.getMany.queryOptions());
  const createProject = useMutation(trpc.project.create.mutationOptions({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      router.push(`/projects/${data.id}`);
    }
  }))



  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="max-w-7xl mx-auto flex items-center flex-col gap-y-4 justify-center">
        <Input value={value} onChange={(e) => setValue(e.target.value)}></Input>
        <Button
         disabled={createProject.isPending}
        onClick={() => createProject.mutate({ value: value })}
        >Submit</Button>
      </div>
    </div>
  );
}
