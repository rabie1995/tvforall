const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      id: 'plan_3m',
      name: '3 Months IPTV',
      description: 'Reliable IPTV access for 3 months.',
      priceUsd: 29,
      durationDays: 90
    },
    {
      id: 'plan_6m',
      name: '6 Months IPTV',
      description: 'Half-year IPTV with VOD and sports.',
      priceUsd: 39,
      durationDays: 180
    },
    {
      id: 'plan_12m',
      name: '12 Months IPTV',
      description: 'Best value annual IPTV subscription.',
      priceUsd: 59,
      durationDays: 365
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product
    });
  }

  console.log('Seed complete. Products ready.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
