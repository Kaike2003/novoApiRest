/*
  Warnings:

  - Added the required column `entregue` to the `documento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `documento` ADD COLUMN `entregue` BOOLEAN NOT NULL;
