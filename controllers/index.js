const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  async get(req, res) {
    if (!req.user) return res.redirect('/login');

    const homeFolder = await prisma.folder.findFirst({
      where: { userId: req.user.id },
    });

    res.redirect(`/folders/${homeFolder.id}`);
  },
};
