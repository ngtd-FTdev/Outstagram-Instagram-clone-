import { baseKeymap, splitBlock } from 'prosemirror-commands'
import { history, redo, undo } from 'prosemirror-history'
import { keymap } from 'prosemirror-keymap'
import { Schema } from 'prosemirror-model'
import { schema as basicSchema } from 'prosemirror-schema-basic'
import { EditorState, Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view'
import { useEffect, useRef, useState } from 'react'

const mentionPluginKey = new PluginKey('mentionPlugin')
const createMentionPlugin = onUpdate =>
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
                    for (const match of text.matchAll(/@([\p{L}\p{N}_]+)/gu)) {
                        const start = pos + (match.index || 0)
                        decos.push(
                            Decoration.inline(start, start + match[0].length, {
                                class: 'mention-user',
                            })
                        )
                    }
                    for (const match of text.matchAll(/#([\p{L}\p{N}_]+)/gu)) {
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
                    for (const match of text.matchAll(
                        /(@|#)([\p{L}\p{N}_]*)/gu
                    )) {
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

const limitPlugin = maxLength => {
    return new Plugin({
        filterTransaction(tr, state) {
            if (!tr.docChanged) return true

            if (tr.getMeta('addToHistory') === false) return true

            const newText = tr.doc.textBetween(
                0,
                tr.doc.content.size,
                '\n',
                '\n'
            )

            return newText.length <= maxLength
        },
    })
}

export default function useProseMirrorMentionEditor(
    { maxLength = 300 } = {},
    textDefault = ''
) {
    const editorRef = useRef(null)
    const viewRef = useRef(null)
    const [pluginState, setPluginState] = useState({
        decorations: DecorationSet.empty,
        active: null,
    })
    const [suggestions, setSuggestions] = useState([])
    const [jsonValue, setJsonValue] = useState({})
    const [textValue, setTextValue] = useState(textDefault)
    const [textLength, setTextLength] = useState(textDefault.length)

    const nodes = textDefault.split('\n').map(line => {
        const textNode = line ? basicSchema.text(line) : null

        return basicSchema.node('paragraph', null, textNode ? [textNode] : [])
    })

    const doc = basicSchema.node('doc', null, nodes)

    useEffect(() => {
        const view = new EditorView(editorRef.current, {
            state: EditorState.create({
                schema: basicSchema,
                doc,
                plugins: [
                    keymap({ Enter: splitBlock }),
                    keymap(baseKeymap),
                    history(),
                    createMentionPlugin(setPluginState),
                    limitPlugin(maxLength),
                    keymap({
                        'Mod-z': undo,
                        'Mod-y': redo,
                        'Mod-Shift-z': redo,
                    }),
                ],
            }),
            dispatchTransaction(tr) {
                const newState = view.state.apply(tr)
                view.updateState(newState)

                const doc = newState.doc
                setJsonValue(doc.toJSON())
                const text = doc.textBetween(0, doc.content.size, '\n', '\n')
                setTextValue(text)
                setTextLength(text.length)
            },
        })
        viewRef.current = view
        return () => view.destroy()
    }, [maxLength])

    useEffect(() => {
        const { active } = pluginState
        if (active) {
            const data =
                active.type === 'user'
                    ? ['alice', 'bob', 'carol']
                    : ['news', 'reactjs', 'prosemirror']
            setSuggestions(data.filter(x => x.startsWith(active.query)))
        } else {
            setSuggestions([])
        }
    }, [pluginState.active])

    const choose = item => {
        const view = viewRef.current
        if (!pluginState.active || !view) return
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

    const insertText = content => {
        const view = viewRef.current
        if (!view) return
        const { from, to } = view.state.selection
        view.dispatch(view.state.tr.insertText(content, from, to))
        view.focus()
    }

    return {
        editorRef,
        suggestions,
        activeMention: pluginState.active,
        coords: getCoords(),
        insertText,
        choose,
        jsonValue,
        textValue,
        textLength,
    }
}
