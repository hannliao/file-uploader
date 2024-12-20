const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const { uploadFile, downloadFile } = require('../utils/supabase');
const { v4: uuidv4 } = require('uuid');
const { formatSize, formatDate } = require('../utils/format');

async function viewFileGet(req, res, next) {
  try {
    const filePath = req.params.filePath;

    const file = await prisma.file.findUnique({
      where: { path: filePath },
    });

    file.formattedSize = formatSize(file.size);
    file.formattedDate = formatDate(file.createdAt);

    const currentFolder = await prisma.folder.findUnique({
      where: { id: file.folderId },
    });

    res.render('index', {
      title: file.name,
      main: 'partials/file-details',
      user: req.user,
      currentFolder,
      file,
    });
  } catch (err) {
    console.error('Error loading files:', err);
    const error = new Error('File not found.');
    error.statusCode = 404;
    return next(error);
  }
}

async function uploadFilePost(req, res, next) {
  try {
    if (!req.file) {
      const error = new Error('No file uploaded.');
      error.statusCode = 400;
      return next(error);
    }

    const folderId = parseInt(req.params.id);
    const currentFolder = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    const { originalname, mimetype, size, buffer } = req.file;
    const filePath = uuidv4();
    const mimeType =
      mimetype || req.file.mimetype || 'application/octet-stream';

    await uploadFile(filePath, buffer);

    await prisma.file.create({
      data: {
        name: originalname,
        size: size,
        folderId: currentFolder.id,
        path: filePath,
        mimetype: mimeType,
      },
    });
    res.redirect(`/folders/${folderId}`);
  } catch (err) {
    console.error('Error during file upload:', err);
    const error = new Error('File upload failed.');
    return next(error);
  }
}

async function downloadFileGet(req, res, next) {
  try {
    const filePath = req.params.filePath;
    const data = await downloadFile(filePath);
    const fileRecord = await prisma.file.findUnique({
      where: { path: filePath },
    });
    if (!fileRecord) {
      throw new Error('File record not found in database.');
    }
    const mimeType = fileRecord.mimetype || 'application/octet-stream';

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${fileRecord.name}`
    );
    res.setHeader('Content-Type', mimeType);
    res.end(Buffer.from(await data.arrayBuffer()));
  } catch (err) {
    console.error('Error during file download:', err);
    const error = new Error('File download failed.');
    return next(error);
  }
}

module.exports = {
  viewFileGet,
  uploadFilePost,
  downloadFileGet,
};
