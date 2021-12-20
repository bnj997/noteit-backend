import { extendType, nonNull, objectType, stringArg } from "nexus";
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
