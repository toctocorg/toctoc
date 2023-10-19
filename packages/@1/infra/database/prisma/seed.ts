/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import { faker } from "@faker-js/faker";
import { CategoryContext, ProfileRole } from "@prisma/client";
import process from "node:process";
import slugify from "slugify";
import prisma from "../index";

async function main() {
  await prisma.user.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.studient.deleteMany();
  await prisma.exchange.deleteMany();

  await prisma.category.deleteMany();

  //

  await categories();

  await studients();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

//
//
//

async function studient() {
  const { image, name } = {
    image: faker.image.avatar(),
    name: faker.person.fullName(),
  };

  const [category_autres] = await Promise.all([
    prisma.category.findFirstOrThrow({
      where: { slug: "autres" },
    }),
  ]);

  return prisma.studient.create({
    data: {
      exchange: {
        create: {
          active: true,
          description: faker.lorem.paragraph(),
          is_online: true,
          places: 1,
          title: faker.lorem.sentence(),
          type: "RESEARCH",
          location: faker.location.city(),
          category_id: category_autres.id,
        },
      },
      profile: {
        create: {
          image,
          name,
          role: ProfileRole.STUDIENT,
          user: {
            create: {
              email: faker.internet.email().toLowerCase(),
              image,
              name,
            },
          },
        },
      },
    },
  });
}

async function studients() {
  const [foo, bar] = await Promise.all([studient(), studient()]);

  const foo_exchange_1 = await prisma.exchange.findFirstOrThrow({
    where: { owner_id: foo.id },
  });

  await prisma.exchange.update({
    data: { participants: { connect: { id: bar.id } } },
    where: { id: foo_exchange_1.id },
  });
  // const exchange_foo_bar = prisma.exchange.findFirst({where: {owner_id: foo.id})
}

async function categories() {
  await prisma.category.createMany({
    data: [
      {
        name: "Autres",
        slug: "autres",
        contexts: [
          CategoryContext.EXCHANGE,
          CategoryContext.FORUM,
          CategoryContext.OPPORTUNITY,
        ],
      },
      {
        name: "Échange de langue",
        contexts: [CategoryContext.EXCHANGE],
      },
      {
        name: "Notes des cours",
        contexts: [CategoryContext.EXCHANGE],
      },
      {
        name: "Activités",
        contexts: [CategoryContext.EXCHANGE, CategoryContext.FORUM],
      },
      {
        name: "Cours de français",
        contexts: [CategoryContext.OPPORTUNITY],
      },
      {
        name: "Bourses",
        contexts: [CategoryContext.OPPORTUNITY, CategoryContext.FORUM],
      },
      {
        name: "Logements",
        contexts: [CategoryContext.OPPORTUNITY, CategoryContext.FORUM],
      },
      {
        name: "Job étudiant",
        contexts: [CategoryContext.OPPORTUNITY, CategoryContext.FORUM],
      },
      {
        name: "Concours",
        contexts: [CategoryContext.OPPORTUNITY, CategoryContext.FORUM],
      },
      {
        name: "Aide financière",
        contexts: [CategoryContext.OPPORTUNITY, CategoryContext.FORUM],
      },
      {
        name: "Administratifs",
        contexts: [CategoryContext.FORUM],
      },
    ].map((data) => ({ ...data, slug: slugify(data.name.toLowerCase()) })),
  });
}
