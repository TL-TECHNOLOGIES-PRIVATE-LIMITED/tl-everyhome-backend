import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();




export const addAddress = async (req, res) => {
    const { street, city, state, zip, latitude, longitude, addressType } = req.body;
    const userId = req.user.uid;
    try {
        const customer = await prisma.customer.findUnique({
            where: { userId },
        });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        const existingAddresses = await prisma.customerAddress.findMany({
            where: {
                customerId: customer.id
            }
        });

        const isDefault = existingAddresses.length === 0;

        // Create the new address
        const address = await prisma.customerAddress.create({
            data: {
                customerId: customer.id,
                addressType: addressType,
                isDefault: isDefault,
                address: street,
                city,
                state,
                zipCode: zip,
                latitude,
                longitude
            }
        });
        res.status(200).json({ message: "Address added successfully", address });
    } catch (error) {
        console.log('Error occurred while adding customer address:', error);
        res.status(500).json({ message: "Error occurred while creating address" });
    }
};


export const updateDefaultAddress = async (req, res) => {
    const { addressId } = req.params;  // Get addressId from the URL params
    const userId = req.user.uid;  // User ID from Firebase token

    try {
        // Find the customer associated with the user
        const customer = await prisma.customer.findUnique({
            where: { userId },
        });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Find the address by the provided addressId
        const address = await prisma.customerAddress.findUnique({
            where: {
                customerId: customer.id,  // Corrected this line
                id: addressId
            }
        });

        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }

        // Set all other addresses for this customer to isDefault: false
        await prisma.customerAddress.updateMany({
            where: {
                customerId: customer.id,  // Corrected this line as well
                id: { not: addressId },  // Exclude the address being set as default
            },
            data: {
                isDefault: false
            }
        });

        // Set the selected address as default
        const updatedAddress = await prisma.customerAddress.update({
            where: {
                customerId: customer.id,  // Corrected this line as well
                id: addressId
            },
            data: {
                isDefault: true
            }
        });

        res.status(200).json({ message: "Address updated successfully", updatedAddress });
    } catch (error) {
        console.error('Error occurred while updating default address:', error);
        res.status(500).json({ message: "Error occurred while updating address" });
    }
};