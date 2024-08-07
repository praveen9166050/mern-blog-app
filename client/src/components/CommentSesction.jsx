import { Alert, Button, Textarea } from "flowbite-react";
import { useState } from "react";
import { useSelector } from "react-redux"
import { Link } from "react-router-dom";

function CommentSesction({postId}) {
  const {currentUser} = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (comment.length > 200) {
        throw new Error("Comment length shouldn't exceed 200");
      }
      const res = await fetch('/api/comments/create', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          content: comment,
          postId: postId,
          userId: currentUser._id
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Something went wrong");
      }
      setComment('');
      setCommentError(null);
    } catch (error) {
      setCommentError(error.message);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img src={currentUser.profilePicture} alt="" className="h-5 w-5 object-cover rounded-full" />
          <Link to="/dashboard?tab=profile" className="text-xs text-cyan-600 hover:underline">
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to comment.
          <Link to="/sign-in" className="text-blue-500 hover:underline">Sign In</Link>
        </div>
      )}
      {currentUser && (
        <form onSubmit={handleSubmit} className="border border-teal-500 rounded-md p-3">
          <Textarea 
            placeholder="Add a comment..." 
            rows={3} 
            maxLength={200} 
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-sm">
              {200 - comment.length} characters remaining
            </p>
            <Button gradientDuoTone="purpleToBlue" outline type="submit" disabled={comment.length > 200}>Submit</Button>
          </div>
          {commentError && <Alert color="failure" className="mt-5">{commentError}</Alert>}
        </form>
      )}
    </div>
  )
}

export default CommentSesction