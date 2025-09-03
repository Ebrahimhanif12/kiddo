import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { inngest } from '@/inngest/client';
import { Value } from '@radix-ui/react-select';
export const appRouter = createTRPCRouter({
  invoke: baseProcedure
    .input(
      z.object({
        value: z.string(),
      }),
    )
    .mutation(async ({input}) =>{
      await inngest.send({
        name: "test/hello.world",
        data: {
          Value: input.value,
        }
      })
      return {ok: "success"}

    }
  )

    })

// export type definition of API
export type AppRouter = typeof appRouter;