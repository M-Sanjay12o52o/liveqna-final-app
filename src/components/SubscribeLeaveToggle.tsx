"use client";

import React from "react";
import { startTransition } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "../hooks/use-toast";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { SubscribeToSubredditPayload } from "@/lib/validators/subreddit";

interface SubscribeLeaveToggleProps {
  subredditId: string;
  isSubscribed: boolean;
  subredditName: string;
}

const SubscribeLeaveToggle = ({ subredditId, isSubscribed, subredditName }) => {
  const { loginToast } = useCustomToasts();
  const router = useRouter();

  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    // to submit our data to the api
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };

      const { data } = await axios.post("/api/subreddit/subscribe", payload);
      // we are passing this because we own the endpoint and we are going to return a string from here
      return data as string;
    },

    // error handling
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "There was a problem",
        description: "Something went wrong, please try again later",
        variant: "destructive",
      });
    },

    onSuccess: () => {
      // this is from react
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: "Subscribed",
        // name received from props
        description: `You are now subscribed to r/${subredditName}`,
      });
    },
  });

  // unsubscribe request

  const { mutate: unsubscribe, isLoading: isUnSubLoading } = useMutation({
    // to submit our data to the api
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };

      const { data } = await axios.post("/api/subreddit/unsubscribe", payload);
      // we are passing this because we own the endpoint and we are going to return a string from here
      return data as string;
    },

    // error handling
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "There was a problem",
        description: "Something went wrong, please try again later",
        variant: "destructive",
      });
    },

    onSuccess: () => {
      // this is from react
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: "Unsubscribed",
        // name received from props
        description: `You are now unsubscribed from r/${subredditName}`,
      });
    },
  });

  return isSubscribed ? (
    <Button
      onClick={() => unsubscribe()}
      isLoading={isUnSubLoading}
      className="w-full mt-1 mb-4"
    >
      Leave community
    </Button>
  ) : (
    <Button
      isLoading={isSubLoading}
      onClick={() => subscribe()}
      className="w-full mt-1 mb-4"
    >
      Join to Post
    </Button>
  );
};

export default SubscribeLeaveToggle;
