// where we are going to intercept the request
import React, { FC } from "react";
import SignIn from "@/components/SignIn";
import CloseModal from "@/components/CloseModal";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div clasName="fixed inset-0 bg-zinc-900/20 z-10">
      <div className="container flex items-center h-full max-w-lg mx-auto">
        <div clasName="relative bg-white w-full h-fit py-20 px-2 rounded-lg">
          <div clasName="absolute top-4 right-4">
            <CloseModal />
          </div>
          <SignIn />
        </div>
      </div>
    </div>
  );
};

export default page;
