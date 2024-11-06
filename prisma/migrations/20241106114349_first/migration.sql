BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] VARCHAR(128) NOT NULL,
    [phoneNumber] VARCHAR(15) NOT NULL,
    [email] VARCHAR(100),
    [isVerified] BIT NOT NULL CONSTRAINT [User_isVerified_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_phoneNumber_key] UNIQUE NONCLUSTERED ([phoneNumber]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Role] (
    [id] UNIQUEIDENTIFIER NOT NULL,
    [name] VARCHAR(50) NOT NULL,
    CONSTRAINT [Role_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Role_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[UserRole] (
    [userId] VARCHAR(128) NOT NULL,
    [roleId] UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT [UserRole_pkey] PRIMARY KEY CLUSTERED ([userId],[roleId])
);

-- CreateTable
CREATE TABLE [dbo].[Customer] (
    [id] UNIQUEIDENTIFIER NOT NULL,
    [userId] VARCHAR(128) NOT NULL,
    [fullName] NVARCHAR(50) NOT NULL,
    [address] NVARCHAR(200),
    [profileImage] VARCHAR(500),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Customer_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Customer_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Customer_userId_key] UNIQUE NONCLUSTERED ([userId])
);

-- CreateTable
CREATE TABLE [dbo].[Enabler] (
    [id] UNIQUEIDENTIFIER NOT NULL,
    [userId] VARCHAR(128) NOT NULL,
    [fullName] NVARCHAR(50) NOT NULL,
    [experience] NVARCHAR(50) NOT NULL,
    [description] NVARCHAR(500),
    [profileImage] VARCHAR(500),
    [hourRate] FLOAT NOT NULL CONSTRAINT [Enabler_hourRate_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Enabler_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Enabler_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Enabler_userId_key] UNIQUE NONCLUSTERED ([userId])
);

-- CreateTable
CREATE TABLE [dbo].[Owner] (
    [id] UNIQUEIDENTIFIER NOT NULL,
    [userId] VARCHAR(128) NOT NULL,
    [firstName] NVARCHAR(50) NOT NULL,
    [lastName] NVARCHAR(50) NOT NULL,
    [companyName] NVARCHAR(100),
    [businessType] VARCHAR(50),
    [taxId] VARCHAR(50),
    [profileImage] VARCHAR(500),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Owner_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Owner_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Owner_userId_key] UNIQUE NONCLUSTERED ([userId])
);

-- CreateTable
CREATE TABLE [dbo].[DeviceToken] (
    [id] UNIQUEIDENTIFIER NOT NULL,
    [userId] VARCHAR(128) NOT NULL,
    [token] VARCHAR(500) NOT NULL,
    [device] VARCHAR(100) NOT NULL,
    [isActive] BIT NOT NULL CONSTRAINT [DeviceToken_isActive_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [DeviceToken_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [DeviceToken_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[AuthSession] (
    [id] UNIQUEIDENTIFIER NOT NULL,
    [userId] VARCHAR(128) NOT NULL,
    [token] VARCHAR(500) NOT NULL,
    [device] VARCHAR(100),
    [ipAddress] VARCHAR(50),
    [expiresAt] DATETIME2 NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [AuthSession_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [AuthSession_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AuthSession_token_key] UNIQUE NONCLUSTERED ([token])
);

-- AddForeignKey
ALTER TABLE [dbo].[UserRole] ADD CONSTRAINT [UserRole_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[UserRole] ADD CONSTRAINT [UserRole_roleId_fkey] FOREIGN KEY ([roleId]) REFERENCES [dbo].[Role]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Customer] ADD CONSTRAINT [Customer_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Enabler] ADD CONSTRAINT [Enabler_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Owner] ADD CONSTRAINT [Owner_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DeviceToken] ADD CONSTRAINT [DeviceToken_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AuthSession] ADD CONSTRAINT [AuthSession_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
