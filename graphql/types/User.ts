import { enumType, objectType } from "nexus";
import { Note } from "./Note";

export const User = objectType({
  name: "User",
  definition(t) {
    t.string("id");
    t.string("email");
    t.string("image");
    t.field("role", { type: Role });
    t.list.field("notes", {
      type: Note,
      async resolve(parent, _args, ctx) {
        return await ctx.prisma.user
          .findUnique({
            where: {
              id: parent.id!,
            },
          })
          .notes();
      },
    });
  },
});

const Role = enumType({
  name: "Role",
  members: ["USER", "ADMIN"],
});
