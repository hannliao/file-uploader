/*
  Warnings:

  - A unique constraint covering the columns `[folderId,name]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[parentId,name]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "File_folderId_name_key" ON "File"("folderId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Folder_parentId_name_key" ON "Folder"("parentId", "name");
