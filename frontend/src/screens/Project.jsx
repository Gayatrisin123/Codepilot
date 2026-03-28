import React, { useState, useEffect, useContext, useRef } from 'react'
import { UserContext } from '../context/user.context'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from '../config/axios'
import { initializeSocket, receiveMessage, sendMessage, getSocket } from '../config/socket'
import Markdown from 'markdown-to-jsx'
import hljs from 'highlight.js';
import { getWebContainer } from '../config/webcontainer'


// Convert flat paths like "pages/index.js" into nested WebContainer directory structure
function normalizeFileTree(ft) {
    const result = {}
    for (const [path, value] of Object.entries(ft)) {
        if (!path.includes('/')) {
            result[path] = value
        } else {
            const parts = path.split('/')
            let current = result
            for (let i = 0; i < parts.length - 1; i++) {
                if (!current[parts[i]]) {
                    current[parts[i]] = { directory: {} }
                }
                current = current[parts[i]].directory
            }
            current[parts[parts.length - 1]] = value
        }
    }
    return result
}


// Get a file node from the nested tree by a slash-separated path
function getFileNode(tree, path) {
    const parts = path.split('/')
    let current = tree
    for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]?.directory) return null
        current = current[parts[i]].directory
    }
    return current[parts[parts.length - 1]]
}

// Return a new tree with the file at `path` updated with new contents
function setFileContents(tree, path, contents) {
    const parts = path.split('/')
    if (parts.length === 1) {
        return { ...tree, [parts[0]]: { file: { contents } } }
    }
    const [head, ...rest] = parts
    return {
        ...tree,
        [head]: {
            directory: setFileContents(tree[head].directory, rest.join('/'), contents)
        }
    }
}

// Detect highlight.js language from file extension
function detectLanguage(filename) {
    const ext = filename.split('.').pop().toLowerCase()
    const map = {
        js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript',
        py: 'python', java: 'java', c: 'c', cpp: 'cpp', cc: 'cpp',
        go: 'go', rs: 'rust', rb: 'ruby', php: 'php', swift: 'swift',
        kt: 'kotlin', scala: 'scala', cs: 'csharp', sh: 'bash',
        html: 'html', css: 'css', json: 'json', md: 'markdown', yaml: 'yaml', yml: 'yaml',
    }
    return map[ext] || 'plaintext'
}

// Collect all file paths (full slash-separated paths) from a nested tree
function collectFilePaths(tree, prefix = '') {
    const paths = []
    for (const [name, node] of Object.entries(tree)) {
        const fullPath = prefix ? `${prefix}/${name}` : name
        if (node.file) paths.push(fullPath)
        if (node.directory) paths.push(...collectFilePaths(node.directory, fullPath))
    }
    return paths
}

// Recursive file tree explorer component
function FileTreeItem({ name, node, path, onFileClick, currentFile, depth = 0 }) {
    const [isOpen, setIsOpen] = useState(true)

    if (node.file) {
        return (
            <button
                onClick={() => onFileClick(path)}
                style={{ paddingLeft: `${(depth + 1) * 12}px` }}
                className={`tree-element cursor-pointer p-2 pr-4 flex items-center gap-2 w-full hover:bg-slate-800 text-slate-300 hover:text-white border-l-2 ${currentFile === path ? 'border-indigo-500 bg-slate-800/60 text-white' : 'border-transparent hover:border-indigo-500'}`}>
                <i className="ri-file-code-line text-indigo-400 text-sm"></i>
                <p className='text-sm'>{name}</p>
            </button>
        )
    }

    if (node.directory) {
        return (
            <div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    style={{ paddingLeft: `${(depth + 1) * 12}px` }}
                    className="tree-element cursor-pointer p-2 pr-4 flex items-center gap-2 w-full hover:bg-slate-800 text-slate-300 hover:text-white">
                    <i className={`ri-arrow-${isOpen ? 'down' : 'right'}-s-line text-slate-500 text-sm`}></i>
                    <i className={`ri-folder-${isOpen ? 'open' : '3'}-fill text-yellow-500 text-sm`}></i>
                    <p className='text-sm'>{name}</p>
                </button>
                {isOpen && Object.entries(node.directory).map(([childName, childNode]) => (
                    <FileTreeItem
                        key={childName}
                        name={childName}
                        node={childNode}
                        path={`${path}/${childName}`}
                        onFileClick={onFileClick}
                        currentFile={currentFile}
                        depth={depth + 1}
                    />
                ))}
            </div>
        )
    }

    return null
}

function SyntaxHighlightedCode(props) {
    const ref = useRef(null)

    React.useEffect(() => {
        if (ref.current && props.className?.includes('lang-') && window.hljs) {
            window.hljs.highlightElement(ref.current)

            // hljs won't reprocess the element unless this attribute is removed
            ref.current.removeAttribute('data-highlighted')
        }
    }, [ props.className, props.children ])

    return <code {...props} ref={ref} />
}


const Project = () => {

    const location = useLocation()

    const [ isSidePanelOpen, setIsSidePanelOpen ] = useState(false)
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ selectedUserId, setSelectedUserId ] = useState(new Set()) // Initialized as Set
    const [ project, setProject ] = useState(location.state.project)
    const [ message, setMessage ] = useState('')
    const { user } = useContext(UserContext)
    const messageBox = React.createRef()

    const [ users, setUsers ] = useState([])
    const [ messages, setMessages ] = useState([]) // New state variable for messages
    const [ fileTree, setFileTree ] = useState({})

    const [ currentFile, setCurrentFile ] = useState(null)
    const [ openFiles, setOpenFiles ] = useState([])

    const [ webContainer, setWebContainer ] = useState(null)
    const webContainerRef = useRef(null)
    const [ iframeUrl, setIframeUrl ] = useState(null)

    const [ runProcess, setRunProcess ] = useState(null)

    const handleUserClick = (id) => {
        setSelectedUserId(prevSelectedUserId => {
            const newSelectedUserId = new Set(prevSelectedUserId);
            if (newSelectedUserId.has(id)) {
                newSelectedUserId.delete(id);
            } else {
                newSelectedUserId.add(id);
            }

            return newSelectedUserId;
        });


    }


    function addCollaborators() {

        axios.put("/projects/add-user", {
            projectId: location.state.project._id,
            users: Array.from(selectedUserId)
        }).then(res => {
            console.log(res.data)
            setIsModalOpen(false)

        }).catch(err => {
            console.log(err)
        })

    }

    const send = () => {
        if (!message || !message.trim()) return

        const msgText = message
        setMessage("")

        sendMessage('project-message', {
            message: msgText,
            sender: user
        })
        setMessages(prevMessages => [ ...prevMessages, { sender: user, message: msgText } ])
    }

    function WriteAiMessage(message) {

        const messageObject = JSON.parse(message)

        return (
            <div
                className='overflow-auto bg-slate-950 text-white rounded-sm p-2'
            >
                <Markdown
                    children={messageObject.text}
                    options={{
                        overrides: {
                            code: SyntaxHighlightedCode,
                        },
                    }}
                />
            </div>)
    }

    useEffect(() => {

        const socket = initializeSocket(project._id)

        if (!webContainerRef.current) {
            getWebContainer().then(container => {
                setWebContainer(container)
                webContainerRef.current = container
                console.log("container started")
                container.on('server-ready', (port, url) => {
                    console.log(port, url)
                    setIframeUrl(url)
                })
            })
        }

        const handleMessage = (data) => {

            console.log(data)
            
            if (data.sender._id == 'ai') {


                const message = JSON.parse(data.message)

                console.log(message)

                // Handle AI returning fileTree under different keys
                const rawFt = message.fileTree || message.code || message.files
                if (rawFt) {
                    const ft = normalizeFileTree(rawFt)
                    webContainerRef.current?.mount(ft)
                    setFileTree(ft)
                    setOpenFiles([])
                    setCurrentFile(null)
                    // Persist AI-generated fileTree to DB
                    axios.put('/projects/update-file-tree', {
                        projectId: location.state.project._id,
                        fileTree: ft
                    }).catch(err => console.log(err))
                }
                setMessages(prevMessages => [ ...prevMessages, data ]) // Update messages state
            } else {


                setMessages(prevMessages => [ ...prevMessages, data ]) // Update messages state
            }
        }

        receiveMessage('project-message', handleMessage)


        axios.get(`/projects/get-project/${location.state.project._id}`).then(res => {

            console.log(res.data.project)

            setProject(res.data.project)
            setFileTree(res.data.project.fileTree || {})
        })

        axios.get('/users/all').then(res => {

            setUsers(res.data.users)

        }).catch(err => {

            console.log(err)

        })

        return () => {
            socket.off('project-message', handleMessage)
            socket.disconnect()
        }

    }, [])

    function saveFileTree(ft) {
        axios.put('/projects/update-file-tree', {
            projectId: project._id,
            fileTree: ft
        }).then(res => {
            console.log(res.data)
        }).catch(err => {
            console.log(err)
        })
    }


    // Removed appendIncomingMessage and appendOutgoingMessage functions

    function scrollToBottom() {
        messageBox.current.scrollTop = messageBox.current.scrollHeight
    }

    return (
        <main className='h-screen w-screen flex bg-slate-950'>
            <section className="left relative flex flex-col h-screen min-w-96 bg-slate-900 border-r border-slate-700/50">
                <header className='flex justify-between items-center p-3 px-4 w-full bg-slate-800/80 backdrop-blur-sm absolute z-10 top-0 border-b border-slate-700/50'>
                    <button className='flex gap-2 items-center text-slate-300 hover:text-indigo-400 text-sm font-medium' onClick={() => setIsModalOpen(true)}>
                        <i className="ri-add-circle-line text-lg"></i>
                        <p>Add collaborator</p>
                    </button>
                    <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className='p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700'>
                        <i className="ri-group-fill"></i>
                    </button>
                </header>
                <div className="conversation-area pt-14 pb-10 flex-grow flex flex-col h-full relative">

                    <div
                        ref={messageBox}
                        className="message-box p-2 flex-grow flex flex-col gap-2 overflow-auto max-h-full">
                        {messages.map((msg, index) => (
                            <div key={index} className={`${msg.sender._id === 'ai' ? 'max-w-80' : 'max-w-60'} ${msg.sender._id == user._id.toString() && 'ml-auto'}  message flex flex-col p-3 ${msg.sender._id === 'ai' ? 'bg-indigo-900/40 border border-indigo-500/20' : msg.sender._id == user._id.toString() ? 'bg-slate-700/60' : 'bg-slate-800/60'} w-fit rounded-xl`}>
                                <small className='opacity-50 text-xs text-slate-300'>{msg.sender.email}</small>
                                <div className='text-sm text-slate-100 mt-1'>
                                    {msg.sender._id === 'ai' ?
                                        WriteAiMessage(msg.message)
                                        : <p>{msg.message}</p>}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="inputField w-full flex absolute bottom-0 border-t border-slate-700/50">
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && message.trim() && send()}
                            className='p-3 px-4 border-none outline-none flex-grow bg-slate-800 text-white placeholder-slate-500' type="text" placeholder='Type a message... (use @ai for AI)' />
                        <button
                            onClick={send}
                            className='px-5 bg-indigo-600 text-white hover:bg-indigo-500'><i className="ri-send-plane-fill"></i></button>
                    </div>
                </div>
                <div className={`sidePanel w-full h-full flex flex-col gap-2 bg-slate-900 absolute transition-all ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'} top-0`}>
                    <header className='flex justify-between items-center px-4 p-3 bg-slate-800 border-b border-slate-700/50'>

                        <h1
                            className='font-semibold text-lg text-white'
                        >Collaborators</h1>

                        <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className='p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700'>
                            <i className="ri-close-fill"></i>
                        </button>
                    </header>
                    <div className="users flex flex-col gap-1 p-2">

                        {project.users && project.users.map(user => {


                            return (
                                <div className="user cursor-pointer hover:bg-slate-800 rounded-xl p-3 flex gap-3 items-center">
                                    <div className='aspect-square rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-indigo-600/30'>
                                        <i className="ri-user-fill absolute text-indigo-400"></i>
                                    </div>
                                    <h1 className='font-medium text-slate-200'>{user.email}</h1>
                                </div>
                            )


                        })}
                    </div>
                </div>
            </section>

            <section className="right bg-slate-950 flex-grow h-full flex">

                <div className="explorer h-full max-w-64 min-w-52 bg-slate-900/80 border-r border-slate-700/50">
                    <div className="p-3 border-b border-slate-700/50">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Explorer</h3>
                    </div>
                    <div className="file-tree w-full overflow-auto">
                        {
                            Object.entries(fileTree).map(([name, node]) => (
                                <FileTreeItem
                                    key={name}
                                    name={name}
                                    node={node}
                                    path={name}
                                    onFileClick={(path) => {
                                        setCurrentFile(path)
                                        setOpenFiles(prev => [ ...new Set([ ...prev, path ]) ])
                                    }}
                                    currentFile={currentFile}
                                    depth={0}
                                />
                            ))
                        }
                    </div>

                </div>


                <div className="code-editor flex flex-col flex-grow h-full shrink">

                    <div className="top flex justify-between w-full bg-slate-900 border-b border-slate-700/50">

                        <div className="files flex">
                            {
                                openFiles.map((file, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentFile(file)}
                                        className={`open-file cursor-pointer p-2.5 px-4 flex items-center w-fit gap-2 text-sm ${currentFile === file ? 'bg-slate-800 text-white border-t-2 border-indigo-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border-t-2 border-transparent'}`}>
                                        <i className="ri-file-code-line text-xs"></i>
                                        <p>{file.split('/').pop()}</p>
                                    </button>
                                ))
                            }
                        </div>

                        <div className="actions flex gap-2 items-center pr-3">
                            <button
                                onClick={async () => {
                                    if (!fileTree || Object.keys(fileTree).length === 0) {
                                        alert("No file tree to run. Ask the AI to generate code first.")
                                        return
                                    }

                                    await webContainer.mount(normalizeFileTree(fileTree))

                                    const allFilePaths = collectFilePaths(fileTree)
                                    const hasPkgJson = !!fileTree['package.json']
                                    const pyFiles = allFilePaths.filter(f => f.endsWith('.py'))
                                    const hasPython = pyFiles.length > 0

                                    if (hasPkgJson) {
                                        // Kill previous process first to free the port
                                        if (runProcess) {
                                            runProcess.kill()
                                            setRunProcess(null)
                                        }

                                        // Node.js project — use WebContainer
                                        const installProcess = await webContainer.spawn("npm", [ "install" ])

                                        installProcess.output.pipeTo(new WritableStream({
                                            write(chunk) {
                                                console.log(chunk)
                                            }
                                        }))

                                        const installExitCode = await installProcess.exit

                                        if (installExitCode !== 0) {
                                            console.error("npm install failed with exit code", installExitCode)
                                        }

                                        // Detect the best run command from package.json
                                        let startCmd = [ "start" ]
                                        try {
                                            const pkgContents = fileTree['package.json']?.file?.contents
                                            if (pkgContents) {
                                                const pkg = JSON.parse(pkgContents)
                                                if (pkg.scripts?.dev) {
                                                    startCmd = [ "run", "dev" ]
                                                }
                                            }
                                        } catch (e) { /* fall back to npm start */ }

                                        let tempRunProcess = await webContainer.spawn("npm", startCmd);

                                        tempRunProcess.output.pipeTo(new WritableStream({
                                            write(chunk) {
                                                console.log(chunk)
                                            }
                                        }))

                                        setRunProcess(tempRunProcess)

                                    } else if (hasPython) {
                                        // Python project — run with Pyodide in browser
                                        const mainPy = pyFiles.find(f => f === 'main.py' || f === 'app.py') || pyFiles[0]
                                        const pythonCode = getFileNode(fileTree, mainPy)?.file?.contents || ''

                                        // Collect all Python files for multi-file support
                                        const allPyFiles = {}
                                        pyFiles.forEach(f => {
                                            allPyFiles[f] = getFileNode(fileTree, f)?.file?.contents || ''
                                        })

                                        // Check if it's a Flask app
                                        const isFlask = pythonCode.includes('Flask') && (pythonCode.includes('app.run') || pythonCode.includes('.route'))

                                        // Build requirements install packages list
                                        const reqNode = getFileNode(fileTree, 'requirements.txt')
                                        const reqContents = reqNode?.file?.contents || ''
                                        const packages = reqContents ? reqContents.split('\n').map(l => l.trim().split('==')[0].split('>=')[0].split('<=')[0]).filter(Boolean) : []

                                        // Flask test client script
                                        const flaskTestScript = [
                                            'import sys',
                                            'sys.stdout = io.StringIO()',
                                            'try:',
                                            '    client = app.test_client()',
                                            '    routes = []',
                                            '    for rule in app.url_map.iter_rules():',
                                            '        if rule.endpoint != "static":',
                                            '            routes.append((rule.rule, list(rule.methods - {"OPTIONS", "HEAD"})))',
                                            '    routes.sort(key=lambda x: x[0])',
                                            '    print("=== Flask App Routes ===")',
                                            '    print()',
                                            '    for route_path, methods in routes:',
                                            '        for method in sorted(methods):',
                                            '            try:',
                                            '                if method == "GET":',
                                            '                    resp = client.get(route_path)',
                                            '                elif method == "POST":',
                                            '                    resp = client.post(route_path)',
                                            '                else:',
                                            '                    resp = client.get(route_path)',
                                            '                print(f"[{method}] {route_path}  Status: {resp.status_code}")',
                                            '                data = resp.get_data(as_text=True)',
                                            '                if data:',
                                            '                    print(data[:2000])',
                                            '                print()',
                                            '            except Exception as e:',
                                            '                print(f"[{method}] {route_path}  Error: {e}")',
                                            '                print()',
                                            'except Exception as e:',
                                            '    print(f"Error testing routes: {e}")',
                                        ].join('\n')

                                        // Build HTML page — all data passed via JSON to avoid escaping issues
                                        const pageData = {
                                            mainPy,
                                            allPyFiles,
                                            packages: isFlask ? [...packages, 'flask'] : packages,
                                            isFlask,
                                            pythonCode,
                                            flaskTestScript
                                        }

                                        const html = `<!DOCTYPE html>
<html>
<head>
<style>
  body { background: #0f172a; color: #e2e8f0; font-family: 'Courier New', monospace; padding: 20px; margin: 0; }
  #status { color: #818cf8; margin-bottom: 10px; }
  #output { white-space: pre-wrap; font-size: 14px; line-height: 1.6; }
  .error { color: #f87171; }
  .success { color: #34d399; }
</style>
<script src="https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js"><\/script>
</head>
<body>
<div id="status">Loading Python runtime...</div>
<div id="output"></div>
<script>
const PAGE_DATA = ${JSON.stringify(pageData)};

async function main() {
    const statusEl = document.getElementById('status');
    const outputEl = document.getElementById('output');
    try {
        const pyodide = await loadPyodide();
        statusEl.innerHTML = '<span class="success">Python ready \\u2014 running ' + PAGE_DATA.mainPy + '...</span>';

        for (const [fname, contents] of Object.entries(PAGE_DATA.allPyFiles)) {
            pyodide.FS.writeFile(fname, contents);
        }

        if (PAGE_DATA.packages.length > 0) {
            statusEl.innerHTML = '<span class="success">Installing packages: ' + PAGE_DATA.packages.join(', ') + '...</span>';
            await pyodide.loadPackage('micropip');
            const micropip = pyodide.pyimport('micropip');
            for (const pkg of PAGE_DATA.packages) {
                try { await micropip.install(pkg); } catch(e) {
                    outputEl.innerHTML += '<span class="error">Note: ' + pkg + ' may not be available in browser Python<\/span>\\n';
                }
            }
        }

        pyodide.runPython('import sys, io\\nsys.stdout = io.StringIO()\\nsys.stderr = io.StringIO()');

        if (PAGE_DATA.isFlask) {
            statusEl.innerHTML = '<span class="success">Flask app detected \\u2014 using test client...</span>';
            try {
                var modCode = PAGE_DATA.pythonCode;
                modCode = modCode.replace(/if\\s+__name__[\\s\\S]*?app\\.run\\([^)]*\\)/g, '# app.run removed');
                modCode = modCode.replace(/app\\.run\\([^)]*\\)/g, '# app.run removed');
                pyodide.runPython(modCode);
                pyodide.runPython(PAGE_DATA.flaskTestScript);
                var stdout = pyodide.runPython('sys.stdout.getvalue()');
                statusEl.innerHTML = '<span class="success">Flask app executed \\u2713 (routes tested via test client)</span>';
                outputEl.textContent = stdout || '(No routes or output)';
            } catch(pyErr) {
                statusEl.innerHTML = '<span class="error">Flask Error</span>';
                outputEl.textContent = pyErr.message;
            }
        } else {
            try {
                pyodide.runPython(PAGE_DATA.pythonCode);
                var stdout = pyodide.runPython('sys.stdout.getvalue()');
                var stderr = pyodide.runPython('sys.stderr.getvalue()');
                statusEl.innerHTML = '<span class="success">Execution complete \\u2713</span>';
                if (stdout) outputEl.textContent += stdout;
                if (stderr) outputEl.innerHTML += '<span class="error">' + stderr + '<\/span>';
                if (!stdout && !stderr) outputEl.textContent = '(No output)';
            } catch(pyErr) {
                statusEl.innerHTML = '<span class="error">Runtime Error</span>';
                outputEl.textContent = pyErr.message;
            }
        }
    } catch(e) {
        statusEl.innerHTML = '<span class="error">Failed to load Python runtime</span>';
        outputEl.textContent = e.message;
    }
}
main();
<\/script>
</body>
</html>`;
                                        const blob = new Blob([html], { type: 'text/html' })
                                        const url = URL.createObjectURL(blob)
                                        setIframeUrl(url)

                                    } else {
                                        // Other languages (Java, C, C++, etc.) — use Piston API
                                        const langMap = {
                                            'java': 'java',
                                            'c': 'c',
                                            'cpp': 'cpp', 'cc': 'cpp', 'cxx': 'cpp',
                                            'rb': 'ruby',
                                            'go': 'go',
                                            'rs': 'rust',
                                            'ts': 'typescript',
                                            'cs': 'csharp',
                                            'php': 'php',
                                            'swift': 'swift',
                                            'kt': 'kotlin',
                                            'scala': 'scala',
                                            'r': 'r',
                                            'pl': 'perl',
                                            'sh': 'bash',
                                            'lua': 'lua',
                                        }

                                        const allFiles = allFilePaths
                                        const codeFile = allFiles.find(f => {
                                            const ext = f.split('.').pop().toLowerCase()
                                            return langMap[ext]
                                        })

                                        if (!codeFile) {
                                            console.log("Files mounted. Could not detect a runnable language.")
                                            return
                                        }

                                        const ext = codeFile.split('.').pop().toLowerCase()
                                        const language = langMap[ext]

                                        // Collect all source files for Piston
                                        const pistonFiles = allFiles
                                            .filter(f => {
                                                const e = f.split('.').pop().toLowerCase()
                                                return langMap[e] === language
                                            })
                                            .map(f => ({
                                                name: f,
                                                content: getFileNode(fileTree, f)?.file?.contents || ''
                                            }))

                                        const pistonData = { language, files: pistonFiles }

                                        const pistonHtml = `<!DOCTYPE html>
<html>
<head>
<style>
  body { background: #0f172a; color: #e2e8f0; font-family: 'Courier New', monospace; padding: 20px; margin: 0; }
  #status { color: #818cf8; margin-bottom: 10px; }
  #output { white-space: pre-wrap; font-size: 14px; line-height: 1.6; }
  .error { color: #f87171; }
  .success { color: #34d399; }
  .info { color: #818cf8; }
</style>
</head>
<body>
<div id="status">Compiling & running ${language.charAt(0).toUpperCase() + language.slice(1)} code...</div>
<div id="output"></div>
<script>
const PISTON_DATA = ${JSON.stringify(pistonData)};

async function main() {
    const statusEl = document.getElementById('status');
    const outputEl = document.getElementById('output');
    try {
        const resp = await fetch('https://emkc.org/api/v2/piston/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                language: PISTON_DATA.language,
                version: '*',
                files: PISTON_DATA.files
            })
        });
        const result = await resp.json();
        if (result.message) {
            statusEl.innerHTML = '<span class="error">API Error</span>';
            outputEl.textContent = result.message;
            return;
        }
        const run = result.run || {};
        const compile = result.compile || {};
        if (compile.stderr) {
            statusEl.innerHTML = '<span class="error">Compilation Error</span>';
            outputEl.textContent = compile.stderr;
            return;
        }
        if (run.stderr && !run.stdout) {
            statusEl.innerHTML = '<span class="error">Runtime Error (exit code: ' + run.code + ')</span>';
            outputEl.textContent = run.stderr;
        } else {
            statusEl.innerHTML = '<span class="success">' + PISTON_DATA.language.charAt(0).toUpperCase() + PISTON_DATA.language.slice(1) + ' \\u2014 Execution complete \\u2713 (exit code: ' + run.code + ')</span>';
            if (run.stdout) outputEl.textContent = run.stdout;
            if (run.stderr) outputEl.textContent += '\\n' + run.stderr;
            if (!run.stdout && !run.stderr) outputEl.textContent = '(No output)';
        }
    } catch(e) {
        statusEl.innerHTML = '<span class="error">Failed to execute code</span>';
        outputEl.textContent = e.message + '\\n\\nMake sure you have internet access. The Piston API (emkc.org) is used for compiling and running code.';
    }
}
main();
<\/script>
</body>
</html>`;
                                        const blob2 = new Blob([pistonHtml], { type: 'text/html' })
                                        const url2 = URL.createObjectURL(blob2)
                                        setIframeUrl(url2)
                                    }

                                }}
                                className='px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-500 flex items-center gap-2'
                            >
                                <i className="ri-play-fill"></i>
                                Run
                            </button>


                        </div>
                    </div>
                    <div className="bottom flex flex-grow max-w-full shrink overflow-auto">
                        {
                            currentFile && getFileNode(fileTree, currentFile)?.file && (
                                <div className="code-editor-area h-full overflow-auto flex-grow bg-slate-900">
                                    <pre
                                        className="hljs h-full">
                                        <code
                                            className="hljs h-full outline-none"
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => {
                                                const updatedContent = e.target.innerText;
                                                const ft = setFileContents(fileTree, currentFile, updatedContent)
                                                setFileTree(ft)
                                                saveFileTree(ft)
                                            }}
                                            dangerouslySetInnerHTML={{ __html: hljs.highlight(detectLanguage(currentFile), getFileNode(fileTree, currentFile).file.contents).value }}
                                            style={{
                                                whiteSpace: 'pre-wrap',
                                                paddingBottom: '25rem',
                                                counterSet: 'line-numbering',
                                            }}
                                        />
                                    </pre>
                                </div>
                            )
                        }
                    </div>

                </div>

                {iframeUrl &&
                    (<div className="flex min-w-96 flex-col h-full border-l border-slate-700/50">
                        <div className="address-bar flex items-center bg-slate-800 border-b border-slate-700/50">
                            <div className="flex items-center gap-2 px-3">
                                <i className="ri-global-line text-slate-500 text-sm"></i>
                            </div>
                            <input type="text"
                                onChange={(e) => setIframeUrl(e.target.value)}
                                value={iframeUrl} className="w-full p-2 px-3 bg-slate-800 text-slate-300 text-sm focus:outline-none" />
                            <button
                                onClick={() => setIframeUrl(null)}
                                className="p-2 px-3 text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors"
                                title="Close preview"
                            >
                                <i className="ri-close-line"></i>
                            </button>
                        </div>
                        <iframe src={iframeUrl} className="w-full h-full bg-white"></iframe>
                    </div>)
                }


            </section>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-slate-800 border border-slate-700/50 p-5 rounded-2xl w-96 max-w-full relative shadow-2xl">
                        <header className='flex justify-between items-center mb-4'>
                            <h2 className='text-lg font-bold text-white'>Add Collaborators</h2>
                            <button onClick={() => setIsModalOpen(false)} className='p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700'>
                                <i className="ri-close-fill"></i>
                            </button>
                        </header>
                        <div className="users-list flex flex-col gap-1 mb-16 max-h-96 overflow-auto">
                            {users.length === 0 && <p className="text-slate-500 text-sm text-center py-4">No other users found. Register another account to test collaboration.</p>}
                            {users.map(user => (
                                <div key={user.id} className={`user cursor-pointer rounded-xl ${Array.from(selectedUserId).indexOf(user._id) != -1 ? 'bg-indigo-600/20 border-indigo-500/30' : 'hover:bg-slate-700/50 border-transparent'} border p-3 flex gap-3 items-center`} onClick={() => handleUserClick(user._id)}>
                                    <div className='aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-indigo-600/20'>
                                        <i className="ri-user-fill absolute text-indigo-400"></i>
                                    </div>
                                    <h1 className='font-medium text-slate-200'>{user.email}</h1>
                                    {Array.from(selectedUserId).indexOf(user._id) != -1 && <i className="ri-check-line text-indigo-400 ml-auto"></i>}
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={addCollaborators}
                            className='absolute bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-500'>
                            Add Collaborators
                        </button>
                    </div>
                </div>
            )}
        </main>
    )
}

export default Project