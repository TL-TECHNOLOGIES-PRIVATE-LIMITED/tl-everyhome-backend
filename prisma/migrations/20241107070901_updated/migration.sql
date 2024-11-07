BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[CustomerAddress] (
    [id] UNIQUEIDENTIFIER NOT NULL,
    [customerId] UNIQUEIDENTIFIER NOT NULL,
    [addressType] VARCHAR(20) NOT NULL CONSTRAINT [CustomerAddress_addressType_df] DEFAULT 'Home',
    [isDefault] BIT NOT NULL CONSTRAINT [CustomerAddress_isDefault_df] DEFAULT 0,
    [address] NVARCHAR(200) NOT NULL,
    [city] NVARCHAR(50) NOT NULL,
    [state] NVARCHAR(50) NOT NULL,
    [zipCode] NVARCHAR(50) NOT NULL,
    [latitude] FLOAT NOT NULL,
    [longitude] FLOAT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [CustomerAddress_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [CustomerAddress_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[EnablerAddress] (
    [id] UNIQUEIDENTIFIER NOT NULL,
    [enablerId] UNIQUEIDENTIFIER NOT NULL,
    [addressType] VARCHAR(20) NOT NULL CONSTRAINT [EnablerAddress_addressType_df] DEFAULT 'Home',
    [isDefault] BIT NOT NULL CONSTRAINT [EnablerAddress_isDefault_df] DEFAULT 0,
    [address] NVARCHAR(200) NOT NULL,
    [city] NVARCHAR(50) NOT NULL,
    [state] NVARCHAR(50) NOT NULL,
    [zipCode] NVARCHAR(50) NOT NULL,
    [latitude] FLOAT NOT NULL,
    [longitude] FLOAT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [EnablerAddress_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [EnablerAddress_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[OwnerAddress] (
    [id] UNIQUEIDENTIFIER NOT NULL,
    [ownerId] UNIQUEIDENTIFIER NOT NULL,
    [addressType] VARCHAR(20) NOT NULL CONSTRAINT [OwnerAddress_addressType_df] DEFAULT 'Home',
    [isDefault] BIT NOT NULL CONSTRAINT [OwnerAddress_isDefault_df] DEFAULT 0,
    [address] NVARCHAR(200) NOT NULL,
    [city] NVARCHAR(50) NOT NULL,
    [state] NVARCHAR(50) NOT NULL,
    [zipCode] NVARCHAR(50) NOT NULL,
    [latitude] FLOAT NOT NULL,
    [longitude] FLOAT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [OwnerAddress_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [OwnerAddress_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[CustomerAddress] ADD CONSTRAINT [CustomerAddress_customerId_fkey] FOREIGN KEY ([customerId]) REFERENCES [dbo].[Customer]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[EnablerAddress] ADD CONSTRAINT [EnablerAddress_enablerId_fkey] FOREIGN KEY ([enablerId]) REFERENCES [dbo].[Enabler]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[OwnerAddress] ADD CONSTRAINT [OwnerAddress_ownerId_fkey] FOREIGN KEY ([ownerId]) REFERENCES [dbo].[Owner]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
