import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();



export const login = async (req, res) => {
    const { fullName, phoneNumber, email, name, provider, providerId } = req.body;
    try {
        const customer = await prisma.customer.create({
            data: {
                fullName,
                phoneNumber,
                email,
                name,
                provider,
                providerId
            }
        });
        res.status(200).json(customer);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error occured while creating customer" });
    }
}

export const addAddress = async (req, res) => {
    const { customerId, street, city, state, zip, latitude, longitude, addressType } = req.body;
    try {
        const address = await prisma.address.create({
            data: {
                customerId,
                street,
                city,
                state,
                zip,
                latitude,
                longitude,
                addressType
            }
        });
        res.status(200).json(address);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error occured while creating address" });
    }
}