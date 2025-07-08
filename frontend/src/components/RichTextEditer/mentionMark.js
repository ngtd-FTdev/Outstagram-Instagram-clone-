import { Mark, markInputRule } from '@tiptap/core'

export const MentionMark = Mark.create({
    name: 'mentionMark',

    addOptions() {
        return {
            HTMLAttributes: {
                class: 'mention',
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'span.mention',
            },
        ]
    },

    // renderHTML({ HTMLAttributes }) {
    //     return ['span', this.options.HTMLAttributes, 0]
    // },

    renderHTML({ HTMLAttributes, mark }) {
        return [
            'span',
            { ...this.options.HTMLAttributes, 'data-id': mark.attrs.id },
            mark.attrs.label || mark.attrs.id,
        ]
    },

    addInputRules() {
        return [
            markInputRule({
                find: /(@[^\s]*)$/,
                type: this.type,
            }),
        ]
    },
})
