"use client";

import React, { FC, useRef, useEffect } from "react";
import { ExtendedPost } from "@/types/db";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from "axios";
import Post from "./Post";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";

interface PostFeedProps {
  initialPosts: ExtendedPost[];
  subredditName?: string;
}

const PostFeed: FC<PostFeedProps> = ({ initialPosts, subredditName }) => {
  const lastPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const { data: session } = useSession();

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["infinite-query"],
    async ({ pageParam = 1 }) => {
      const query =
        `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` +
        (!!subredditName ? `&subredditName=${subredditName}` : "");

      const { data } = await axios.get(query);
      return data as ExtendedPost[];
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: { pages: [initialPosts], pageParams: [1] },
    }
  );

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  // Combining initial posts with the fetched posts and sorting by upvotes in descending order
  const sortedPosts = data?.pages.flatMap((page) => page) ?? initialPosts;
  sortedPosts.sort((a, b) => {
    const upvotesA = a.votes.filter(vote => vote.type === "UP").length;
    const upvotesB = b.votes.filter(vote => vote.type === "UP").length;
    return upvotesB - upvotesA;
  });

  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      {sortedPosts.map((post, index) => {
        const votesAmt = post.votes.reduce((acc, vote) => {
          if (vote.type === "UP") return acc + 1;
          if (vote.type === "DOWN") return acc - 1;
          return acc;
        }, 0);

        const currentVote = post.votes.find((vote) => {
          return vote.userId === session?.user.id; // fixed the missing return statement here
        });

        if (index === sortedPosts.length - 1) {
          return (
            <li key={post.id} ref={ref}>
              <Post
                currentVote={currentVote}
                votesAmt={votesAmt}
                commentAmt={post.comments.length}
                post={post}
                subredditName={post.subreddit.name}
              />
            </li>
          );
        } else {
          return (
            <li key={post.id}>
              <Post
                currentVote={currentVote}
                votesAmt={votesAmt}
                commentAmt={post.comments.length}
                post={post}
                subredditName={post.subreddit.name}
              />
            </li>
          );
        }
      })}
    </ul>
  );
};

export default PostFeed;
