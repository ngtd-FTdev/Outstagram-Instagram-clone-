import { ReactRenderer } from '@tiptap/react'
import tippy from 'tippy.js'
import { MentionList } from './MentionList'
import { PluginKey } from 'prosemirror-state'

export default {
    char: '@',
    pluginKey: new PluginKey('suggestion1'),
    items: ({ query }) => {
        return ['Lea Thompson', 'Cyndi Lauper']
            .filter(item => item.toLowerCase().startsWith(query.toLowerCase()))
            .slice(0, 5)
    },

    render: () => {
        let reactRenderer
        let popup

        const dialog = document.getElementById('Dialog-CreatePost')

        return {
            onStart: props => {
                reactRenderer = new ReactRenderer(MentionList, {
                    props,
                    editor: props.editor,
                })

                popup = tippy('body', {
                    getReferenceClientRect: props.clientRect,
                    appendTo: dialog,
                    content: reactRenderer.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual',
                    placement: 'bottom-start',
                })
            },

            onUpdate(props) {
                reactRenderer.updateProps(props)

                popup[0].setProps({
                    getReferenceClientRect: props.clientRect,
                })
            },

            onKeyDown(props) {
                if (props.event.key === 'Escape') {
                    popup[0].hide()

                    return true
                }

                return reactRenderer.ref?.onKeyDown(props)
            },

            onExit() {
                popup[0].destroy()
                reactRenderer.destroy()
            },
        }
    },
}
