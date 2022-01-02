import { objectType } from "nexus";

export const CategoriesOnNotes = objectType({
  name: "CategoriesOnNotes",
  definition(t) {
    t.nonNull.string("noteId");
    t.nonNull.string("categoryId");
  },
});
