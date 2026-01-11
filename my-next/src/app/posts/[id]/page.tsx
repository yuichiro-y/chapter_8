"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Post } from "@/app/_types/Post"

export default function PostDetail() {

  const [posts , setPosts] = useState<Post[]>([]);
  const [loading , setLoading] = useState(true);
  const [error , setError] = useState(false);
  useEffect(()=> {
    const fetcher = async() =>{
      try {
        setLoading(true);

        const res = await fetch("https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts")
      
        if (!res.ok) {
        throw new Error(`HTTPエラー: ${res.status}`);
      }

        const data = await res.json()
        setPosts(data.posts)
      } catch (err){
        console.log(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetcher()
  },[])
  
  const { id } = useParams();
  const post = posts.find(p => p.id === Number(id));
  
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

  if (!post) {
    return (
      <div>
        <p className="p-5">記事が見つかりません。</p>
      </div>
    );
  }

  return (
    <article key={post.id} className="max-w-2xl mx-auto my-10 px-2">
        <img src={post.thumbnailUrl} className="mb-5"/>

        <div className="px-5">
          <div className="flex justify-between">
            <div className="text-gray-500 text-sm">{new Date(post.createdAt).toLocaleDateString('ja-JP')}
            </div>
            {post.categories && (<ul className="flex font-semibold text-sm">{post.categories.map((c)=>
              <li className="border border-blue-500 text-blue-500 rounded-md mr-1.5 px-1.5 py-0.5">{c}</li>)}</ul>)}
            </div>

          <div className="text-left">
            <h1 className="text-2xl py-3">{post.title}</h1>
            <div className=""dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

      </div>
    </article>
  );
};