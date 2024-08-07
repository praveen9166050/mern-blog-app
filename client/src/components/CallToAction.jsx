import { Button } from "flowbite-react"

function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-xl rounded-br-xl text-center">
      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-2xl">Want to learn more about JavaScript?</h2>
        <p className="text-gray-500 my-2">Checkout these resources with 100 JavaScript projects</p>
        <Button gradientDuoTone="purpleToPink" className="rounded-tl-xl rounded-bl-none">
          <a href="https://www.100jsprojects.com" target="_blank" rel="noopener noreferrer">
            100 JS Projects
          </a>
        </Button>
      </div>
      <div className="flex-1 p-7">
        <img src="https://bairesdev.mo.cloudinary.net/blog/2023/08/What-Is-JavaScript-Used-For.jpg" alt="" />
      </div>
    </div>
  )
}

export default CallToAction