import { Sidebar } from "flowbite-react"
import { useEffect, useState } from "react";
import { HiAnnotation, HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiUser } from "react-icons/hi"
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signInFailure, signoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  const {currentUser} = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    setTab(tabFromUrl);
  }, [location.search]);

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
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item 
              as='div' 
              active={tab === 'profile'} 
              icon={HiUser} 
              label={currentUser.isAdmin ? "Admin" : "User"} 
              labelColor="dark" 
            >
              Profile
            </Sidebar.Item>
          </Link>
          {
            currentUser.isAdmin && (
              <Link to="/dashboard?tab=posts">
                <Sidebar.Item as='div' active={tab === 'posts'} icon={HiDocumentText} label="" labelColor="">
                  Posts
                </Sidebar.Item>
              </Link>
            )
          }
          {
            currentUser.isAdmin && (
              <>
                <Link to="/dashboard?tab=users">
                  <Sidebar.Item as='div' active={tab === 'users'} icon={HiOutlineUserGroup} label="" labelColor="">
                    Users
                  </Sidebar.Item>
                </Link>
                <Link to="/dashboard?tab=comments">
                  <Sidebar.Item as='div' active={tab === 'comments'} icon={HiAnnotation} label="" labelColor="">
                    Comments
                  </Sidebar.Item>
                </Link>
              </>
            )
          }
          <Sidebar.Item icon={HiArrowSmRight} onClick={handleSignout} className="cursor-pointer" >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar