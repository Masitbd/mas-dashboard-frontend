'use client';

import { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  Image as ImageIcon,
  Link as LinkIcon
} from 'lucide-react';
import { Button } from 'rsuite';

const extensions = [StarterKit, Underline, Image, Link.configure({ openOnClick: false })];

export function PostEditor({
  content,
  onChange
}: {
  content: string;
  onChange: (value: string) => void;
}) {
  const editor = useEditor({
    extensions,
    content,
    editorProps: {
      attributes: {
        class: 'prose-content min-h-[240px] focus:outline-none'
      }
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      window.localStorage.setItem('draft-content', html);
    }
  });

  useEffect(() => {
    const saved = window.localStorage.getItem('draft-content');
    if (saved && editor) {
      editor.commands.setContent(saved);
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" aria-label="Bold" onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={14} />
        </Button>
        <Button size="sm" aria-label="Italic" onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={14} />
        </Button>
        <Button
          size="sm"
          aria-label="Underline"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon size={14} />
        </Button>
        <Button
          size="sm"
          aria-label="Strikethrough"
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough size={14} />
        </Button>
        <Button
          size="sm"
          aria-label="Bullet list"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={14} />
        </Button>
        <Button
          size="sm"
          aria-label="Ordered list"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={14} />
        </Button>
        <Button
          size="sm"
          aria-label="Blockquote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={14} />
        </Button>
        <Button
          size="sm"
          aria-label="Code block"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code size={14} />
        </Button>
        <Button
          size="sm"
          aria-label="Horizontal rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus size={14} />
        </Button>
        <Button
          size="sm"
          aria-label="Insert image"
          onClick={() => {
            const url = window.prompt('Image URL');
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
        >
          <ImageIcon size={14} />
        </Button>
        <Button
          size="sm"
          aria-label="Insert link"
          onClick={() => {
            const url = window.prompt('Link URL');
            if (url) {
              editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
            }
          }}
        >
          <LinkIcon size={14} />
        </Button>
      </div>
      <div className="rounded-xl border border-border bg-card p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
