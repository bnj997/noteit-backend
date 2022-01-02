import { extendType, objectType } from "nexus";
import { CategoriesOnNotes } from ".";

export const Category = objectType({
  name: "Category",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("creatorId");
    t.nonNull.list.field("notes", {
      type: CategoriesOnNotes,
      async resolve(parent, _args, ctx) {
        return await ctx.prisma.category
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

export const MyCategoriesQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("categories", {
      type: Category,
      async resolve(_, _args, { prisma, req }) {
        const userCategories = await prisma.category.findMany({
          orderBy: {
            id: "desc",
          },
          where: {
            creatorId: req.session.userId,
          },
        });

        return userCategories;
      },
    });
  },
});
