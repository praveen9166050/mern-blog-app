import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar"
import 'react-circular-progressbar/dist/styles.css';
import { deleteFailure, deleteStart, deleteSuccess, signInFailure, signoutSuccess, updateFailure, updateStart, updateSuccess } from "../redux/user/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi"

function DashProfile() {
  const {currentUser, errorMessage} = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserFailure, setUpdateUserFailure] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  }

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = () => {
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError("Could not upload image");
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
        .then(downloadUrl => {
          setImageFileUrl(downloadUrl);
          setImageFileUploadProgress(null);
          setFormData({...formData, profilePicture: downloadUrl});
        });
      }
    );
  }

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      return;
    }
    dispatch(updateStart());
    setUpdateUserSuccess(null);
    setUpdateUserFailure(null);
    try {
      const res = await fetch(`/api/users/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      if (res.ok) {
        dispatch(updateSuccess(data.user));
        setUpdateUserSuccess(true);
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserFailure(error.message);
    }
  }

  const handleDeleteUser = async (e) => {
    dispatch(deleteStart());
    try {
      const res = await fetch(`/api/users/delete/${currentUser._id}`, {method: 'DELETE'});
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      if (res.ok) {
        dispatch(deleteSuccess());
      }
    } catch (error) {
      dispatch(deleteFailure(error.message));
    }
  }

  const handleSignout = async (e) => {
    try {
      const res = await fetch(`/api/users/signout`, {method: 'POST'});
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      if (res.ok) {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      dispatch(signInFailure("Could not sign out. Please try again."));
    }
  }

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="file" accept="image/*" ref={filePickerRef} onChange={handleImageChange} hidden />
        <div 
          onClick={() => filePickerRef.current.click()}
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
        >
          {imageFileUploadProgress && (
            <CircularProgressbar 
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`
                }
              }}
            />
          )}
          <img 
            src={imageFileUrl || currentUser.profilePicture} 
            alt="user" 
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] 
              ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`
            } 
          />
        </div>
        {imageFileUploadError && <Alert color="failure">{imageFileUploadError}</Alert>}
        <TextInput 
          type="text" 
          id="username" 
          placeholder="Username" 
          defaultValue={currentUser.username} 
          onChange={handleChange}
        />
        <TextInput 
          type="email" 
          id="email" 
          placeholder="Email" 
          defaultValue={currentUser.email} 
          onChange={handleChange}
        />
        <TextInput 
          type="password" 
          id="password" 
          placeholder="Password" 
          onChange={handleChange}
        />
        <Button 
          type="submit" 
          gradientDuoTone="purpleToBlue" 
          outline 
          disabled={imageFileUploadProgress !== null}
        >
          Update
        </Button>
        {
          currentUser.isAdmin && (
            <Link to='/create-post'>
              <Button type="button" gradientDuoTone="purpleToPink" className="w-full">
                Create a post
              </Button>
            </Link>
          )
        }
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={() => setShowModal(true)} className="cursor-pointer">Delete Account</span>
        <span onClick={handleSignout} className="cursor-pointer">Sign Out</span>
      </div>
      {updateUserSuccess && (
        <Alert color='success' className="mt-5">
          Profile has been updated successfully
        </Alert>
      )}
      {updateUserFailure && (
        <Alert color='failure' className="mt-5">
          {updateUserFailure}
        </Alert>
      )}
      {errorMessage && (
        <Alert color='failure' className="mt-5">
          {errorMessage}
        </Alert>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
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

export default DashProfile