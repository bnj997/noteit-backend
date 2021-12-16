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

export const NotesQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("notes", {
      type: Note,
      async resolve(_parent, _args, { prisma }) {
        const result = await prisma.note.findMany();
        return result;
      },
    });
  },
});

export const CreateNoteMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createNote", {
      type: Note,
      args: {
        title: nonNull(stringArg()),
        description: nonNull(stringArg()),
        category: nonNull(stringArg()),
        creatorId: nonNull(stringArg()),
      },
      async resolve(_parent, args, { prisma }) {
        const newNote = {
          title: args.title,
          description: args.description,
          category: args.category,
          creatorId: args.creatorId,
        };
        return await prisma.note.create({
          data: newNote,
        });
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
