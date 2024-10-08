import { Alert, Button, Modal, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom";
import Comment from "./Comment";
import { HiOutlineExclamationCircle } from "react-icons/hi";

function CommentSesction({postId}) {
  const {currentUser} = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comments/getPostComments/${postId}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data?.message || "Something went wrong");
        }
        setComments(data.comments);
      } catch (error) {
        console.log(error);
      }
    }
    fetchComments();
  }, [postId]);

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
      setComments([data.data, ...comments]);
    } catch (error) {
      setCommentError(error.message);
    }
  }

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }
      const res = await fetch(`/api/comments/likeComment/${commentId}`, {
        method: 'PUT'
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Something went wrong");
      }
      setComments(comments.map(comment => {
        if (comment._id !== commentId) {
          return comment;
        }
        return {
          ...comment, 
          likes: data.comment.likes, 
          numOfLikes: data.comment.numOfLikes
        }
      }));
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleEdit = async (comment, editedContent) => {
    try {
      const res = await fetch(`/api/comments/editComment/${comment._id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({content: editedContent})
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.success || "Something went wrong");
      }
      setComments(comments.map(c => {
        if (c._id !== comment._id) {
          return c;
        }
        return {...c, content: editedContent}
      }));
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleDelete = async () => {
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }
      const res = await fetch(`/api/comments/deleteComment/${commentIdToDelete}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.success || "Something went wrong");
      }
      setComments(comments.filter(c => c._id !== commentIdToDelete));
      setCommentIdToDelete(null);
      setShowModal(false);
    } catch (error) {
      console.log(error.message);
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
      {comments.length === 0 ? (
        <p className="text-sm my-5">No comments yet...</p>
      ) : (
        <>
          <div className="text-sm my-5 flext items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map(comment => (
            <Comment 
              key={comment._id} 
              comment={comment} 
              currentUser={currentUser} 
              onLike={handleLike} 
              onEdit={handleEdit}
              onDelete={(commentId) => {
                setShowModal(true);
                setCommentIdToDelete(commentId);
              }}
            />
          ))}
        </>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDelete}>Yes, I am sure</Button>
              <Button color="success" onClick={() => setShowModal(false)}>No, cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default CommentSesction