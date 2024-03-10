-- CreateTable
CREATE TABLE `utilizador` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `palavra_passe` VARCHAR(191) NOT NULL,
    `telefone` INTEGER NOT NULL,
    `data_nascimento` DATETIME(3) NOT NULL,
    `autenticado` ENUM('TRUE', 'FALSE') NOT NULL DEFAULT 'FALSE',
    `banido` ENUM('TRUE', 'FALSE') NOT NULL DEFAULT 'FALSE',
    `codigo_autenticacao` VARCHAR(191) NOT NULL,
    `classe` ENUM('DECIMA', 'PRIMEIRA', 'SEGUNDA', 'TERCEIRA', 'FUNCIONARIO', 'ADMIN') NOT NULL DEFAULT 'DECIMA',
    `curso` ENUM('SETIMA', 'OITAVA', 'NONA', 'INFORMATICA', 'BIOQUIMICA', 'DESENHADOR', 'MAQUINAS', 'ENERGIAS', 'FUNCIONARIO', 'ADMIN') NOT NULL DEFAULT 'INFORMATICA',
    `tipo_utilizador` ENUM('ADMIN', 'ESTUDANTE', 'FUNCIONARIO') NOT NULL DEFAULT 'ESTUDANTE',
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `utilizador_id_key`(`id`),
    UNIQUE INDEX `utilizador_email_key`(`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
