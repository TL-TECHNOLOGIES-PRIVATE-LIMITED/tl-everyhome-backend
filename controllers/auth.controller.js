import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createAccount = async (req, res) => {
  const { userType } = req.body;

  const id = req.user.uid;
  const authProvider = req.user.firebase?.sign_in_provider;
  const phoneNumber = req.user?.phone_number;
  const email = req.user?.email || null;
  const fullName = req.user?.name || req.body.fullName;
  const profileImage = req.user.picture || null;



  try {
    if (!userType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const validUserTypes = ['customer', 'enabler', 'owner'];
    if (!validUserTypes.includes(userType.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid user type' });
    }

    const existingUserRole = await prisma.userRole.findFirst({
      where: {
        userId: id,
        role: {
          name: userType.toLowerCase()
        }
      }
    });

    if (existingUserRole) {
      return res.status(400).json({
        success: false,
        message: `You are already registered as a ${userType}`
      });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    // Create or update user in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // 1. Create or update base user
      const user = await prisma.user.upsert({
        where: { id },
        create: {
          id,
          fullName,
          phoneNumber,
          authProvider,
          email,
          profileImage 

        },
        update: {
          fullName,
          phoneNumber,
          authProvider,
          email,
          profileImage

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
            }
          });
          break;

        case 'enabler':
          await prisma.enabler.create({
            data: {
              userId: user.id,
              experience: 'New'
            }
          });
          break;

        case 'owner':
          await prisma.owner.create({
            data: {
              userId: user.id,
            }
          });
          break;
      }
      await prisma.subscription.create({
        data: {
          userId: user.id,
          plan: 'BASE',
          status: 'ACTIVE',
          startDate,
          endDate,
          allowedDevices: 1
        }
      })

      return user;
    });

    res.status(200).json({
      message: 'User created successfully',
      user: result
    });

  } catch (error) {
    console.error('Error while creating account', error);
    res.status(500).json({ error: 'Server error while creating user' });

  }
};



export const getUser = async (req, res) => {
  try {
    const userId = req.user.uid;

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