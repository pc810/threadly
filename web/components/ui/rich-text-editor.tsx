"use client";

import { useEditor, EditorContent, Content } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Toggle } from "@/components/ui/toggle";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  LinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import clsx from "clsx";

export type EditorContentFormats = {
  json: string;
  html: string;
  text: string;
};

type RichTextEditorProps = {
  value?: string;
  onChange?: (content: EditorContentFormats) => void;
  placeholder?: string;
  className?: string;
};

type RichTextExtensionsProps = {
  placeholder: string;
};

const richTextExtensions = (props: Partial<RichTextExtensionsProps>) => [
  StarterKit.configure({
    bulletList: { keepMarks: true },
    orderedList: { keepMarks: true },
  }),
  Link.configure({
    openOnClick: false,
  }),
  Placeholder.configure({
    placeholder: props?.placeholder,
  }),
];

const editorProps = {
  attributes: {
    class: "prose prose-sm dark:prose-invert focus:outline-none",
  },
};

export function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Write something...",
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: richTextExtensions({ placeholder }),
    // content: value,
    content: (() => {
      try {
        // Detect if value is JSON and parse it
        const parsed = JSON.parse(value);
        if (parsed && parsed.type === "doc") {
          return parsed;
        }
      } catch {
        // Fallback to HTML
      }
      return value; // fallback if not JSON
    })(),
    editorProps: {
      attributes: {
        class: clsx(editorProps.attributes.class, "min-h-[150px]"),
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const json = JSON.stringify(editor.getJSON());
      const text = editor.getText();

      onChange?.({ json, html, text });
    },
  });

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter the link URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className={cn("border rounded-md", className)}>
      <div className="flex flex-wrap items-center gap-1 border-b p-2 bg-muted/40">
        <Toggle
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("strike")}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </Toggle>
        <Separator orientation="vertical" className="mx-2 h-5" />
        <Toggle
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() =>
            editor.chain().focus().toggleBulletList().run()
          }
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Separator orientation="vertical" className="mx-2 h-5" />
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={setLink}
          className="p-1"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-2">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export const RichTextContent = ({ value }: { value: Content }) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: richTextExtensions({ placeholder: "" }),
    // content: value,
    content: value,
    editorProps: editorProps,
    editable: false,
  });

  return <EditorContent editor={editor} contentEditable={false} />;
};
