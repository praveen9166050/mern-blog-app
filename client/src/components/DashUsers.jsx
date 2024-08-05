import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react"
import { FaCheck, FaTimes } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";

function DashUsers() {
  const {currentUser} = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/users/getUsers`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data?.message || "Something went wrong");
        }
        setUsers(data.users);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (currentUser.isAdmin) {
      fetchUsers()
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    try {
      const startIndex = users.length;
      const res = await fetch(`/api/users/getUsers?startIndex=${startIndex}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Something went wrong");
      }
      setUsers((prev) => [...prev, ...data.users]);
      if (data.users.length < 9) {
        setShowMore(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/users/delete/${userIdToDelete}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Something went wrong");
      }
      setUsers((prev) => prev.filter(user => user._id !== userIdToDelete._id));
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {
        currentUser.isAdmin && users.length > 0 ? (
          <>
            <Table hoverable className="shadow-md">
              <Table.Head>
                <Table.HeadCell>Date Created</Table.HeadCell>
                <Table.HeadCell>User Image</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Admin</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {users.map(user => (
                  <Table.Row 
                    key={user._id} 
                    className="bg-white text-gray-900 dark:text-gray-400 dark:bg-gray-800 divide-y"
                  >
                    <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                    <Table.Cell>
                      <img 
                        src={user.profilePicture} 
                        alt={user.username} 
                        className="w-10 h-10 object-cover rounded-full bg-gray-500" 
                      />
                    </Table.Cell>
                    <Table.Cell>
                      {user.username}
                    </Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>
                      {user.isAdmin ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}
                    </Table.Cell>
                    {
                      (user._id !== currentUser._id) && (
                        <Table.Cell>
                          <span 
                            onClick={() => {
                              setShowModal(true);
                              setUserIdToDelete(user._id)
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
          <p>You have no users yet!</p>
        )
      }
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>Yes, I am sure</Button>
              <Button color="success" onClick={() => setShowModal(false)}>No, cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DashUsers