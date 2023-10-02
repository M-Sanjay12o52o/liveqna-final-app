// toast to show error when the user is trying to create community without being logged in

import { toast } from "./use-toast";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";

export const useCustomToast = () => {
  const loginToast = () => {
    const { dismiss } = toast({
      title: "Login required.",
      description: "You need to be logged in to do that.",
      variant: "destructive",
      action: (
        <Link
          href="/sign-in"
          onClick={() => dismiss()}
          className={buttonVariants({ variant: "outline" })}
        ></Link>
      ),
    });
  };

  return { loginToast };
};
