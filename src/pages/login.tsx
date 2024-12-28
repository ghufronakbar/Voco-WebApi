import { Button, Input } from "@chakra-ui/react";
import { useState } from "react";
import Image from "next/image";
import axiosInstance from "@/config/axiosInstance";
import { ResErr } from "@/models/Api";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Toaster } from "@/components/ui/toaster";
import toast from "@/helper/toast";
import Link from "next/link";
import { InputGroup } from "@/components/ui/input-group";
import { BiLock } from "react-icons/bi";
import { MdOutlineEmail } from "react-icons/md";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      toast.loading();
      const { data } = await axiosInstance.post("/login", {
        email,
        password,
      });
      Cookies.set("accessToken", data?.data?.accessToken);
      toast.success("Berhasil login");
      router.push("/dashboard");
    } catch (error) {
      const err = error as ResErr;
      toast.error(err.response?.data.message);
      console.log(error);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center relative bg-neutral-300">
      <Image
        src="/bg2.png"
        alt=""
        width={3840}
        height={2160}
        className="w-auto h-full fixed z-10 object-cover right-0"
      />
      <div className="w-full flex flex-row gap-4 px-8 py-4 items-center justify-center">
        <div className="flex items-center justify-center px-4 py-4 w-full md:w-1/2 lg:w-1/3 z-10">
          <form
            onSubmit={(e) => onSubmit(e)}
            className="w-full gap-4 flex flex-col"
          >
            <div className="flex flex-row items-center justify-center gap-2 w-full my-4">
              <Image
                src="/login.png"
                alt=""
                width={1200}
                height={800}
                className="w-[90%] h-auto object-cover"
              />
            </div>
            <InputGroup
              flex="1"
              startElement={<MdOutlineEmail />}
              className="w-full px-4 py-2 text-black rounded-3xl shadow-md bg-neutral-100 mb-2"
            >
              <Input
                className="border-0 focus:outline-none"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputGroup>
            <InputGroup
              flex="1"
              startElement={<BiLock />}
              className="w-full px-4 py-2 text-black rounded-3xl shadow-md bg-neutral-100 mb-2"
            >
              <Input
                className="border-0 focus:outline-none"
                value={password}
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </InputGroup>
            <div className="text-sm">
              Belum punya akun?{" "}
              <span>
                <Link href="/register" className="text-primary">
                  Register
                </Link>
              </span>{" "}
            </div>
            <Button
              type="submit"
              className="w-full bg-primary text-white font-semibold rounded-3xl shadow-lg py-6"
            >
              Login
            </Button>
          </form>
        </div>
        <div className="w-1/3 hidden lg:flex" />
      </div>
      <Toaster />
    </div>
  );
};

export default LoginPage;
