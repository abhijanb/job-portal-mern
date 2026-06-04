import MDEditor from "@uiw/react-md-editor";

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichEditor({ value, onChange }: RichEditorProps) {
  return (
    <div className="rounded-lg overflow-hidden border border-outline-variant" data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(v) => onChange(v ?? "")}
        preview="live"
        height={500}
      />
    </div>
  );
}
