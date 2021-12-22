import { objectType } from "nexus";
import { Note } from "./Note";
import { FieldError } from "./UserResponse";

export const NoteResponse = objectType({
  name: "NoteResponse",
  definition(t) {
    t.list.nonNull.field("errors", { type: FieldError });
    t.field("note", { type: Note });
  },
});
