import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createAccount = async (req, res) => {
  const { phoneNumber, userType, fullName } = req.body;
  
  // Validate required fields
  if (!phoneNumber || !userType) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Validate userType
  const validUserTypes = ['customer', 'enabler', 'owner'];
  if (!validUserTypes.includes(userType.toLowerCase())) {
    return res.status(400).json({ error: 'Invalid user type' });
  }

  try {
    const id = req.user.uid;

    // Create or update user in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // 1. Create or update base user
      const user = await prisma.user.upsert({
        where: { id },
        create: {
          id,
          phoneNumber,
          isVerified: true
        },
        update: {
          phoneNumber,
          isVerified: true
        }
      });

      // 2. Get or create role
      const role = await prisma.role.upsert({
        where: { name: userType.toLowerCase() },
        create: { name: userType.toLowerCase() },
        update: {}
      });

      // 3. Create UserRole association
      await prisma.userRole.upsert({
        where: {
          userId_roleId: {
            userId: user.id,
            roleId: role.id
          }
        },
        create: {
          userId: user.id,
          roleId: role.id
        },
        update: {}
      });

      // 4. Create specific user type record based on userType
      switch (userType.toLowerCase()) {
        case 'customer':
          await prisma.customer.create({
            data: {
              userId: user.id,
              fullName
            }
          });
          break;

        case 'enabler':
          await prisma.enabler.create({
            data: {
              userId: user.id,
              fullName,
              experience: 'New'
            }
          });
          break;

        case 'owner':
          const [firstName, ...lastNameParts] = fullName.split(' ');
          await prisma.owner.create({
            data: {
              userId: user.id,
              firstName,
              lastName: lastNameParts.join(' ') || firstName // Fallback if no last name
            }
          });
          break;
      }

      return user;
    });

    res.status(200).json({
      message: 'User verified and created successfully',
      user: result
    });

  } catch (error) {
    console.error('Error in verifyOTP:', error);
    res.status(500).json({ error: 'Server error while creating user' });
    
  }
};



export const getUser = async (req, res) => {
  try {
    const userId = req.user.uid; // Assuming this comes from auth middleware

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: true
          }
        },
        customer: true,
        enabler: true,
        owner: true,
        deviceTokens: true
      }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Transform the data to a more frontend-friendly structure
    const userResponse = {
      id: user.id,
      phoneNumber: user.phoneNumber,
      email: user.email,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roles: user.roles.map(ur => ur.role.name),
      deviceTokens: user.deviceTokens.map(dt => dt.token),
      profile: null
    };

    // Determine user type and add specific profile data
    if (user.customer) {
      userResponse.profile = {
        type: 'customer',
        ...user.customer,
      };
    } else if (user.enabler) {
      userResponse.profile = {
        type: 'enabler',
        ...user.enabler,
      };
    } else if (user.owner) {
      userResponse.profile = {
        type: 'owner',
        ...user.owner,
      };
    }

    // Remove unnecessary nested user references
    if (userResponse.profile) {
      delete userResponse.profile.userId;
      delete userResponse.profile.user;
    }

    res.status(200).json(userResponse);

  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      error: 'Server error while fetching user data'
    });
  }
};