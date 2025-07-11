import React, { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Button, ButtonGroup } from 'react-bootstrap';

type RichTextEditorProps = {
  existingContent: string;
  onSave: (content: string) => void;
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  existingContent,
  onSave,
}) => {
  const [initialContent, setInitialContent] = useState<object>();

  useEffect(() => {
    if (existingContent) {
      try {
        setInitialContent(JSON.parse(existingContent));
      } catch (error) {
        console.error('Invalid existing content:', error);
      }
    }
  }, [existingContent]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: initialContent ?? '<p>Hello, start typing...</p>',
  });

  const handleSave = () => {
    if (!editor) return;
    const content = editor.getJSON();
    onSave(JSON.stringify(content));
  };

  // Helpers for styling toolbar buttons
  const markActive = (mark: string) =>
    editor?.isActive(mark) ? 'primary' : 'outline-secondary';

  const blockActive = (block: string, attrs = {}) =>
    editor?.isActive(block, attrs) ? 'primary' : 'outline-secondary';

  return (
    <div>
      {editor && (
        <ButtonGroup className="mb-2">
          <Button
            variant={markActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            Bold
          </Button>
          <Button
            variant={markActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            Italic
          </Button>
          <Button
            variant={markActive('underline')}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            Underline
          </Button>
          {/* <Button
            variant={blockActive('paragraph', { textAlign: 'left' })}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
          >
            Left
          </Button>
          <Button
            variant={blockActive('paragraph', { textAlign: 'center' })}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
          >
            Center
          </Button>
          <Button
            variant={blockActive('paragraph', { textAlign: 'right' })}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
          >
            Right
          </Button> */}
          <Button
            variant={blockActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            Bullet List
          </Button>
        </ButtonGroup>
      )}

      <EditorContent editor={editor} className="editor" />

      <Button onClick={handleSave} style={{ marginTop: 10 }}>
        Save
      </Button>
    </div>
  );
};

export default RichTextEditor;
