"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import "@/app/globals.css";
import { Post } from "./_types/Post";

export default function Page() {

  const [posts , setPosts] = useState<Post[]>([]);
  const [loading , setLoading] = useState(true);
  const [error , setError] = useState(false);

  useEffect(() => {
    const fetcher = async() => {
    
      try {
        setLoading(true);
        const res = await fetch("https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts")

        if (!res.ok) {
          throw new Error(`HTTPエラー: ${res.status}`);
        }
        const data = await res.json()
        setPosts(data.posts)

      } catch (err) {
        console.log(err);
        setError(true);

      } finally {
        setLoading(false);
      }
    }

    fetcher()
  },[])

  if(loading === true){
  return(
      <div>
        <p className="p-5">読み込み中...</p>
      </div>
  );
 }

  if (error) {
    return (
      <div>
        <p className="p-5">データが取得できません。</p>
      </div>
    );
  }

  return (
    <>
    <div className="max-w-2xl mx-auto my-10 px-2">
      <ul>
      {posts.map((post) => (
          <li key={post.id} className="w-auto p-5 mb-10 border border-gray-300">
            <Link href={`/posts/${post.id}`}>

              <div className="flex justify-between">
                <div className="text-gray-500 text-sm">{new Date(post.createdAt).toLocaleDateString('ja-JP')}</div>
                {post.categories && (<ul className="flex font-semibold text-sm">
                  {post.categories.map((c)=><li key={c} className="border border-blue-500 text-blue-500 rounded-md mr-1.5 px-1.5 py-0.5">{c}</li>)}</ul>)}
              </div>

              <div className="text-left">
                <h1 className="text-2xl py-3">{post.title}</h1>
                <p className="line-clamp-2" dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
            </Link>
          </li>

      ))}
       </ul>
    </div>
    </>
  );
};