const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const prisma = new PrismaClient();

async function main() {
  const email = "demo@sitesciences.fr";
  const password = "Demo12345*";

  // Hash du mot de passe
  const passwordHash = await bcrypt.hash(password, 12);

  // Prisma exige un id (String) sans valeur par défaut -> on en génère un
  const id = crypto.randomUUID();

  // Date actuelle pour createdAt / updatedAt
  const now = new Date();

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      updatedAt: now, // au cas où le modèle le demande aussi en update
    },
    create: {
      id,
      email,
      passwordHash,
      createdAt: now,
      updatedAt: now,
      // 👉 Si ton schema exige d'autres champs obligatoires, ajoute-les ici.
      // Par exemple :
      // name: "Compte démo",
      // role: "USER",
    },
  });

  console.log("✅ Utilisateur démo prêt :", user.email, "id:", user.id);
}

main()
  .catch((err) => {
    console.error("❌ Erreur lors de la création du user démo :");
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
