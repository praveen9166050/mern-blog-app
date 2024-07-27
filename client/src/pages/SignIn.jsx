import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

function SignIn() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return setErrorMessage("Please fill out all the fields.");
    }
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      // setLoading(false);
      if (!data.success) {
        // return setErrorMessage(data.message);
        throw new Error(data.message);
      }
      if (res.ok) {
        navigate('/');
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen mt-20">
      <div className="flex flex-col md:flex-row md:items-center p-3 max-w-3xl mx-auto gap-5">
        <div className="flex-1">
          <Link to='/' className='text-4xl font-bold dark:text-white'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>My</span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            This is a demo project, you can sign in with your email and password, or with Google.
          </p>
        </div>
        <div className="flex-1" onSubmit={handleSubmit}>
          <form className="flex flex-col gap-4">
            <div>
              <Label value="Your email" />
              <TextInput type="email" placeholder="Email" id="email" onChange={handleChange} />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput type="password" placeholder="Password" id="password" onChange={handleChange} />
            </div>
            <Button type="submit" gradientDuoTone="purpleToPink" disabled={loading}>
              {
                loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : 'Sign In'
              }
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            Don't have an account?
            <Link to='/sign-up' className="text-blue-500">Sign Up</Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">{errorMessage}</Alert>
          )}
        </div>
      </div>
    </div>
  )
}

export default SignIn