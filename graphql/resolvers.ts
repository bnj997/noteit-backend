import prisma from "../lib/prisma";

export const resolvers = {
  Query: {
    notes: async (_parent, _args, _ctx) => await prisma.note.findMany(),
  },
};
