import React from 'react'

function login() {
  return (
    <div className = " bg-white dark:bg-[#0F172A]">
        <div className = "bg-black before:animate-pulse before:bg-gradient-to-b before:from-gray-900 overflow-hidden before:via-[#00FF00] before:to-gray-900 before:absolute ">
            <div id="myDIV" >
                <div className = "w-[100vw] h-[100vh] px-3 sm:px-5 flex items-center justify-center absolute">
                    <div className = "w-full sm:w-1/2 lg:2/3 px-6 bg-gray-500 bg-opacity-20 bg-clip-padding backdrop-filter backdrop-blur-sm text-white z-50 py-4  rounded-lg">
                        <div className = "w-full flex justify-center text-[#00FF00] text-xl mb:2 md:mb-5">
                            Sign In
                        </div>
                        <div className="mb-6">
                            <label for="email" className="block mb-2 text-xs font-medium text-white">Your email</label>
                            <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@neurolink.com" required/>
                        </div>
                        <div className="mb-6">
                            <label for="password" className="block mb-2 text-xs font-medium text-white">Your password</label>
                            <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                        </div>
                        <div className = "flex flex-row justify-between">
                            <div className = "text-white text-sm md:text-md ">Forgot Password</div>
                            <div className = "text-[#00FF00] text-sm md:text-md">Signup</div>
                        </div>
                        <div className = "mt-4 md:mt-10 w-full flex justify-center text-sm md:text-xl bg-[#00FF00] py-2 rounded-md">
                            Login
                        </div>
            
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default login
