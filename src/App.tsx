import {
    Fragment,
    useEffect,
    useRef,
    useState,
    type KeyboardEvent,
} from 'react'
import { createClient } from '@supabase/supabase-js'
import './App.css'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

interface Todo {
    id: string
    text: string
    completed: boolean
    parent_id: string | null
    created_at: string
    subtasks?: Todo[]
}

function App() {
    const [todos, setTodos] = useState<Todo[]>([])
    const [images, setImages] = useState<string[]>([])
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [newTodo, setNewTodo] = useState('')
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editingText, setEditingText] = useState('')
    const [addingSubtaskFor, setAddingSubtaskFor] = useState<string | null>(null)
    const [newSubtask, setNewSubtask] = useState('')
    const subtaskInputRef = useRef<HTMLInputElement>(null)
    const pasteCaptureRef = useRef<HTMLTextAreaElement>(null)

    const appendImageBlob = (blob: Blob) => {
        const reader = new FileReader()
        reader.onload = (event) => {
            const result = event.target?.result
            if (typeof result === 'string') {
                setImages((prev) => {
                    const next = [...prev, result]
                    return next
                })
            }
        }
        reader.readAsDataURL(blob)
    }

    const appendImageFile = (file: File) => {
        appendImageBlob(file)
    }

    const handleClipboardFiles = (clipboardData: DataTransfer | null): boolean => {
        if (!clipboardData) {
            return false
        }

        let foundImage = false

        if (clipboardData.items?.length) {
            for (let i = 0; i < clipboardData.items.length; i++) {
                const item = clipboardData.items[i]
                if (item.type.startsWith('image/')) {
                    const file = item.getAsFile()
                    if (file) {
                        appendImageFile(file)
                        foundImage = true
                    }
                }
            }
        }

        if (!foundImage && clipboardData.files?.length) {
            for (let i = 0; i < clipboardData.files.length; i++) {
                const file = clipboardData.files[i]
                if (file.type.startsWith('image/')) {
                    appendImageFile(file)
                    foundImage = true
                }
            }
        }

        return foundImage
    }

    useEffect(() => {
        if (addingSubtaskFor && subtaskInputRef.current) {
            // 等待子任务输入框挂载后再聚焦，避免焦点抖动。
            setTimeout(() => {
                subtaskInputRef.current?.focus()
            }, 0)
        }
    }, [addingSubtaskFor])

    useEffect(() => {
        if (!previewImage) {
            return
        }

        const handleEsc = (event: globalThis.KeyboardEvent) => {
            if (event.key === 'Escape') {
                setPreviewImage(null)
            }
        }

        window.addEventListener('keydown', handleEsc)
        return () => {
            window.removeEventListener('keydown', handleEsc)
        }
    }, [previewImage])

    useEffect(() => {
        fetchTodos()
        const channel = supabase
            .channel('todos')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'todos' }, () => {
                fetchTodos()
            })
            .subscribe()

        const handleGlobalPaste = (event: ClipboardEvent) => {
            if (event.defaultPrevented) {
                return
            }

            const hasImage = handleClipboardFiles(event.clipboardData)
            if (hasImage) {
                event.preventDefault()
                event.stopPropagation()
            }
        }

        const isTextInputTarget = (target: EventTarget | null) => {
            if (!(target instanceof HTMLElement)) {
                return false
            }
            const tagName = target.tagName.toLowerCase()
            return tagName === 'input' || tagName === 'textarea' || target.isContentEditable
        }

        const handleGlobalKeydown = (event: globalThis.KeyboardEvent) => {
            const isPasteShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'v'
            if (!isPasteShortcut) {
                return
            }

            if (!isTextInputTarget(event.target)) {
                pasteCaptureRef.current?.focus()
            }
        }

        document.addEventListener('paste', handleGlobalPaste, true)
        document.addEventListener('keydown', handleGlobalKeydown)

        return () => {
            supabase.removeChannel(channel)
            document.removeEventListener('paste', handleGlobalPaste, true)
            document.removeEventListener('keydown', handleGlobalKeydown)
        }
    }, [])

    const handleEnter = (event: KeyboardEvent<HTMLInputElement>, action: () => void) => {
        if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
            action()
        }
    }

    const buildTodoTree = (flatTodos: Todo[]): Todo[] => {
        const todoMap = new Map<string, Todo>()
        const rootTodos: Todo[] = []

        flatTodos.forEach((todo) => {
            todoMap.set(todo.id, { ...todo, subtasks: [] })
        })

        flatTodos.forEach((todo) => {
            const todoWithSubtasks = todoMap.get(todo.id)!
            if (todo.parent_id) {
                const parent = todoMap.get(todo.parent_id)
                if (parent) {
                    parent.subtasks!.push(todoWithSubtasks)
                }
            } else {
                rootTodos.push(todoWithSubtasks)
            }
        })

        return rootTodos
    }

    const fetchTodos = async () => {
        const { data, error } = await supabase.from('todos').select('*').order('created_at', { ascending: false })
        if (error) {
            console.error(error)
            return
    }
        setTodos(buildTodoTree(data || []))
    }

    const addTodo = async (parentId: string | null = null) => {
        const text = parentId ? newSubtask : newTodo
        if (!text.trim()) {
            return
    }
        const { error } = await supabase.from('todos').insert([{ text, completed: false, parent_id: parentId }])
        if (error) {
            console.error(error)
            return
        }
        if (parentId) {
            setNewSubtask('')
            setAddingSubtaskFor(null)
            return
        }
        setNewTodo('')
    }

  const toggleTodo = async (id: string, completed: boolean) => {
    const { error } = await supabase.from('todos').update({ completed: !completed }).eq('id', id)
    if (error) {
      console.error(error)
    }
  }

    const deleteTodo = async (id: string) => {
        const target = findTodoById(todos, id)
        const idsToDelete = target ? collectTodoIds(target) : [id]
        const { error } = await supabase.from('todos').delete().in('id', idsToDelete)
        if (error) {
            console.error(error)
    }
    }

    const startEdit = (id: string, text: string) => {
        setEditingId(id)
        setEditingText(text)
    }

    const saveEdit = async () => {
        if (!editingId || !editingText.trim()) {
            return
        }
        const { error } = await supabase.from('todos').update({ text: editingText }).eq('id', editingId)
        if (error) {
            console.error(error)
            return
    }
        setEditingId(null)
        setEditingText('')
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditingText('')
    }

    const startAddingSubtask = (parentId: string) => {
        setAddingSubtaskFor(parentId)
        setNewSubtask('')
    }

    const cancelAddingSubtask = () => {
        setAddingSubtaskFor(null)
        setNewSubtask('')
    }

    const findTodoById = (items: Todo[], id: string): Todo | null => {
        for (const item of items) {
            if (item.id === id) {
                return item
            }
            if (item.subtasks?.length) {
                const found = findTodoById(item.subtasks, id)
                if (found) {
                    return found
                }
            }
        }
        return null
    }

    const collectTodoIds = (item: Todo): string[] => {
        const ids = [item.id]
        item.subtasks?.forEach((subtask) => {
            ids.push(...collectTodoIds(subtask))
        })
        return ids
    }

    const renderTodoItem = (todo: Todo, depth = 0) => {
        const isEditing = editingId === todo.id
        const isAddingSubtask = addingSubtaskFor === todo.id

        return (
            <>
                <li className={`todo-item ${todo.completed ? 'completed' : ''}`} style={{ marginLeft: depth * 20 }}>
                    <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id, todo.completed)}
                    />
                    {isEditing ? (
                        <div className="edit-container">
                            <input
                                type="text"
                                value={editingText}
                                onChange={(event) => setEditingText(event.target.value)}
                                onKeyDown={(event) => handleEnter(event, saveEdit)}
                            />
                            <button onClick={saveEdit}>保存</button>
                            <button onClick={cancelEdit}>取消</button>
                        </div>
                    ) : (
                        <span onDoubleClick={() => startEdit(todo.id, todo.text)}>{todo.text}</span>
                    )}
                    <div className="todo-actions">
                        {!isAddingSubtask && (
                            <button onClick={() => startAddingSubtask(todo.id)} className="add-subtask-btn">+ 子任务</button>
                        )}
                        <button onClick={() => deleteTodo(todo.id)}>删除</button>
                    </div>
                </li>
                {isAddingSubtask && (
                    <li className="add-subtask" style={{ marginLeft: (depth + 1) * 20 }}>
                        <input
                            ref={subtaskInputRef}
                            type="text"
                            value={newSubtask}
                            onChange={(event) => setNewSubtask(event.target.value)}
                            placeholder="添加子任务..."
                            onKeyDown={(event) => handleEnter(event, () => addTodo(todo.id))}
                        />
                        <button onClick={() => addTodo(todo.id)}>添加</button>
                        <button onClick={cancelAddingSubtask}>取消</button>
                    </li>
                )}
                {todo.subtasks?.map((subtask) => (
                    <Fragment key={subtask.id}>{renderTodoItem(subtask, depth + 1)}</Fragment>
                ))}
            </>
        )
    }

    return (
        <div className="app">
            <h1>Todo List</h1>
            <div className="add-todo">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(event) => setNewTodo(event.target.value)}
                    placeholder="添加新任务..."
                    onKeyDown={(event) => handleEnter(event, () => addTodo())}
                />
                <button onClick={() => addTodo()}>添加</button>
            </div>
            <textarea
                ref={pasteCaptureRef}
                className="paste-capture-input"
                aria-label="图片粘贴输入框"
            />
            {images.length > 0 && (
                <div className="pasted-images">
                    {images.map((img, idx) => (
                        <div key={idx} className="image-wrapper" onClick={() => setPreviewImage(img)}>
                            <img src={img} alt={`Pasted ${idx}`} />
                            <button
                                onClick={(event) => {
                                    event.stopPropagation()
                                    setImages((prev) => prev.filter((_, i) => i !== idx))
                                }}
                            >
                                删除
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <ul className="todo-list">
                {todos.map((todo) => (
                    <Fragment key={todo.id}>{renderTodoItem(todo)}</Fragment>
                ))}
            </ul>
            {previewImage && (
                <div className="image-preview-overlay" onClick={() => setPreviewImage(null)}>
                    <div className="image-preview-dialog" onClick={(event) => event.stopPropagation()}>
                        <button className="image-preview-close" onClick={() => setPreviewImage(null)}>关闭</button>
                        <img className="image-preview-img" src={previewImage} alt="预览大图" />
                    </div>
                </div>
            )}
        </div>
    )
}

export default App