import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    await prisma.store.create({data: {
        name: "初芝駅前店",
        mail: "hatsushiba-ekimae@kaitori-daikichi.jp"
    }});
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });