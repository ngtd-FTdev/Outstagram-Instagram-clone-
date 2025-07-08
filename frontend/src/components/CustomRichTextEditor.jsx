import React from 'react';
import { createRoot } from 'react-dom/client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Mention from '@tiptap/extension-mention';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { motion } from 'framer-motion';

const users = [
  { id: '1', label: 'alice' },
  { id: '2', label: 'bob' },
  { id: '3', label: 'charlie' },
];
const hashtags = [
  { id: '1', label: 'react' },
  { id: '2', label: 'javascript' },
  { id: '3', label: 'webdev' },
];

const UserMention = Mention.extend({
  name: 'userMention',
}).configure({
  HTMLAttributes: { class: 'px-1 py-0.5 rounded bg-blue-100 text-blue-800 is-link' },
  pluginKey: 'mention-user',
  ...{
    char: '@',
    startOfLine: false,
    allowSpaces: false,
    render: () => {
      let component;
      let popup;
      let root;
      return {
        onStart: props => {
          component = document.createElement('div');
          popup = tippy('body', {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: component,
            showOnCreate: true,
            interactive: true,
          });
          root = createRoot(component);
          root.render(
            <motion.div
              initial={{ opacity: 0, translateY: -5 }}
              animate={{ opacity: 1, translateY: 0 }}
              className="bg-white border rounded shadow-lg"
            >
              {props.items().map(item => (
                <div
                  key={item.id}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => props.command({ id: item.id, label: item.label })}
                >
                  {item.label}
                </div>
              ))}
            </motion.div>
          );
        },
        onUpdate: props => {
          popup[0].setProps({ content: component, getReferenceClientRect: props.clientRect });
        },
        onKeyDown: props => {
          if (props.event.key === 'Escape') {
            popup[0].destroy();
            if (root) root.unmount();
            return true;
          }
          return false;
        },
        onExit: () => {
          popup[0].destroy();
          if (root) root.unmount();
        },
      };
    },
    items: query => users.filter(item => item.label.toLowerCase().startsWith(query.toLowerCase())).slice(0, 5),
  },
});

const HashtagMention = Mention.extend({
  name: 'hashtagMention',
}).configure({
  HTMLAttributes: { class: 'px-1 py-0.5 rounded bg-green-100 text-green-800 is-link' },
  pluginKey: 'mention-hashtag',
  ...{
    char: '#',
    startOfLine: false,
    allowSpaces: false,
    render: () => {
      let component;
      let popup;
      let root;
      return {
        onStart: props => {
          component = document.createElement('div');
          popup = tippy('body', {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: component,
            showOnCreate: true,
            interactive: true,
          });
          root = createRoot(component);
          root.render(
            <motion.div
              initial={{ opacity: 0, translateY: -5 }}
              animate={{ opacity: 1, translateY: 0 }}
              className="bg-white border rounded shadow-lg"
            >
              {props.items().map(item => (
                <div
                  key={item.id}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => props.command({ id: item.id, label: item.label })}
                >
                  {item.label}
                </div>
              ))}
            </motion.div>
          );
        },
        onUpdate: props => {
          popup[0].setProps({ content: component, getReferenceClientRect: props.clientRect });
        },
        onKeyDown: props => {
          if (props.event.key === 'Escape') {
            popup[0].destroy();
            if (root) root.unmount();
            return true;
          }
          return false;
        },
        onExit: () => {
          popup[0].destroy();
          if (root) root.unmount();
        },
      };
    },
    items: query => hashtags.filter(item => item.label.toLowerCase().startsWith(query.toLowerCase())).slice(0, 5),
  },
});

const CustomRichTextEditor = () => {
  const editor = useEditor({
    extensions: [StarterKit, UserMention, HashtagMention],
    content: '',
  });

  return (
    <div className="border p-4 rounded shadow-sm">
      <EditorContent editor={editor} className="prose prose-sm" />
    </div>
  );
};


export default CustomRichTextEditor;