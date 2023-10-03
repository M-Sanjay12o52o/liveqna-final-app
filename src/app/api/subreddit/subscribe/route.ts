import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import React from "react";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    console.log("getAuthSession result: " + session);

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    // validator
    const { subredditId } = SubredditSubscriptionValidator.parse(body);

    // checking is the subscription already exists
    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    });

    if (subscriptionExists) {
      return new Response("You are already subscribed to this subreddit.", {
        status: 400,
      });
    }

    // creating subscription for the user
    await db.subscription.create({
      data: {
        subredditId,
        userId: session.user.id,
      },
    });

    return new Response(subredditId);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new Response("Could not subscribe, please try again later", {
      status: 500,
    });
  }
}
