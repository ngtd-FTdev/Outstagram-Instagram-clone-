import { Mark, markInputRule } from '@tiptap/core'

export const HashtagMark = Mark.create({
    name: 'hashtagMark',

    addOptions() {
        return {
            HTMLAttributes: {
                class: 'hashtag',
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'span.hashtag',
            },
        ]
    },

    //   renderHTML({ HTMLAttributes }) {
    //     return ['span', this.options.HTMLAttributes, 0]
    //   },

    renderHTML({ HTMLAttributes, mark }) {
        return [
            'span',
            { ...this.options.HTMLAttributes, 'data-id': mark.attrs.id },
            mark.attrs.label || mark.attrs.id, // Hiển thị nội dung
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
