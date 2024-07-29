import { Sidebar } from "flowbite-react"
import { useEffect, useState } from "react";
import { HiArrowSmRight, HiUser } from "react-icons/hi"
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signInFailure, signoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState('');
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
        <Sidebar.ItemGroup>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item as='div' active={tab === 'profile'} icon={HiUser} label="User" labelColor="dark" >
              Profile
            </Sidebar.Item>
          </Link>
          <Sidebar.Item icon={HiArrowSmRight} onClick={handleSignout} className="cursor-pointer" >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar