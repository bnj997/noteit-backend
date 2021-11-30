import { UserResponse } from "./UserResponse";
import { Context } from "graphql/context";
import { extendType, nonNull, objectType, stringArg } from "nexus";
import { Note } from "./Note";
import * as argon2 from "argon2";

export const User = objectType({
  name: "User",
  definition(t) {
    t.string("id");
    t.string("email");
    t.list.field("notes", {
      type: Note,
      async resolve(parent, _args, ctx: Context) {
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

// const Role = enumType({
//   name: "Role",
//   members: ["USER", "ADMIN"],
// });

export const RegisterMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("register", {
      type: UserResponse,
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_parent, args, ctx: Context) {
        if (args.password.length < 5) {
          return {
            errors: [
              {
                field: "password",
                message: "Password must be at least 6 characters in length",
              },
            ],
          };
        }

        if (!args.email.includes("@")) {
          return {
            errors: [
              {
                field: "email",
                message: "Invalid email",
              },
            ],
          };
        }

        const duplicateEmail = await ctx.prisma.user.findFirst({
          where: {
            email: args.email,
          },
        });

        if (duplicateEmail) {
          return {
            errors: [
              {
                field: "email",
                message:
                  "Email already found in records, maybe try login instead?",
              },
            ],
          };
        }

        const hashedPassword = await argon2.hash(args.password);
        const userInfo = {
          email: args.email,
          password: hashedPassword,
        };
        const newUser = await ctx.prisma.user.create({
          data: userInfo,
        });
        return {
          user: newUser,
        };
      },
    });
  },
});

export const LoginMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("login", {
      type: UserResponse,
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_parent, args, ctx: Context) {
        const user = await ctx.prisma.user.findFirst({
          where: { email: args.email },
        });

        if (!user) {
          return {
            errors: [
              {
                field: "email",
                message: "That email does not exist",
              },
            ],
          };
        }

        const valid = await argon2.verify(user.password, args.password);
        if (!valid) {
          return {
            errors: [
              {
                field: "password",
                message: "Incorrect password",
              },
            ],
          };
        }
        return {
          user: user,
        };
      },
    });
  },
});
