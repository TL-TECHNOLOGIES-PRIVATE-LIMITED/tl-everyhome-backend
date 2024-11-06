BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Customers] (
    [customerId] INT NOT NULL IDENTITY(1,1),
    [phoneNumber] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [provider] VARCHAR(50),
    [providerId] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Customers_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [fullName] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Customers_pkey] PRIMARY KEY CLUSTERED ([customerId]),
    CONSTRAINT [Customers_phoneNumber_key] UNIQUE NONCLUSTERED ([phoneNumber]),
    CONSTRAINT [Customers_email_key] UNIQUE NONCLUSTERED ([email]),
    CONSTRAINT [Customers_providerId_key] UNIQUE NONCLUSTERED ([providerId])
);

-- CreateTable
CREATE TABLE [dbo].[enabler] (
    [enablerId] INT NOT NULL IDENTITY(1,1),
    [fullName] NVARCHAR(1000) NOT NULL,
    [phoneNumber] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [provider] VARCHAR(50),
    [providerId] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [enabler_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [enabler_pkey] PRIMARY KEY CLUSTERED ([enablerId]),
    CONSTRAINT [enabler_phoneNumber_key] UNIQUE NONCLUSTERED ([phoneNumber]),
    CONSTRAINT [enabler_email_key] UNIQUE NONCLUSTERED ([email]),
    CONSTRAINT [enabler_providerId_key] UNIQUE NONCLUSTERED ([providerId])
);

-- CreateTable
CREATE TABLE [dbo].[Addresses] (
    [addressId] INT NOT NULL IDENTITY(1,1),
    [street] NVARCHAR(1000) NOT NULL,
    [city] NVARCHAR(1000) NOT NULL,
    [state] NVARCHAR(1000) NOT NULL,
    [zip] NVARCHAR(1000) NOT NULL,
    [latitude] FLOAT(53) NOT NULL,
    [longitude] FLOAT(53) NOT NULL,
    [isDefault] BIT NOT NULL CONSTRAINT [Addresses_isDefault_df] DEFAULT 0,
    [addressType] NVARCHAR(1000) NOT NULL CONSTRAINT [Addresses_addressType_df] DEFAULT 'HOME',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Addresses_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [customerId] INT,
    [enablerId] INT,
    CONSTRAINT [Addresses_pkey] PRIMARY KEY CLUSTERED ([addressId])
);

-- AddForeignKey
ALTER TABLE [dbo].[Addresses] ADD CONSTRAINT [Addresses_customerId_fkey] FOREIGN KEY ([customerId]) REFERENCES [dbo].[Customers]([customerId]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Addresses] ADD CONSTRAINT [Addresses_enablerId_fkey] FOREIGN KEY ([enablerId]) REFERENCES [dbo].[enabler]([enablerId]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
