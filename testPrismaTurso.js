const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@libsql/client/web');
const { PrismaLibSQL } = require('@prisma/adapter-libsql');

async function test() {
  const url = process.env.DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  
  const libsql = createClient({
    url: url,
    authToken: authToken,
  });
  
  const adapter = new PrismaLibSQL(libsql);
  const prisma = new PrismaClient({ adapter });

  try {
    const count = await prisma.category.count();
    console.log("Prisma count success! Rows:", count);
  } catch (err) {
    console.error("Prisma count failed!", err);
  }
}

test();
