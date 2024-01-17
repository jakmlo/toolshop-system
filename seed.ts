// Prisma seed script

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seed() {
  try {
    // Insert Organizations
    const organizations = await prisma.organization.createMany({
      data: [
        { organizationId: "1", name: "TechCorp" },
        { organizationId: "2", name: "ConstructionCo" },
        { organizationId: "3", name: "HomeRepairs" },
      ],
    });

    // Insert Users
    const users = await prisma.user.createMany({
      data: [
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          password: "password123",
          role: "user",
          photo: "john_photo.png",
          verified: true,
          organizationId: "1",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          password: "password456",
          role: "user",
          photo: "jane_photo.png",
          verified: true,
          organizationId: "2",
        },
        {
          id: "3",
          name: "Bob Johnson",
          email: "bob@example.com",
          password: "password789",
          role: "user",
          photo: "bob_photo.png",
          verified: true,
          organizationId: "3",
        },
      ],
    });

    // Insert Categories
    const categories = await prisma.category.createMany({
      data: [
        { categoryId: "1", name: "Power Tools", organizationId: "1" },
        { categoryId: "2", name: "Hand Tools", organizationId: "1" },
        { categoryId: "3", name: "Machines", organizationId: "2" },
        { categoryId: "4", name: "Gardening Tools", organizationId: "3" },
      ],
    });

    // Insert Contractors
    const contractors = await prisma.contractor.createMany({
      data: [
        {
          contractorId: "1",
          firstName: "Contractor1",
          lastName: "Lastname1",
          address: "Address1",
          phoneNumber: "+1234567890",
          organizationId: "2",
        },
        {
          contractorId: "2",
          firstName: "Contractor2",
          lastName: "Lastname2",
          address: "Address2",
          phoneNumber: "+9876543210",
          organizationId: "2",
        },
        {
          contractorId: "3",
          firstName: "Contractor3",
          lastName: "Lastname3",
          address: "Address3",
          phoneNumber: "+1122334455",
          organizationId: "3",
        },
      ],
    });

    // Insert Tools
    const tools = await prisma.tool.createMany({
      data: [
        {
          toolId: "1",
          name: "Dewalt Drill",
          catalogNumber: "DW1001",
          description: "Cordless drill for various tasks",
          categoryId: "1",
          availability: true,
          organizationId: "1",
        },
        // ... (add other tool entries as needed)
      ],
    });

    // Additional tools with same name and catalogNumber
    const additionalTools = await prisma.tool.createMany({
      data: [
        {
          toolId: "21",
          name: "Dewalt Drill",
          catalogNumber: "DW1001",
          description: "Cordless drill for various tasks",
          categoryId: "1",
          availability: true,
          organizationId: "3",
        },
        {
          toolId: "22",
          name: "Bosch Saw",
          catalogNumber: "BS2001",
          description: "Circular saw for cutting wood",
          categoryId: "1",
          availability: true,
          organizationId: "1",
        },
        // ... (add more additional tool entries as needed)
      ],
    });

    console.log("Database seeding completed!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seed();
