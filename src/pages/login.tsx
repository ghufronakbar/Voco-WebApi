import { Box, Button, Input, Stack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { useState } from "react";
import Image from "next/image";
import axiosInstance from "@/config/axiosInstance";
import { ResErr } from "@/models/Api";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Toaster } from "@/components/ui/toaster";
import toast from "@/helper/toast";

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
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="fixed top-0 left-0 w-full h-full bg-neutral-100 z-0" />
      <Box
        className="flex items-center justify-center px-4 py-4 w-[90%] sm:w-[80%] md:w-[50%] lg:w-[40%] 2xl:w-[30%] max-w-[400px] bg-white z-10"
        p={8}
        borderRadius="lg"
        boxShadow="lg"
      >
        <form onSubmit={(e) => onSubmit(e)} className="w-full">
          <Stack gap="4" align="flex-start" className="w-full">
            <div className="flex flex-row items-center justify-center gap-2 w-full my-4">
              <Image
                src="/logo.png"
                alt=""
                width={800}
                height={400}
                className="w-auto h-16 object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold text-black">Admin Login</h2>
            <Field label="Email" className="text-black">
              <Input
                className="bg-neutral-100 px-2 text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field label="Password" className="text-black">
              <Input
                type="password"
                className="bg-neutral-100 px-2 text-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
            <Button
              type="submit"
              className="w-full bg-primary text-white font-semibold"
            >
              Login
            </Button>
          </Stack>
        </form>
      </Box>
      <Toaster />
    </div>
  );
};

export default LoginPage;
