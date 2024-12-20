const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function viewFolderGet(req, res, next) {
  try {
    const folderId = parseInt(req.params.id);
    const currentFolder = await prisma.folder.findUnique({
      where: { id: folderId },
      include: {
        parent: true,
        children: true,
        files: true,
      },
    });

    if (!currentFolder || currentFolder.userId !== req.user.id) {
      const error = new Error('Folder not found.');
      error.statusCode = 404;
      return next(error);
    }

    res.render('index', {
      title: currentFolder.name,
      main: 'partials/folder',
      user: req.user,
      currentFolder,
      parent: currentFolder.parent,
      children: currentFolder.children,
      files: currentFolder.files,
    });
  } catch (err) {
    next(err);
  }
}

async function createFolderPost(req, res, next) {
  try {
    const folderId = parseInt(req.params.id);
    await prisma.folder.create({
      data: {
        name: req.body.name,
        userId: req.user.id,
        parentId: folderId,
      },
    });

    res.redirect(`/folders/${folderId}`);
  } catch (err) {
    next(err);
  }
}

async function updateFolderPost(req, res, next) {
  try {
    const folderId = parseInt(req.params.id);
    await prisma.folder.update({
      where: { id: folderId, userId: req.user.id },
      data: { name: req.body.name },
    });
    res.redirect(`/folders/${folderId}`);
  } catch (err) {
    next(err);
  }
}

async function deleteFolderPost(req, res, next) {
  try {
    const folderId = parseInt(req.params.id);
    const currentFolder = await prisma.folder.findUnique({
      where: { id: folderId },
    });
    await prisma.folder.delete({
      where: { id: folderId, userId: req.user.id },
    });
    res.redirect(`/folders/${currentFolder.parentId}`);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  viewFolderGet,
  createFolderPost,
  updateFolderPost,
  deleteFolderPost,
};
