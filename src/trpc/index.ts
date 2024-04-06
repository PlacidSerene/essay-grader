import { auth, currentUser } from "@clerk/nextjs";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { z } from "zod";
import { UploadStatus } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";
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
  getAiResponse: privateProcedure.query(async ({ ctx }) => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt =
      "You are an IELTS examiner. Your job is to grade IELTS task 2 essays by: providing band score for the essay, providing suggestions, suggest vocabulary . A topic and an essay will be provided below.Topic: There is an increasing trend around the world of married couples deciding not to have children. Discuss the advantages and disadvantages for couples who decide to do this. Essay: An increasing number of married couples around the world choosing to remain childless. The main benefits of not having a child for couples are that they can focus on their careers and have more time for themselves. The main drawbacks are that they could not fit into their peers’ group and have no one to look after them when they get old. One primary advantage of remaining childless for married couples is that they can focus on their work. This is because they have less responsibility and distractions in their lives compared to the couples that have a child. Another advantage of this is that they have more spare time. Looking after a child is a full-time job for parents and taking most of their time, while child-free couples have lots of free time after work. For example, many couples stop going out late with their friends after having a child as they have to stay at home for looking after their children. One disadvantage of couples deciding not to have children is that they can struggle to hang with their peers after most of them have children. Most parents prefer to spend more time with other couples that have children as well. Moreover, they do not have anyone to look after them in their elderliness is another disadvantage. Children are the ones who take care of their parents when they get old because their parents did the same for them when they were young. For instance, the vast majority of the people who live in care homes have no child. In conclusion, the main benefits of staying child-free for couples are that they can be more career-oriented and have more free time for themselves, and the main drawbacks are that they could have problems about fitting into their friends’ group and having no one to take care of them when they become older.";

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
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
