function About() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-3 text-center">
        <div>
          <h1 className="text-3xl text-center font-semibold my-7">About My Blog</h1>
          <div className="flex flex-col gap-6 text-md text-gray-500">
            <p>
              Welcome to My Blog! This blog was created as a personal project to share 
              my thoughts and ideas with the world. I am a passionate developer who loves to write 
              about technology, coding, and everything in between.
            </p>
            <p>
              On this blog, you'll find weekly articles and tutorials on topics such as web development, 
              software engineering, and programming languages. I am always learning and exploring 
              new technologies, so be sure to check back often for new content!
            </p>
            <p>
              I encourage you to leave comments on our posts and engage with other readers. 
              You can like other people's comments and reply to them as well. I believe that 
              a community of learners can help each other grow and improve.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About