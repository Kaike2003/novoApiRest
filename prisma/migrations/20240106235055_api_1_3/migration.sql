/*
  Warnings:

  - A unique constraint covering the columns `[telefone]` on the table `utilizador` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `utilizador_telefone_key` ON `utilizador`(`telefone`);
