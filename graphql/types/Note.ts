import { extendType, objectType } from "nexus";
import { Context } from "../context";

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
      type: "Note",
      resolve(_parent, _args, ctx: Context) {
        return ctx.prisma.note.findMany();
      },
    });
  },
});
