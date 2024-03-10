/*
  Warnings:

  - Added the required column `tipo_documento` to the `documento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `documento` ADD COLUMN `tipo_documento` ENUM('BILEHTE_IDENTIDADE', 'CARTA_CONDUCAO', 'LIVRETE', 'PASSAPORTE') NOT NULL;
