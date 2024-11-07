import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();




export const getProfile = async (req, res) => {
    const userId = "Jq3jgY85GtXOSAGMjEXgMPjLHhx2"

    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
          customer: true,
          enabler: true,
          owner: true,
        },
      });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Determine the active role
      const activeRole = user.roles.length > 0 ? user.roles[0].role : null;
  
      // Fetch the role-specific data
      let roleData = null;
      if (activeRole) {
        if (activeRole.name === 'Customer') {
          roleData = user.customer;
        } else if (activeRole.name === 'Enabler') {
          roleData = user.enabler;
        } else if (activeRole.name === 'Owner') {
          roleData = user.owner;
        }
      }
  
      // Construct the response
      const response = {
        id: user.id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        authProvider: user.authProvider,
        profileImage: user.profileImage,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        roles: user.roles.map((userRole) => ({
          roleId: userRole.role.id,
          name: userRole.role.name,
        })),
        activeRole: activeRole
          ? {
              roleId: activeRole.id,
              name: activeRole.name,
              ...roleData,
            }
          : null,
      };
  
      return res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching the profile' });
    }
};


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