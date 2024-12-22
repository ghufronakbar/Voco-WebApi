import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import prisma from "@/db/prisma";
import { JWT_SECRET } from "@/constants";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      const { email, password, name } = req.body;
      if (!email || !password || !name) {
        return res
          .status(400)
          .json({ status: 400, message: "Harap lengkapi data" });
      }
      const admin = await prisma.admin.findUnique({ where: { email } });
      if (admin) {
        return res
          .status(400)
          .json({ status: 400, message: "Admin sudah terdaftar" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const create = await prisma.admin.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });

      const accessToken = jwt.sign(
        { id: create.id, role: "ADMIN" },
        JWT_SECRET!
      );
      return res.status(200).json({
        status: 200,
        message: "Berhasil login",
        data: { ...create, accessToken },
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Terjadi kesalahan sistem" });
  }
}
