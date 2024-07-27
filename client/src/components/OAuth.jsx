import { Button } from "flowbite-react"
import { AiFillGoogleCircle } from "react-icons/ai"
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInFailure, signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    provider.getCustomParameters({prompt: 'select_account'});
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const {user} = resultsFromGoogle;
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          googlePhotoUrl: user.photoURL
        })
      });
      const data = res.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      if (res.ok) {
        dispatch(signInSuccess(data.user));
        navigate('/')
      }
    } catch (error) {
      console.log(error.message);
      dispatch(signInFailure(error.message));
    }
  }

  return (
    <Button type="button" gradientDuoTone="pinkToOrange" outline onClick={handleClick}>
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Continue with Google
    </Button>
  )
}

export default OAuth