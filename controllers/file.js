const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function viewFileGet(req, res, next) {
  const fileId = parseInt(req.params.id);

  const file = await prisma.file.findUnique({
    where: { id: fileId },
  });

  if (!file) {
    const error = new Error('File not found.');
    error.statusCode = 404;
    return next(error);
  }

  res.render('index', {
    title: file.name,
    main: 'partials/file-details',
    user: req.user,
    file,
  });
}

module.exports = {
  viewFileGet,
};
