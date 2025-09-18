"use client"

import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"

export  const Client =() => {
    const trpc = useTRPC();

    return (
        <div>
            Hello

        </div>
    )
}