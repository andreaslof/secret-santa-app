import { PrismaClient, Prisma, Member } from '@/app/generated/prisma'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
  {
    email: 'alice@example.com',
    name: 'Alice',
    wishlist: {
      create: [{ title: 'Coffee Mug', description: 'Black ceramic mug' }, { title: 'Headphones' }],
    },
  },
  {
    email: 'bob@example.com',
    name: 'Bob',
    wishlist: {
      create: [{ title: 'Book: Dune' }, { title: 'Bluetooth Speaker' }],
    },
  },
  {
    email: 'charlie@example.com',
    name: 'Charlie',
    wishlist: {
      create: [{ title: 'Desk Plant' }, { title: 'Gift Card', description: 'Amazon or similar' }],
    },
  },
]

type UserWithWishlist = Prisma.UserGetPayload<{
  include: { wishlist: true }
}>

export async function main() {
  // create Exchange
  const exchange = await prisma.exchange.create({
    data: {
      name: 'Summer Santa Bonanza 2025',
    },
  })

  const users: UserWithWishlist[] = []
  const members: Member[] = []

  // create Users and Members
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
      include: {
        wishlist: true,
      },
    })
    const member = await prisma.member.create({
      data: {
        userId: user.id,
        exchangeId: exchange.id,
      },
    })

    users.push(user)
    members.push(member)
  }

  const [aliceUser, bobUser, charlieUser] = users
  const [alice, bob, charlie] = members

  // configure Assignments (loop: Alice → Bob → Charlie → Alice)
  await prisma.assignment.create({
    data: {
      exchangeId: exchange.id,
      giverId: alice.id,
      receiverId: bob.id,
      selectedWishlistItemId: bobUser.wishlist[0].id,
      giftGivenAt: new Date(),
    },
  })

  await prisma.assignment.create({
    data: {
      exchangeId: exchange.id,
      giverId: bob.id,
      receiverId: charlie.id,
      selectedWishlistItemId: charlieUser.wishlist[0].id,
      customGiftTitle: 'Small Monstera Plant',
      giftGivenAt: new Date(),
    },
  })

  await prisma.assignment.create({
    data: {
      exchangeId: exchange.id,
      giverId: charlie.id,
      receiverId: alice.id,
      selectedWishlistItemId: aliceUser.wishlist[0].id,
      giftGivenAt: new Date(),
    },
  })

  console.log(`✅ Seed completed - created ${userData.length} users, 1 exchange, 3 assignments`)
}

main()
