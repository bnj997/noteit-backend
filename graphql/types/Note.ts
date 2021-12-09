import { extendType, nonNull, objectType, stringArg } from "nexus";

export const Note = objectType({
  name: "Note",
  definition(t) {
    t.string("id");
    t.string("title");
    t.string("description");
    t.string("category");
    t.string("creatorId");
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
      type: Note,
      args: {
        id: nonNull(stringArg()),
        title: nonNull(stringArg()),
        description: nonNull(stringArg()),
        category: nonNull(stringArg()),
      },
      async resolve(_parent, args, { prisma }) {
        return await prisma.note.update({
          where: { id: args.id },
          data: {
            title: args.title,
            description: args.description,
            category: args.category,
          },
        });
      },
    });
  },
});

export const DeleteNoteMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deleteNote", {
      type: Note,
      args: {
        id: nonNull(stringArg()),
      },
      async resolve(_parent, args, { prisma }) {
        return await prisma.note.delete({
          where: { id: args.id },
        });
      },
    });
  },
});
