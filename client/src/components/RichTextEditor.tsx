import React, { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import HardBreak from '@tiptap/extension-hard-break';
import { Button, ButtonGroup } from 'react-bootstrap';

type PreviewConfig = {
  maxLength: number;
};

type RichTextEditorProps = {
  existingContent: string;
  disabled: boolean;
  onSave: (content: string) => void;
  height?: string;
  saveDebounce?: number;
  previewConfig?: PreviewConfig;
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  existingContent,
  disabled,
  onSave,
  height,
  saveDebounce,
  previewConfig,
}) => {
  const [isSaved, setIsSaved] = useState<boolean>(true);

  const parseExistingContent = (content: string) => {
    if (existingContent) {
      try {
        return JSON.parse(content);
      } catch (error) {
        console.error('Invalid existing content:', error);
        return '';
      }
    }
  };

  const formatPreview = (content: string, maxLength: number) => {
    let preview = '';
    if (content) {
      const ellipsis = content.length > maxLength;
      preview = ellipsis ? `${content.slice(0, maxLength)}...` : content;
    }

    return preview;
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        hardBreak: false,
      }),
      HardBreak.configure({
        keepMarks: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
    ],
    content: parseExistingContent(existingContent) ?? '<p></p>',
  });

  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleSave = () => {
    if (!editor) return;
    const content = editor.getJSON();
    onSave(JSON.stringify(content));
  };

  useEffect(() => {
    if (!editor || !saveDebounce) return;

    const updateHandler = () => {
      // Clear existing timeout before setting a new one
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new debounce timeout
      setIsSaved(false);
      timeoutRef.current = setTimeout(() => {
        const content = editor.getJSON();
        onSave(JSON.stringify(content));
        setIsSaved(true);
      }, saveDebounce);
    };

    // Register event listener
    editor.on('update', updateHandler);

    // Cleanup on unmount or editor change
    return () => {
      editor.off('update', updateHandler);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsSaved(true);
    };
  }, [editor, onSave, saveDebounce]);

  const markActive = (mark: string) =>
    editor?.isActive(mark) ? 'light' : 'outline-light';

  const blockActive = (block: string, attrs = {}) =>
    editor?.isActive(block, attrs) ? 'light' : 'outline-light';

  useEffect(() => {
    if (editor && existingContent) {
      try {
        const parsed = JSON.parse(existingContent);
        editor.commands.setContent(parsed);
      } catch (error) {
        console.error('Invalid JSON for existingContent', error);
      }
    }
  }, [existingContent, editor]);

  if (previewConfig && editor) {
    return (
      <div>{formatPreview(editor.getText(), previewConfig.maxLength)}</div>
    );
  }

  return (
    <div>
      {editor && (
        <>
          <ButtonGroup className="mb-2">
            <Button
              active
              variant={markActive('bold')}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <i className="bi bi-type-bold"></i>
            </Button>
            <Button
              active
              variant={markActive('italic')}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <i className="bi bi-type-italic"></i>
            </Button>
            <Button
              active
              variant={markActive('underline')}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <i className="bi bi-type-underline"></i>
            </Button>
            <Button
              active
              variant={blockActive('bulletList')}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <i className="bi bi-list-ul"></i>
            </Button>
            <Button
              active
              variant={blockActive('heading', { level: 1 })}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
            >
              <i className="bi bi-type-h1"></i>
            </Button>
            <Button
              active
              variant={blockActive('heading', { level: 2 })}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
            >
              <i className="bi bi-type-h2"></i>
            </Button>
            <Button
              active
              variant={blockActive('heading', { level: 3 })}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
            >
              <i className="bi bi-type-h3"></i>
            </Button>
          </ButtonGroup>

          <EditorContent
            editor={editor}
            className="editor"
            // @ts-ignore
            style={{ '--editor-height': height ?? '75vh' }}
          />

          {!saveDebounce ? (
            <Button
              onClick={handleSave}
              style={{ marginTop: 10 }}
              disabled={disabled}
            >
              Save
            </Button>
          ) : (
            <span
              style={{ float: 'right', fontSize: '14px', marginRight: '2px' }}
            >
              <i>{isSaved ? 'Saved' : 'Saving...'}</i>
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default RichTextEditor;
