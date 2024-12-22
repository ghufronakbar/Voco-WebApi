import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/db/prisma";
import adminAuth from "@/middleware/adminAuth";
import bcrypt from "bcrypt";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const adminId = req.decoded?.id;
    if (req.method === "GET") {
      const admin = await prisma.admin.findUnique({
        where: { id: adminId },
      });
      if (!admin) {
        return res
          .status(401)
          .json({ status: 401, message: "Admin tidak ditemukan" });
      }
      return res
        .status(200)
        .json({ status: 200, message: "Success", data: admin });
    }

    if (req.method === "PUT") {
      const { name, email } = req.body;

      if (!name || !email) {
        return res
          .status(400)
          .json({ status: 400, message: "Harap lengkapi data" });
      }

      console.log(name, email);

      const check = await prisma.admin.findFirst({ where: { email } });
      if (check && check.id !== adminId) {
        return res
          .status(400)
          .json({ status: 400, message: "Email sudah terdaftar" });
      }

      const admin = await prisma.admin.update({
        where: { id: adminId },
        data: {
          name,
          email,
        },
      });

      return res
        .status(200)
        .json({ status: 200, message: "Success", data: admin });
    }

    if (req.method === "PATCH") {
      const adminId = req.decoded?.id;
      const { oldPassword, newPassword, confirmPassword } = req.body;

      if (newPassword !== confirmPassword) {
        return res
          .status(400)
          .json({ status: 400, message: "Password baru tidak cocok" });
      }

      const admin = await prisma.admin.findUnique({
        where: { id: adminId },
      });

      if (!admin || !(await bcrypt.compare(oldPassword, admin.password))) {
        return res
          .status(401)
          .json({ status: 401, message: "Password lama salah" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.admin.update({
        where: { id: adminId },
        data: { password: hashedPassword },
      });

      return res
        .status(200)
        .json({ status: 200, message: "Password berhasil diubah" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Terjadi kesalahan sistem" });
  }
}

export default adminAuth(handler);
