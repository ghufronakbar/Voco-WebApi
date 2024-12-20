import prisma from "@/db/prisma";
import formatDate from "@/utils/format/formatDate";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const products = await getAllProduct();
      const formattedProducts = products.map((product) => ({
        ...product,
        text: `${product.brand}, ${
          product.variant
        }. Kadaluarsa pada tanggal ${formatDate(product.expiredDate)}. ${
          product.desc
        }`,
      }));

      return res
        .status(200)
        .json({ success: true, message: "Success", data: formattedProducts });
    }

    if (req.method === "POST") {
      const data = req.body as ProductDTO;
      const product = await createProduct(data);
      return res.status(200).json({
        success: true,
        message: "Berhasil menambahkan produk",
        data: product,
      });
    }

    if (req.method === "PUT") {
      const data = req.body as ProductDTO;
      if (!data.id) {
        return res
          .status(400)
          .json({ success: false, message: "Product not found" });
      }
      const check = await isProductExist(data.id);
      console.log({ check });
      if (!check) {
        return res
          .status(400)
          .json({ success: false, message: "Product not found" });
      }
      const product = await editProduct(data.id, {
        brand: data.brand,
        variant: data.variant,
        expiredDate: data.expiredDate,
        desc: data.desc,
        qrCode: "b4882965-3bff-43d6-810f-81fe5c3e6889",
      });
      return res.status(200).json({
        success: true,
        message: "Berhasil mengubah produk",
        data: product,
      });
    }

    if (req.method === "DELETE") {
      const { id } = req.body;
      const check = await isProductExist(id);
      if (!check) {
        return res
          .status(400)
          .json({ success: false, message: "Product not found" });
      }
      const product = await deleteProduct(id);
      return res.status(200).json({
        success: true,
        message: "Berhasil menghapus produk",
        data: product,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan sistem" });
  }
}

const getAllProduct = async () => {
  return await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export interface ProductDTO {
  id?: string;
  brand: string;
  variant: string;
  expiredDate: Date;
  qrCode: string;
  desc: string;
}

const createProduct = async (data: ProductDTO) => {
  return await prisma.product.create({
    data,
  });
};

const editProduct = async (id: string, data: ProductDTO) => {
  console.log({ id, data });
  return await prisma.product.update({
    where: {
      id,
    },
    data: {
      brand: data.brand,
      variant: data.variant,
      expiredDate: data.expiredDate,
      desc: String(data.desc),
      qrCode: data.qrCode,
    },
  });
};

const deleteProduct = async (id: string) => {
  return await prisma.product.delete({
    where: {
      id: id,
    },
  });
};

const isProductExist = async (id: string) => {
  return await prisma.product.count({
    where: {
      id: id,
    },
  });
};
