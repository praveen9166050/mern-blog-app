import { Link } from "react-router-dom"
import CallToAction from "../components/CallToAction"
import { useEffect, useState } from "react"
import PostCard from "../components/PostCard";

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts/getPosts');
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data?.success || "Something went wrong");
        }
        setPosts(data.posts);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchPosts();
  }, []);
  return (
    <div>
      <div className="flex flex-col gap-6 max-w-6xl mx-auto p-28 px-3">
        <h1 className="text-3xl font-bold lg:text-6xl">Welcome to my blog</h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          Here you will find a variety of articles and tutorials on topics suc as web development, software engineering and programming languages.
        </p>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
        >
          View all posts
        </Link>
      </div>
      <div className="p-3 bg-amber-100 dark:bg-slat-700s">
        <CallToAction />
      </div>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl text-center font-semibold">Recent Posts</h2>
            <div className="flex flex-wrap gap-4">
              {posts.map(post => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to="/search"
              className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home