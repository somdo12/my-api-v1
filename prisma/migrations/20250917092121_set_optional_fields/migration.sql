-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_user_role_fkey`;

-- DropIndex
DROP INDEX `User_user_role_fkey` ON `user`;

-- AlterTable
ALTER TABLE `user` MODIFY `user_name` VARCHAR(191) NULL,
    MODIFY `user_role` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_user_role_fkey` FOREIGN KEY (`user_role`) REFERENCES `tb_role`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
