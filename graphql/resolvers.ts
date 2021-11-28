import { Context } from "./context";

export const resolvers = {
  Query: {
    notes: async (_parent, _args, ctx: Context) =>
      await ctx.prisma.note.findMany(),
  },
};
