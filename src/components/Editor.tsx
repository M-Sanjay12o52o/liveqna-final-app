"use client";

import React, { FC, useRef, useState, useEffect, useCallback } from "react";
import TextareaAutoSize from "react-textarea-autosize";
import { useForm } from "react-hook-form";
import { PostCreationRequest, PostValidator } from "@/lib/validators/post";
import { zodResolver } from "@hookform/resolvers/zod";
import type EditorJS from "@editorjs/editorjs";

interface EditorProps {
  subredditId: string;
}

const Editor: FC<EditorProps> = ({ subredditId }) => {
  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostCreationRequest>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      subredditId,
      title: "",
      content: null,
    },
  });

  // checking if the editor is initialized or not
  const ref = useRef<EditorJS>();
  // checking whether the component is mounted or not
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  // content to make post from
  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const Table = (await import("@editorjs/table")).default;
    const List = (await import("@editorjs/list")).default;
    const Code = (await import("@editorjs/code")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const ImageTool = (await import("@editorjs/image")).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor;
        },
        placeholder: "Type here to write your post...",
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles([file], "imageUploader");

                  return {
                    success: 1,
                    file: {
                      url: res.fileUrl,
                    },
                  };
                },
              },
            },
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
        },
      });
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();

      setTimeout(() => {
        // set foucs to title
      });
    };

    if (isMounted) {
      init();

      return () => {};
    }
  }, [isMounted, initializeEditor]);

  return (
    <div className="w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200">
      <form id="subreddit-post-form" className="w-fit" onSubmit={() => {}}>
        <div className="prose promse-stone dark:prose-invert">
          <TextareaAutoSize
            placeholder="Title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
          />
          
          <div id='editor' className='min-h-[500px]' />
        </div>
      </form>
    </div>
  );
};

export default Editor;
