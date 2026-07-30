import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import { requiredSeedAdminConfig } from "@/lib/securityConfig";

async function main() {
  const { email: adminEmail, username: adminUser, password: adminPassword } =
    requiredSeedAdminConfig();

  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      username: adminUser,
      password: hashedPassword,
    },
    create: {
      username: adminUser,
      email: adminEmail,
      password: hashedPassword,
    },
  });
  console.log("✅ Admin user created");

  // Create sample categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: "Technology" },
      update: {},
      create: { name: "Technology" }
    }),
    prisma.category.upsert({
      where: { name: "Web Development" },
      update: {},
      create: { name: "Web Development" }
    }),
    prisma.category.upsert({
      where: { name: "Programming" },
      update: {},
      create: { name: "Programming" }
    }),
    prisma.category.upsert({
      where: { name: "Tutorials" },
      update: {},
      create: { name: "Tutorials" }
    }),
    prisma.category.upsert({
      where: { name: "Personal" },
      update: {},
      create: { name: "Personal" }
    })
  ]);
  console.log("✅ Categories created");

  // Create sample tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { name: "Next.js" },
      update: {},
      create: { name: "Next.js" }
    }),
    prisma.tag.upsert({
      where: { name: "React" },
      update: {},
      create: { name: "React" }
    }),
    prisma.tag.upsert({
      where: { name: "TypeScript" },
      update: {},
      create: { name: "TypeScript" }
    }),
    prisma.tag.upsert({
      where: { name: "JavaScript" },
      update: {},
      create: { name: "JavaScript" }
    }),
    prisma.tag.upsert({
      where: { name: "CSS" },
      update: {},
      create: { name: "CSS" }
    }),
    prisma.tag.upsert({
      where: { name: "Web Design" },
      update: {},
      create: { name: "Web Design" }
    }),
    prisma.tag.upsert({
      where: { name: "UI/UX" },
      update: {},
      create: { name: "UI/UX" }
    }),
    prisma.tag.upsert({
      where: { name: "Tutorial" },
      update: {},
      create: { name: "Tutorial" }
    })
  ]);
  console.log("✅ Tags created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
