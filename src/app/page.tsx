"use client"

import {  useMutation, useQuery } from "@tanstack/react-query";
import {  useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";





export default   function Page() {
 
  const [value, setValue] = useState("")

  const trpc = useTRPC();
  const {data: message} = useQuery(trpc.message.getMany.queryOptions());
  const createMessage = useMutation(trpc.message.create.mutationOptions({
    onSuccess: () => {
      toast.success("Message created")
    }
  }))
 


  return (
    <div>
      <Input value={value} onChange={(e) => setValue(e.target.value)}></Input>
      <Button disabled = {createMessage.isPending} onClick={() => createMessage.mutate({value:value})}>Invoke</Button>
    </div>
  );
}
