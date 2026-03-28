import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../config/axios'
import { UserContext } from '../context/user.context'

const Login = () => {


    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')

    const { setUser } = useContext(UserContext)

    const navigate = useNavigate()

    function submitHandler(e) {

        e.preventDefault()

        axios.post('/users/login', {
            email,
            password
        }).then((res) => {
            console.log(res.data)

            localStorage.setItem('token', res.data.token)
            setUser(res.data.user)

            navigate('/')
        }).catch((err) => {
            console.log(err.response.data)
        })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
            <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700/50">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                        <i className="ri-code-s-slash-line text-white text-xl"></i>
                    </div>
                    <h1 className="text-xl font-bold text-white">SOEN</h1>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
                <p className="text-slate-400 mb-6 text-sm">Sign in to your workspace</p>
                <form
                    onSubmit={submitHandler}
                >
                    <div className="mb-4">
                        <label className="block text-slate-300 mb-2 text-sm font-medium" htmlFor="email">Email</label>
                        <div className="relative">
                            <i className="ri-mail-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                id="email"
                                className="w-full p-3 pl-10 rounded-xl bg-slate-900/50 text-white border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-500"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-slate-300 mb-2 text-sm font-medium" htmlFor="password">Password</label>
                        <div className="relative">
                            <i className="ri-lock-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                id="password"
                                className="w-full p-3 pl-10 rounded-xl bg-slate-900/50 text-white border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-500"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full p-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800 active:scale-[0.98]"
                    >
                        Sign In
                    </button>
                </form>
                <p className="text-slate-400 mt-6 text-center text-sm">
                    Don't have an account? <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">Create one</Link>
                </p>
            </div>
        </div>
    )
}

export default Login