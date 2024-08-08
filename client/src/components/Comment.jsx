import { useEffect, useState } from "react"
import moment from "moment"
import { FaThumbsUp } from "react-icons/fa";

function Comment({comment, currentUser, onLike}) {
  const [user, setUser] = useState({});
  console.log(user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${comment.userId}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data?.message || "Something went wrong");
        }
        setUser(data.user);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchUser();
  }, [comment]);
  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img 
          src={user.profilePicture} 
          alt={user.username} 
          className="w-10 h-10 rounded-full bg-gray-200" 
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user.username ? `@${user.username}` : 'anonymous user'}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        <p className="text-gray-500 pb-2">{comment.content}</p>
        <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
          <button 
            type="button" 
            onClick={() => onLike(comment._id)} 
            className={`text-gray-400 hover:text-blue-500 ${currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'}`}
          >
            <FaThumbsUp className="text-sm" />
          </button>
          <p>
            {comment.numOfLikes > 0 && `${comment.numOfLikes} ${comment.numOfLikes === 1 ? 'like' : 'likes'}`}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Comment