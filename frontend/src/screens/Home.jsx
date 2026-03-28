import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../context/user.context'
import axios from "../config/axios"
import { useNavigate } from 'react-router-dom'

const Home = () => {

    const { user } = useContext(UserContext)
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ projectName, setProjectName ] = useState(null)
    const [ project, setProject ] = useState([])

    const navigate = useNavigate()

    function createProject(e) {
        e.preventDefault()
        console.log({ projectName })

        axios.post('/projects/create', {
            name: projectName,
        })
            .then((res) => {
                console.log(res)
                setIsModalOpen(false)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        axios.get('/projects/all').then((res) => {
            setProject(res.data.projects)

        }).catch(err => {
            console.log(err)
        })

    }, [])

    return (
        <main className='min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6'>
            <header className='flex items-center justify-between mb-8'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center'>
                        <i className='ri-code-s-slash-line text-white text-xl'></i>
                    </div>
                    <h1 className='text-xl font-bold text-white'>SOEN</h1>
                </div>
                <p className='text-slate-400 text-sm'>Welcome, <span className='text-indigo-400'>{user?.email}</span></p>
            </header>

            <div className='mb-6'>
                <h2 className='text-2xl font-bold text-white mb-1'>Your Projects</h2>
                <p className='text-slate-400 text-sm'>Create and manage your AI-powered coding workspaces</p>
            </div>

            <div className="projects flex flex-wrap gap-4">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="group p-6 border-2 border-dashed border-slate-600/50 rounded-2xl hover:border-indigo-500/50 hover:bg-indigo-500/5 min-w-[220px] flex flex-col items-center justify-center gap-3">
                    <div className='w-12 h-12 rounded-xl bg-slate-800 group-hover:bg-indigo-600 flex items-center justify-center'>
                        <i className="ri-add-line text-2xl text-slate-400 group-hover:text-white"></i>
                    </div>
                    <span className='text-slate-300 font-medium'>New Project</span>
                </button>

                {
                    project.map((project) => (
                        <div key={project._id}
                            onClick={() => {
                                navigate(`/project`, {
                                    state: { project }
                                })
                            }}
                            className="group cursor-pointer p-6 bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-2xl min-w-[220px] hover:bg-slate-800/70 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5">
                            <div className='w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center mb-4'>
                                <i className='ri-folder-3-line text-indigo-400 text-lg'></i>
                            </div>
                            <h2 className='font-semibold text-white mb-2 text-lg'>{project.name}</h2>
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <i className="ri-team-line"></i>
                                <span>{project.users.length} collaborator{project.users.length !== 1 ? 's' : ''}</span>
                            </div>
                        </div>
                    ))
                }
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
                    <div className="bg-slate-800 border border-slate-700/50 p-6 rounded-2xl shadow-2xl w-full max-w-md">
                        <h2 className="text-xl font-bold text-white mb-1">Create New Project</h2>
                        <p className='text-slate-400 text-sm mb-5'>Give your project a unique name</p>
                        <form onSubmit={createProject}>
                            <div className="mb-5">
                                <label className="block text-sm font-medium text-slate-300 mb-2">Project Name</label>
                                <input
                                    onChange={(e) => setProjectName(e.target.value)}
                                    value={projectName}
                                    type="text"
                                    className="w-full p-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder='e.g. my-express-app'
                                    required />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" className="px-5 py-2.5 bg-slate-700 text-slate-300 rounded-xl hover:bg-slate-600 font-medium" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 font-medium">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    )
}

export default Home