import { PrismaClient } from ".prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: "testemail@gmail.com",
      image:
        "https://media-exp1.licdn.com/dms/image/C5603AQHgOBnFGsNOcg/profile-displayphoto-shrink_200_200/0/1624850244544?e=1642032000&v=beta&t=AY6qPPiK4HT9bzIDIFbHIckedZ4nIDHpYkUJnwDcgfU",
      role: "ADMIN",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
