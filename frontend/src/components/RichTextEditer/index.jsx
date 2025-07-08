import { useRef, useEffect, useState } from 'react'
import { Schema } from 'prosemirror-model'
import { EditorState, Plugin, PluginKey } from 'prosemirror-state'
import { EditorView, Decoration, DecorationSet } from 'prosemirror-view'
import { keymap } from 'prosemirror-keymap'
import { baseKeymap, splitBlock } from 'prosemirror-commands'
import { schema as basicSchema } from 'prosemirror-schema-basic'

const schema = basicSchema

const mentionPluginKey = new PluginKey('mentionPlugin')
const mentionPlugin = onUpdate =>
    new Plugin({
        key: mentionPluginKey,
        state: {
            init: () => ({ decorations: DecorationSet.empty, active: null }),
            apply(tr, prev) {
                const { doc, selection } = tr
                const decos = []
                let active = null

                doc.descendants((node, pos) => {
                    if (!node.isText) return
                    const text = node.text
                    for (const match of text.matchAll(/@(\w+)/g)) {
                        const start = pos + (match.index || 0)
                        decos.push(
                            Decoration.inline(start, start + match[0].length, {
                                class: 'mention-user',
                            })
                        )
                    }
                    for (const match of text.matchAll(/#(\w+)/g)) {
                        const start = pos + (match.index || 0)
                        decos.push(
                            Decoration.inline(start, start + match[0].length, {
                                class: 'mention-hashtag',
                            })
                        )
                    }
                })

                const { head } = selection
                doc.descendants((node, pos) => {
                    if (!node.isText) return
                    const text = node.text
                    for (const match of text.matchAll(/(@|#)(\w*)/g)) {
                        const start = pos + (match.index || 0)
                        const end = start + match[0].length
                        if (head >= start + 1 && head <= end) {
                            active = {
                                type: match[1] === '@' ? 'user' : 'hashtag',
                                query: match[2],
                                from: start,
                                to: end,
                            }
                        }
                    }
                })

                const newDecos = DecorationSet.create(doc, decos)
                const state = { decorations: newDecos, active }
                if (onUpdate) onUpdate(state)
                return state
            },
        },
        props: {
            decorations(state) {
                return this.getState(state).decorations
            },
        },
    })

export default function CustomRickTextEditor() {
    const editorRef = useRef(null)
    const viewRef = useRef(null)
    const [pluginState, setPluginState] = useState({
        decorations: DecorationSet.empty,
        active: null,
    })
    const [suggestions, setSuggestions] = useState([])

    useEffect(() => {
        const handleUpdate = state => setPluginState(state)

        const state = EditorState.create({
            schema,
            plugins: [
                keymap({ Enter: splitBlock }),
                keymap(baseKeymap),
                mentionPlugin(handleUpdate),
            ],
        })

        const view = new EditorView(editorRef.current, {
            state,
            dispatchTransaction(tr) {
                const newState = view.state.apply(tr)
                view.updateState(newState)
            },
        })
        viewRef.current = view

        return () => view.destroy()
    }, [])

    useEffect(() => {
        const { active } = pluginState
        if (active) {
            const list =
                active.type === 'user'
                    ? ['alice', 'bob', 'carol'].filter(u =>
                          u.startsWith(active.query)
                      )
                    : ['news', 'reactjs', 'prosemirror'].filter(h =>
                          h.startsWith(active.query)
                      )
            setSuggestions(list)
        } else {
            setSuggestions([])
        }
    }, [pluginState.active])

    const choose = item => {
        const view = viewRef.current
        if (!pluginState.active) return
        const { from, to, type } = pluginState.active
        const prefix = type === 'user' ? '@' : '#'
        view.dispatch(view.state.tr.insertText(prefix + item + ' ', from, to))
        view.focus()
    }

    const getCoords = () => {
        const view = viewRef.current
        const { active } = pluginState
        if (!view || !active) return { left: 0, top: 0 }
        return view.coordsAtPos(active.to)
    }

    const coords = getCoords()

    return (
        <div style={{ position: 'relative' }}>
            <div ref={editorRef} className='editor' />

            {pluginState.active && suggestions.length > 0 && (
                <ul
                    className='popup'
                    style={{
                        position: 'absolute',
                        left: coords.left,
                        top: coords.top,
                        listStyle: 'none',
                        padding: '0.5em',
                        margin: 0,
                        background: '#fff',
                        border: '1px solid #ccc',
                    }}
                >
                    {suggestions.map(item => (
                        <li
                            key={item}
                            onClick={() => choose(item)}
                            style={{ padding: '0.25em', cursor: 'pointer' }}
                        >
                            {pluginState.active.type === 'user'
                                ? '@' + item
                                : '#' + item}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
