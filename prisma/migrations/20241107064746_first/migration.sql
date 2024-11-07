/*
  Warnings:

  - You are about to drop the column `profileImage` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `profileImage` on the `Enabler` table. All the data in the column will be lost.
  - You are about to drop the column `profileImage` on the `Owner` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Customer] DROP COLUMN [profileImage];

-- AlterTable
ALTER TABLE [dbo].[Enabler] DROP COLUMN [profileImage];

-- AlterTable
ALTER TABLE [dbo].[Owner] DROP COLUMN [profileImage];

-- AlterTable
ALTER TABLE [dbo].[User] ADD [profileImage] VARCHAR(500);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
