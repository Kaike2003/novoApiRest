/*
  Warnings:

  - The values [BILEHTE_IDENTIDADE] on the enum `documento_tipo_documento` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `documento` MODIFY `tipo_documento` ENUM('BILHETE_IDENTIDADE', 'CARTA_CONDUCAO', 'LIVRETE', 'PASSAPORTE') NOT NULL;
