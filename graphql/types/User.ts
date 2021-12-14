import { UserResponse } from "./UserResponse";
import { extendType, nonNull, objectType, stringArg } from "nexus";
import { Note } from "./Note";
import * as argon2 from "argon2";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../../src/constants";
import { sendEmail } from "../../utils/sendEmail";
import { v4 as uuidv4 } from "uuid";

export const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("username");
    t.nonNull.string("email");
    t.nonNull.list.field("notes", {
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

// const Role = enumType({
//   name: "Role",
//   members: ["USER", "ADMIN"],
// });

export const MeQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("me", {
      type: User,
      async resolve(_parent, _args, { req, prisma }) {
        if (!req.session.userId) {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: {
            id: req.session.userId,
          },
        });

        return user;
      },
    });
  },
});

export const RegisterMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("register", {
      type: UserResponse,
      args: {
        username: nonNull(stringArg()),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_parent, args, { prisma, req }) {
        if (args.password.length < 6) {
          return {
            errors: [
              {
                field: "password",
                message: "Password must be at least 6 characters in length",
              },
            ],
          };
        }

        if (args.password.length === 0) {
          return {
            errors: [
              {
                field: "password",
                message: "Please enter a password",
              },
            ],
          };
        }

        if (!args.email.includes("@")) {
          return {
            errors: [
              {
                field: "email",
                message: "Invalid email address",
              },
            ],
          };
        }

        const duplicateEmail = await prisma.user.findFirst({
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

        if (args.username.length < 5) {
          return {
            errors: [
              {
                field: "username",
                message: "Username must be at least 5 characters in length",
              },
            ],
          };
        }

        const duplicateUsername = await prisma.user.findFirst({
          where: {
            username: args.username,
          },
        });

        if (duplicateUsername) {
          return {
            errors: [
              {
                field: "username",
                message:
                  "Username already found in records, maybe try login instead?",
              },
            ],
          };
        }

        const hashedPassword = await argon2.hash(args.password);
        const userInfo = {
          username: args.username,
          email: args.email,
          password: hashedPassword,
        };
        const newUser = await prisma.user.create({
          data: userInfo,
        });

        req.session.userId = newUser.id;

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
    t.nonNull.field("login", {
      type: UserResponse,
      args: {
        username: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_parent, args, { prisma, req }) {
        const user = await prisma.user.findFirst({
          where: {
            username: args.username,
          },
        });

        if (!user) {
          return {
            errors: [
              {
                field: "username",
                message: "That username does not exist",
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

        req.session.userId = user.id;

        return {
          user: user,
        };
      },
    });
  },
});

export const ForgotPasswordMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("forgotPassword", {
      type: "Boolean",
      args: {
        email: nonNull(stringArg()),
      },
      async resolve(_parent, args, { prisma, redis }) {
        const user = await prisma.user.findFirst({
          where: { email: args.email },
        });

        if (!user) {
          return true;
        }

        const token = uuidv4();
        await redis.set(
          FORGET_PASSWORD_PREFIX + token,
          user.id,
          "ex",
          1000 * 60 * 60 * 24 * 3 //3 days
        );

        await sendEmail(
          args.email,
          `<a href="http://localhost:3000/change-password/${token}">reset password</a>`
        );

        return true;
      },
    });
  },
});

export const ChangePasswordMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("changePassword", {
      type: UserResponse,
      args: {
        token: nonNull(stringArg()),
        newPassword: nonNull(stringArg()),
      },
      async resolve(_parent, args, { req, prisma, redis }) {
        if (args.newPassword.length < 5) {
          return {
            errors: [
              {
                field: "password",
                message: "Password must be at least 6 characters in length",
              },
            ],
          };
        }

        if (args.newPassword.length === 0) {
          return {
            errors: [
              {
                field: "password",
                message: "Please enter a password",
              },
            ],
          };
        }

        const key = FORGET_PASSWORD_PREFIX + args.token;
        const userId = await redis.get(key);

        if (!userId) {
          return {
            errors: [
              {
                field: "token",
                message: "Token has expired",
              },
            ],
          };
        }

        const user = await prisma.user.findFirst({
          where: { id: userId },
        });

        if (!user) {
          return {
            errors: [
              {
                field: "token",
                message: "User no longer exists",
              },
            ],
          };
        }

        const updatedUser = await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            password: await argon2.hash(args.newPassword),
          },
        });

        await redis.del(key);

        req.session.userId = userId;

        return {
          user: updatedUser,
        };
      },
    });
  },
});

export const logoutMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("logout", {
      type: "Boolean",
      async resolve(_parent, _, { req, res }) {
        return new Promise((resolveSess) => {
          req.session.destroy((err: Error) => {
            res.clearCookie(COOKIE_NAME);
            if (err) {
              console.log(err);
              resolveSess(false);
              return;
            }

            resolveSess(true);
          });
        });
      },
    });
  },
});
