import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { FaMoon, FaSun } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signInFailure, signoutSuccess } from '../redux/user/userSlice';
import { useEffect, useState } from 'react';

function Header() {
  const {currentUser} = useSelector((state) => state.user);
  const {theme} = useSelector((state => state.theme));
  const [searchTerm, setSearchTerm] = useState(null);
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignout = async (e) => {
    try {
      const res = await fetch(`/api/users/signout`, {method: 'POST'});
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      if (res.ok) {
        dispatch(signoutSuccess());
        navigate('/sign-in');
      }
    } catch (error) {
      dispatch(signInFailure("Could not sign out. Please try again."));
    }
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const ulrParams = new URLSearchParams(location.search);
    ulrParams.set('searchTerm', searchTerm);
    const searchQuery = ulrParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  return (
    <Navbar className='border-b-2'>
      <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>My</span>
        Blog
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput 
          type='text'
          placeholder='Search...'
          rightIcon={AiOutlineSearch}
          defaultValue={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='hidden lg:inline'
        />
      </form>
      <Button className='w-12 h-10 lg:hidden' color='gray' pill>
        <AiOutlineSearch />
      </Button>
      <div className='flex gap-2 md:order-2'>
        <Button className='w-12 h-10 sm:inline' color='gray' pill onClick={() => dispatch(toggleTheme())}>
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </Button>
        {
          currentUser ? (
            <Dropdown 
              arrowIcon={false} 
              inline 
              label={<Avatar alt='user' img={currentUser.profilePicture} rounded />}
            >
              <Dropdown.Header>
                <span className='block text-sm'>{currentUser.username}</span>
                <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
              </Dropdown.Header>
              <Link to='/dashboard?tab=profile'>
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link> 
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignout}>Sign Out</Dropdown.Item>
            </Dropdown>
          ) : (
            <Link to='/sign-in'>
              <Button gradientDuoTone='purpleToBlue' outline>Sign In</Button>
            </Link>
          )
        }
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link as='div' active={path === '/'}>
          <Link to='/'>Home</Link>
        </Navbar.Link>
        <Navbar.Link as='div' active={path === '/about'}>
          <Link to='/about'>About</Link>
        </Navbar.Link>
        <Navbar.Link as='div' active={path === '/projects'}>
          <Link to='/projects'>Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header