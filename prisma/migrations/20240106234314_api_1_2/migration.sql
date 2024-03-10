-- CreateTable
CREATE TABLE `documento` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `numero_identificacao` VARCHAR(191) NOT NULL,
    `filicao` VARCHAR(191) NOT NULL,
    `foto` VARCHAR(191) NOT NULL,
    `local` VARCHAR(191) NOT NULL,
    `data` DATETIME(3) NOT NULL,
    `telefone` INTEGER NOT NULL,
    `achado` BOOLEAN NOT NULL,
    `perdido` BOOLEAN NOT NULL,
    `publicado` BOOLEAN NOT NULL,
    `aprovado` BOOLEAN NOT NULL,
    `utilizadorId` VARCHAR(191) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `documento_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `documento` ADD CONSTRAINT `documento_utilizadorId_fkey` FOREIGN KEY (`utilizadorId`) REFERENCES `utilizador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
