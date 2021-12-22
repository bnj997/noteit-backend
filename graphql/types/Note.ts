import { extendType, intArg, nonNull, objectType, stringArg } from "nexus";
import { NoteResponse } from "./NoteResponse";

export const Note = objectType({
  name: "Note",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("title");
    t.nonNull.string("description");
    t.nonNull.string("category");
    t.nonNull.string("creatorId");
  },
});

export const NoteQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("note", {
      type: NoteResponse,
      args: {
        id: nonNull(stringArg()),
      },
      async resolve(_parent, args, { prisma }) {
        const note = await prisma.note.findUnique({
          where: {
            id: args.id,
          },
        });

        if (!note) {
          return {
            errors: [
              {
                field: "title",
                message: "Title is required",
              },
            ],
          };
        }

        return {
          note: note,
        };
      },
    });
  },
});

export const Edge = objectType({
  name: "Edges",
  definition(t) {
    t.nonNull.string("cursor");
    t.nonNull.field("node", {
      type: Note,
    });
  },
});

export const PageInfo = objectType({
  name: "PageInfo",
  definition(t) {
    t.nonNull.string("endCursor");
    t.nonNull.boolean("hasNextPage");
  },
});

export const Response = objectType({
  name: "Response",
  definition(t) {
    t.nonNull.field("pageInfo", { type: PageInfo });
    t.nonNull.list.field("edges", {
      type: Edge,
    });
  },
});

export const MyNotesQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("notes", {
      type: Response,
      args: {
        first: nonNull(intArg()),
        after: stringArg(),
      },
      async resolve(_, args, { prisma, req }) {
        let queryResults = null;

        if (args.after) {
          queryResults = await prisma.note.findMany({
            orderBy: {
              updatedAt: "desc",
            },
            where: {
              creatorId: req.session.userId,
            },
            take: args.first,
            skip: 1,
            cursor: {
              id: args.after,
            },
          });
        } else {
          queryResults = await prisma.note.findMany({
            orderBy: {
              updatedAt: "desc",
            },
            where: {
              creatorId: req.session.userId,
            },
            take: args.first,
          });
        }

        if (queryResults.length > 0) {
          // last element
          const lastNoteInResults = queryResults[queryResults.length - 1];
          // cursor we'll return
          const myCursor = lastNoteInResults.id;

          // queries after the cursor to check if we have nextPage
          const secondQueryResults = await prisma.note.findMany({
            orderBy: {
              updatedAt: "desc",
            },
            where: {
              creatorId: req.session.userId,
            },
            take: args.first,
            skip: 1,
            cursor: {
              id: myCursor,
            },
          });

          const result = {
            pageInfo: {
              endCursor: myCursor,
              hasNextPage: secondQueryResults.length > 0,
            },
            edges: queryResults.map((note) => ({
              cursor: note.id,
              node: note,
            })),
          };

          return result;
        }

        return {
          pageInfo: {
            endCursor: "",
            hasNextPage: false,
          },
          edges: [],
        };
      },
    });
  },
});

export const CreateNoteMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createNote", {
      type: NoteResponse,
      args: {
        title: nonNull(stringArg()),
        description: nonNull(stringArg()),
        category: nonNull(stringArg()),
      },
      async resolve(_parent, args, { prisma, req }) {
        if (!args.title) {
          return {
            errors: [
              {
                field: "title",
                message: "Title is required",
              },
            ],
          };
        }

        if (!args.description) {
          return {
            errors: [
              {
                field: "description",
                message: "Description is required",
              },
            ],
          };
        }

        if (!args.category) {
          return {
            errors: [
              {
                field: "category",
                message: "Category",
              },
            ],
          };
        }

        const newNote = prisma.note.create({
          data: {
            title: args.title,
            description: args.description,
            category: args.category,
            creatorId: req.session.userId!,
          },
        });

        return {
          note: newNote,
        };
      },
    });
  },
});

export const UpdateNoteMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateNote", {
      type: NoteResponse,
      args: {
        id: nonNull(stringArg()),
        title: nonNull(stringArg()),
        description: nonNull(stringArg()),
        category: nonNull(stringArg()),
      },
      async resolve(_parent, args, { prisma }) {
        if (!args.title) {
          return {
            errors: [
              {
                field: "title",
                message: "Title is required",
              },
            ],
          };
        }

        if (!args.description) {
          return {
            errors: [
              {
                field: "description",
                message: "Description is required",
              },
            ],
          };
        }

        if (!args.category) {
          return {
            errors: [
              {
                field: "category",
                message: "Category",
              },
            ],
          };
        }

        const updatedNote = await prisma.note.update({
          where: { id: args.id },
          data: {
            title: args.title,
            description: args.description,
            category: args.category,
          },
        });

        return {
          note: updatedNote,
        };
      },
    });
  },
});

export const DeleteNoteMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deleteNote", {
      type: "Boolean",
      args: {
        id: nonNull(stringArg()),
      },
      async resolve(_parent, args, { prisma }) {
        await prisma.note.delete({
          where: { id: args.id },
        });

        return true;
      },
    });
  },
});
