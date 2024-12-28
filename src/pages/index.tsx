import { Box, Button, Stack } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  return (
    <div className="w-full min-h-screen flex items-center justify-center relative">
      <Image src="/bg2.png" alt="" width={3840} height={2160} className="w-auto h-full fixed z-10 object-cover right-0" />      
      <Box
        className="flex items-center justify-center px-4 py-4 w-[90%] sm:w-[80%] md:w-[50%] lg:w-[60%] 2xl:w-[30%] max-w-[1000px] bg-white z-10"
        p={8}
        borderRadius="lg"
        boxShadow="lg"
      >
        <div className="w-full">
          <Stack gap="4" align="flex-start" className="w-full">
            <div className="flex flex-row items-center justify-center gap-2 w-full my-4 text-center">
              <Image
                src="/logo.png"
                alt=""
                width={800}
                height={400}
                className="w-auto h-16 object-cover"
              />
            </div>
            <h1 className="text-xl text-center font-semibold text-black w-full">
              Permudah identifikasi barangmu!
            </h1>

            <Button
              type="submit"
              className="w-full bg-primary text-white font-semibold rounded-lg"
              onClick={() => router.push("/login")}
            >
              Lanjut
            </Button>
          </Stack>
        </div>
      </Box>
    </div>
  );
}
