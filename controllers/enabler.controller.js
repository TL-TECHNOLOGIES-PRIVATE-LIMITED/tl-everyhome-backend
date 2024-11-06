
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const login = async (req, res) => {
    const { fullName, phoneNumber, email, name, provider, providerId } = req.body;
    try {
        const enabler = await prisma.enabler.create({
            data: {
                fullName,
                phoneNumber,
                email,
                name,
                provider,
                providerId
            }
        });
        res.status(200).json(enabler);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error occured while creating enabler" });
    }
}

export const addAddress = async (req, res) => {
    const { enablerId, street, city, state, zip, latitude, longitude, addressType } = req.body;
    try {
        const address = await prisma.address.create({
            data: {
                enablerId,
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