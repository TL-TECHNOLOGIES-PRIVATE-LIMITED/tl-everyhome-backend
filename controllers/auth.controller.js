import { PrismaClient } from "@prisma/client";
import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

const prisma = new PrismaClient();

export const verifyOTP = async (req, res) => {
  const { phoneNumber, verificationId, otp, fullName, userType, idToken } = req.body;
  if (!phoneNumber || !verificationId || !otp || !userType || !idToken) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const phoneCredential = admin.auth.PhoneAuthProvider.credential(verificationId, otp);
    await admin.auth().signInWithCredential(phoneCredential);
    let user = await prisma.user.upsert({
      where: { uid },
      update: {
        phoneNumber,
        updatedAt: new Date(),
      },
      create: {
        uid,
        phoneNumber,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    let role = null;
    if (userType === 'Customer') {
      role = await prisma.role.findUnique({ where: { name: 'Customer' } });
    } else if (userType === 'Enabler') {
      role = await prisma.role.findUnique({ where: { name: 'Enabler' } });
    } else if (userType === 'Owner') {
      role = await prisma.role.findUnique({ where: { name: 'Owner' } });
    }

    if (role) {
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId: user.id, roleId: role.id } },
        update: {},
        create: {
          userId: user.id,
          roleId: role.id,
        },
      });
    } else {
      return res.status(400).json({ error: 'Invalid user type' });
    }
    if (userType === 'Customer' && fullName) {
      await prisma.customer.upsert({
        where: { userId: user.id },
        update: { fullName },
        create: {
          userId: user.id,
          fullName,
        },
      });
    }
    res.status(200).json({ message: 'User verified and created successfully!' });
  } catch (error) {
    console.error(error);
    if (error.code === 'auth/invalid-credential') {
      return res.status(400).json({ error: 'Invalid OTP or verification code' });
    }
    res.status(500).json({ error: 'OTP verification failed or server error' });
  }
};