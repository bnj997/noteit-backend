import { PrismaClient } from ".prisma/client";
import { notes } from "../data/notes";

const prisma = new PrismaClient();

async function main() {
  await prisma.note.createMany({
    data: notes,
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
