import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import CallToAction from "../components/CallToAction";
import CommentSesction from "../components/CommentSesction";
import PostCard from "../components/PostCard";

function PostPage() {
  const {postSlug} = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  console.log(post);

  useEffect(() => {
    const fetchPost = async () => {
      setError(false);
      try {
        const res = await fetch(`/api/posts/getPosts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Something went wrong");
        }
        setPost(data.posts[0]);
      } catch (error) {
        setError(true);
      }
      setLoading(false);
    }
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch(`/api/posts/getPosts?limit=${3}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data?.message || "Something went wrong");
        }
        setRecentPosts(data.posts);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchRecentPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post && post.title}
      </h1>
      <Link to={`/search?category=${post && post.category}`} className="self-center mt-5">
        <Button color="gray" pill size="xs">{post && post.category}</Button>
      </Link>
      <img 
        src={post && post.image} 
        alt={post && post.title} 
        className="mt-10 p-3 max-h-[400px] w-full max-w-[400px] mx-auto object-cover"
      />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">{post && (post.content.length / 1000).toFixed(0)} mins read</span>
      </div>
      <div 
        dangerouslySetInnerHTML={{__html: post && post.content}}
        className="p-3 max-w-2xl mx-auto w-full post-content"
      >

      </div>
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
      <CommentSesction postId={post._id} />
      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5">Recent Articles</h1>
        <div className="flex flex-wrap justify-center gap-5 mt-5">
          {recentPosts.length !== 0 && recentPosts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </main>
  )
}

export default PostPage