import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();


export const adduser = async (req, res) => {
    const { email, name } = req.body;

    try {
        // Create a new user in the database
        const user = await prisma.user.create({
            data: {
                email,
                name,
            },
        });

        // Respond with the created user
        res.status(201).json(user);
    } catch (error) {
        // Handle errors, such as unique constraint violations
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Email already exists.' });
        }
        console.log(error);
        res.status(500).json({ error: 'An error occurred while creating the user.' });
    }

};