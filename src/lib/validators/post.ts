import { z } from "zod";

// client and server side valide data for post creation
export const PostValidator = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be longer than 3 characters" })
    .max(128, { message: "Title can be only be less then 128 characters" }),
  subredditId: z.string(),
  content: z.any(),
});

export type PostCreationRequest = z.infer<typeof PostValidator>;
