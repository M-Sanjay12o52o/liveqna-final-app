import React, { FC, useRef } from "react";
import { formatTimeToNow } from "@/lib/utils";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import EditorOutput from "@/components/EditorOutput";
import PostVoteClient from "@/components/post-vote/PostVoteClient";

// ts utility type - Pick
type PartialVote = Pick<Vote, "type">;

interface PostProps {
  subredditName: string;
  post: Post & {
    author: User;
    votes: Vote[];
  };
  commentAmt: number;
  votesAmt: number;
  currentVote?: PartialVote;
}

const Post: FC<PostProps> = ({
  subredditName,
  post,
  commentAmt,
  votesAmt: votesAmt,
  currentVote,
}) => {
  const pRef = useRef<HTMLDivElement>(null);

  return (
    <div className="rounded-md bg-white shadow">
      <div className="px-6 py-4 flex justify-between">
        <PostVoteClient
          postId={post.id}
          initialVote={currentVote?.type}
          initialVotesAmt={votesAmt}
        />
        <div className="w-0 flex-1">
          <div className="max-h-40 mt-1 text-xs text-gray-500">
            {subredditName ? (
              <>
                <a
                  className="underline text-zinc-900 text-sm underline-offset-2"
                  href={`/r/${subredditName}`}
                >
                  r/{subredditName}
                </a>

                <span className="px-1">*</span>
              </>
            ) : null}
            <span>Posted by u/{post.author.username}</span>{" "}
            {formatTimeToNow(new Date(post.createdAt))}
          </div>

          <a href={`/r/${subredditName}/posts/${post.id}`}>
            <h1 className="text-lg font-semibold py-2 leading-6 text-gray-900">
              {post.title}
            </h1>
          </a>
          {/* ref to check on the client side is the div is exhausting max height */}
          <div
            className="relative text-sm max-h-40 w-full overflow-clip"
            ref={pRef}
          >
            {/* // to display content on post page  */}
            <EditorOutput content={post.content} />

            {pRef.current?.clientHeight === 160 ? (
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent"></div>
            ) : null}
          </div>
        </div>
      </div>

      {/* comments */}
      <div className="bg-gray-50 z-20 text-sm p-4 sm:px-6">
        <Link
          className="w-fit flex items-center gap-2"
          href={`/r/${subredditName}/posts/${post.id}`}
        >
          <MessageSquare className="h-4 w-4" /> {commentAmt} comments
        </Link>
      </div>
    </div>
  );
};

export default Post;
