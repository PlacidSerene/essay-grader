import { auth, currentUser } from "@clerk/nextjs/server";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { z } from "zod";
import { getFileUrl } from "@/lib/utils";

export const appRouter = router({
  // ...
  authCallback: publicProcedure.query(async () => {
    const { userId } = auth();

    if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

    // check if user is in the db
    const user = await currentUser();
    const email = user?.emailAddresses[0].emailAddress;
    if (!email) throw new TRPCError({ code: "UNAUTHORIZED" });

    const dbUser = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!dbUser) {
      // create user in db

      await db.user.create({
        data: {
          id: userId,
          email: email,
        },
      });
    }

    return { success: true };
  }),
  getFile: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const file = await db.file.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });
      return file;
    }),
  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    return await db.file.findMany({
      where: {
        userId,
      },
    });
  }),
  createFile: privateProcedure
    .input(
      z.object({
        key: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const createdFile = await db.file.create({
        data: {
          key: input.key,
          name: input.name,
          userId: userId,
          url: getFileUrl(input.key),
          uploadStatus: "PROCESSING",
        },
      });
      return createdFile;
    }),
  deleteFile: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const file = await db.file.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });
      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      await db.file.delete({
        where: {
          id: input.id,
        },
      });
      return file;
    }),
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
