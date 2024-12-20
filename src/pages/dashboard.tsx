import Button from "@/components/Button";
import { Toaster } from "@/components/ui/toaster";
import axiosInstance from "@/config/axiosInstance";
import { ResErr, ResOk } from "@/models/Api";
import formatDate from "@/utils/format/formatDate";
import { Product } from "@prisma/client";
import { useEffect, useState } from "react";
import { ProductDTO } from "./api/products";
import toast from "@/helper/toast";
import ModalAction from "@/components/ModalAction";
import ModalConfirmation from "@/components/ModalConfirmation";
import Image from "next/image";
import { BiLogOutCircle } from "react-icons/bi";
import Link from "next/link";
import { Html5QrcodeScanner } from "html5-qrcode";

// Initialize product DTO
const initProductDTO: ProductDTO = {
  brand: "",
  variant: "",
  expiredDate: new Date(),
  qrCode: "",
  desc: "",
};

const DashboardPage = () => {
  const [data, setData] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ProductDTO>(initProductDTO);
  const [selectedId, setSelectedId] = useState<string>();
  const [selectedToDelete, setSelectedToDelete] = useState<string>();
  const [pickedImage, setPickedImage] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const filteredData = data.filter(
    (item) =>
      item.brand.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.variant?.toLowerCase().includes(search.toLowerCase())
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get<ResOk<Product[]>>("/products");
      setData(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const [isCameraOpen, setIsCameraOpen] = useState(false);  

  useEffect(() => {
    let scanner: Html5QrcodeScanner;
    if (isCameraOpen === true) {
      scanner = new Html5QrcodeScanner(
        "reader",
        {
          qrbox: {
            width: 700,
            height: 800,
          },
          fps: 30,
        },
        false
      );

      const success = (result: string) => {
        setForm({
          ...form,
          qrCode: result,
        });
        scanner.clear();
        setIsCameraOpen(false);
      };

      const error = (err: unknown) => {
        console.warn(err);
      };

      scanner.render(success, error);
    }

    // Clean up the scanner on component unmount
    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, [isCameraOpen]);

  const createProduct = async () => {
    try {
      if (!pickedImage) {
        toast.error("Gambar produk harus diunggah.");
        return;
      }
      toast.loading();
      const res = await axiosInstance.post<ResOk<Product>>("/products", form);
      if (res && pickedImage) {
        const formData = new FormData();
        formData.append("image", pickedImage as Blob);
        await axiosInstance.post(`/products/${res.data.data.id}`, formData);
      }
      toast.success("Produk berhasil ditambahkan");
      setIsOpen(false);
      setForm(initProductDTO);
      fetchData();
    } catch (error) {
      const err = error as ResErr;
      toast.error(err?.response?.data?.message);
    }
  };

  const editProduct = async () => {
    try {
      toast.loading();
      const res = await axiosInstance.put("/products", {
        ...form,
        id: selectedId,
      });
      if (res && pickedImage) {
        const formData = new FormData();
        formData.append("image", pickedImage as Blob);
        await axiosInstance.post(`/products/${res.data.data.id}`, formData);
        setPickedImage(null);
      }
      toast.success("Produk berhasil diubah");
      setIsOpen(false);
      setForm(initProductDTO);
      fetchData();
    } catch (error) {
      const err = error as ResErr;
      toast.error(err?.response?.data?.message);
    }
  };

  const deleteProduct = async () => {
    try {
      await axiosInstance.delete(`/products`, {
        data: { id: selectedToDelete },
      });
      toast.success("Produk berhasil dihapus");
      setSelectedToDelete(undefined);
      setForm(initProductDTO);
      fetchData();
    } catch (error) {
      const err = error as ResErr;
      toast.error(err?.response?.data?.message);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (isNaN(newDate.getTime())) {
      toast.error("Tanggal yang dimasukkan tidak valid.");
      return;
    }
    setForm((prevForm) => ({
      ...prevForm,
      expiredDate: newDate,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setPickedImage(file);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full px-8 py-8">
      <h1 className="text-3xl md:text-4xl font-semibold mb-4 flex flex-row items-center gap-2">
        <Link href="/logout">
          <BiLogOutCircle />
        </Link>
        Dashboard
      </h1>
      <div className="w-full flex flex-col gap-2">
        <div className="flex flex-col md:flex-row gap-2 justify-between">
          <input
            type="text"
            placeholder="Cari produk..."
            className="w-full md:w-1/2 lg:w-1/3 p-2 rounded-md border border-gray-300 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={() => setIsOpen(true)}>Tambah Produk</Button>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-full table-auto">
            <thead className="text-white bg-primary">
              <tr>
                <th className="px-4 py-2 text-left"></th>
                <th className="px-4 py-2 text-left"></th>
                <th className="px-4 py-2 text-left">#ID</th>
                <th className="px-4 py-2 text-left">Nama</th>
                <th className="px-4 py-2 text-left">Kadaluarsa</th>
                <th className="px-4 py-2 text-left">Dibuat Pada</th>
                <th className="px-4 py-2 text-left"></th>
              </tr>
            </thead>
            <tbody className="text-neutral-800">
              {!loading && filteredData.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="w-full py-4 text-center">
                      Data tidak ditemukan
                    </div>
                  </td>
                </tr>
              )}
              {filteredData.map((item, index) => (
                <tr key={item.id}>
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">
                    <Image
                      src={item?.image || "/placeholder.jpg"}
                      alt={item.brand + " " + item.variant}
                      width={50}
                      height={50}
                      className="w-16 h-16 object-cover rounded-lg min-w-16 min-h-16"
                    />
                  </td>
                  <td className="px-4 py-2">{item.id}</td>
                  <td className="px-4 py-2">
                    <div className="flex flex-col">
                      <p className="font-semibold">{item.brand}</p>
                      <p className="text-sm">{item.variant}</p>
                    </div>
                  </td>
                  <td className="px-4 py-2">{formatDate(item.expiredDate)}</td>
                  <td className="px-4 py-2">{formatDate(item.createdAt)}</td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-white text-black px-4 py-2 rounded-md shadow-sm hover:bg-gray-100"
                      onClick={() => {
                        setSelectedId(item.id);
                        setForm({
                          brand: item.brand,
                          variant: item.variant,
                          expiredDate: new Date(item.expiredDate),
                          qrCode: item.qrCode,
                          desc: item.desc,
                        });
                        setIsOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-white text-red-500 px-4 py-2 rounded-md shadow-sm hover:bg-gray-100"
                      onClick={() => {
                        setSelectedToDelete(item.id);
                      }}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Toaster />

      {/* Modal Action Form */}
      <ModalAction
        title={selectedId ? "Ubah Produk" : "Tambah Produk"}
        isOpen={isOpen}
        onConfirm={selectedId ? editProduct : createProduct}
        onClose={() => {
          setPickedImage(null);
          setIsOpen(false);
          setSelectedId(undefined);
          setForm(initProductDTO);
        }}
      >
        <div className="flex flex-col gap-4">
          <label>Merek</label>
          <input
            type="text"
            name="brand"
            value={form.brand}
            onChange={handleInputChange}
            placeholder="Brand"
            className="p-2 border rounded-md bg-neutral-50"
          />
          <label>Varian</label>
          <input
            type="text"
            name="variant"
            value={form.variant}
            onChange={handleInputChange}
            placeholder="Variant"
            className="p-2 border rounded-md bg-neutral-50"
          />
          <div className="flex flex-row justify-between">
            <label>Kode QR</label>
          </div>
          <input
            type="text"
            name="qrCode"
            value={form.qrCode}
            onChange={handleInputChange}
            placeholder="Kode QR"
            disabled
            className="p-2 border rounded-md bg-neutral-50"
          />
          <Button onClick={() => setIsCameraOpen(true)}>Buka Kamera</Button>

          <label>Tanggal Kadaluarsa</label>
          <input
            type="date"
            name="expiredDate"
            value={form?.expiredDate?.toISOString()?.split("T")[0]}
            onChange={handleDateChange}
            className="p-2 border rounded-md bg-neutral-50"
          />
          <label>Deskripsi</label>
          <textarea
            name="desc"
            value={form.desc}
            onChange={handleInputChange}
            placeholder="Deskripsi"
            className="p-2 border rounded-md bg-neutral-50"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="p-2 border rounded-md bg-neutral-50"
          />
        </div>
      </ModalAction>

      {/* Camera Modal */}
      
        <div className={`modal fixed inset-0 bg-gray-800 bg-opacity-75 items-center justify-center z-50 ${isCameraOpen ? "flex" : "hidden"}`}>
          <div className="bg-white p-4 rounded-lg">
            <div id="reader"></div>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
              onClick={() => setIsCameraOpen(false)}
            >
              Tutup Kamera
            </button>
          </div>
        </div>
      

      {/* Modal Confirmation */}
      <ModalConfirmation
        isOpen={!!selectedToDelete}
        onClose={() => setSelectedToDelete(undefined)}
        onConfirm={deleteProduct}
        message="Apakah Anda yakin ingin menghapus produk ini?"
      />
    </div>
  );
};

export default DashboardPage;
