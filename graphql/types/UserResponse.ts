import { objectType } from "nexus";
import { User } from "./User";

export const FieldError = objectType({
  name: "FieldError",
  definition(t) {
    t.nonNull.string("field");
    t.nonNull.string("message");
  },
});

export const UserResponse = objectType({
  name: "UserResponse",
  definition(t) {
    t.list.nonNull.field("errors", { type: FieldError });
    t.field("user", { type: User });
  },
});
