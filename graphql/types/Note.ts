import { objectType } from "nexus";

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
