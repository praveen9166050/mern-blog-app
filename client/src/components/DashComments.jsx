import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react"
import { FaCheck, FaTimes } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";

function DashComments() {
  const {currentUser} = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comments/getComments`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data?.message || "Something went wrong");
        }
        setComments(data.comments);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    if (currentUser.isAdmin) {
      fetchComments()
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    try {
      const startIndex = comments.length;
      const res = await fetch(`/api/comments/getComments?startIndex=${startIndex}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Something went wrong");
      }
      setComments((prev) => [...prev, ...data.comments]);
      if (data.comments.length < 9) {
        setShowMore(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/comments/deleteComment/${commentIdToDelete}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Something went wrong");
      }
      setComments((prev) => prev.filter(comment => comment._id !== commentIdToDelete._id));
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {
        currentUser.isAdmin && comments.length > 0 ? (
          <>
            <Table hoverable className="shadow-md">
              <Table.Head>
                <Table.HeadCell>Date Created</Table.HeadCell>
                <Table.HeadCell>Comment</Table.HeadCell>
                <Table.HeadCell>No of likes</Table.HeadCell>
                <Table.HeadCell>PostId</Table.HeadCell>
                <Table.HeadCell>UserId</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {comments.map(comment => (
                  <Table.Row 
                    key={comment._id} 
                    className="bg-white text-gray-900 dark:text-gray-400 dark:bg-gray-800 divide-y"
                  >
                    <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>
                    <Table.Cell>{comment.content}</Table.Cell>
                    <Table.Cell>{comment.numOfLikes}</Table.Cell>
                    <Table.Cell>{comment.postId}</Table.Cell>
                    <Table.Cell>{comment.userId}</Table.Cell>
                    {
                      (comment._id !== currentUser._id) && (
                        <Table.Cell>
                          <span 
                            onClick={() => {
                              setShowModal(true);
                              setCommentIdToDelete(comment._id)
                            }}
                            className="font-medium text-red-500 hover:cursor-pointer hover:underline"
                          >
                            Delete
                          </span>
                        </Table.Cell>
                      )  
                    }
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            {
              showMore && (
                <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
                  Show More
                </button>
              )
            }
          </>
        ) : (
          <p>You have no comments yet!</p>
        )
      }
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteComment}>Yes, I am sure</Button>
              <Button color="success" onClick={() => setShowModal(false)}>No, cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DashComments