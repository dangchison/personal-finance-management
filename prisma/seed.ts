import { PrismaClient, TransactionType } from '@prisma/client'

const prisma = new PrismaClient()

const defaultCategories = [
  { name: 'Ăn uống', type: TransactionType.EXPENSE },
  { name: 'Di chuyển', type: TransactionType.EXPENSE },
  { name: 'Mua sắm', type: TransactionType.EXPENSE },
  { name: 'Giải trí', type: TransactionType.EXPENSE },
  { name: 'Hóa đơn & Tiện ích', type: TransactionType.EXPENSE },
  { name: 'Sức khỏe', type: TransactionType.EXPENSE },
  { name: 'Giáo dục', type: TransactionType.EXPENSE },
  { name: 'Lương', type: TransactionType.INCOME },
  { name: 'Thưởng', type: TransactionType.INCOME },
  { name: 'Đầu tư', type: TransactionType.INCOME },
  { name: 'Gia đình', type: TransactionType.EXPENSE },
  { name: 'Khác', type: TransactionType.EXPENSE },
]

async function main() {
  console.log('Start seeding...')

  for (const cat of defaultCategories) {
    const existing = await prisma.category.findFirst({
      where: {
        name: cat.name,
        type: cat.type,
        isDefault: true
      }
    })

    if (!existing) {
      await prisma.category.create({
        data: {
          name: cat.name,
          type: cat.type,
          isDefault: true
        }
      })
      console.log(`Created category: ${cat.name}`)
    } else {
      console.log(`Category already exists: ${cat.name}`)
    }
  }

  // Seed Admin User
  const adminEmail = 'admin@example.com';
  const adminUsername = 'admin';
  const adminPassword = 'Abcd@1234';
  const hashedPassword = await import('bcryptjs').then(bcrypt => bcrypt.hash(adminPassword, 10));

  const existingAdmin = await prisma.user.findFirst({
    where: {
      OR: [
        { email: adminEmail },
        { username: adminUsername }
      ]
    }
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        username: adminUsername,
        name: 'Admin User',
        passwordHash: hashedPassword,
        role: 'ADMIN'
      }
    });
    console.log(`Created admin user: ${adminUsername} / ${adminPassword}`);
  } else {
    console.log('Admin user already exists');
  }

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
