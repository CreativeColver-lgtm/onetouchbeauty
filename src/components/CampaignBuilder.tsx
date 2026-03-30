"use client";
import { useState } from "react";
import { Eye, Code, Send, Tags } from "lucide-react";

interface CampaignBuilderProps {
  onSave: (data: { subject: string; content: string }) => void;
  initialSubject?: string;
  initialContent?: string;
  businessName?: string;
}

const MERGE_TAGS = [
  { tag: "{{first_name}}", label: "First Name", preview: "Sarah" },
  { tag: "{{full_name}}", label: "Full Name", preview: "Sarah Johnson" },
  { tag: "{{business_name}}", label: "Business Name", preview: "Glow Studio" },
  { tag: "{{email}}", label: "Email", preview: "sarah@example.com" },
  { tag: "{{booking_date}}", label: "Last Booking Date", preview: "15 March 2026" },
  { tag: "{{points_balance}}", label: "Points Balance", preview: "2,450" },
];

export default function CampaignBuilder({
  onSave,
  initialSubject = "",
  initialContent = "",
  businessName = "Your Business",
}: CampaignBuilderProps) {
  const [subject, setSubject] = useState(initialSubject);
  const [content, setContent] = useState(initialContent);
  const [showPreview, setShowPreview] = useState(false);
  const [showTags, setShowTags] = useState(false);

  const insertTag = (tag: string) => {
    setContent((prev) => prev + tag);
    setShowTags(false);
  };

  const getPreviewContent = (text: string) => {
    let preview = text;
    for (const { tag, preview: val } of MERGE_TAGS) {
      preview = preview.replaceAll(tag, val);
    }
    preview = preview.replaceAll("{{business_name}}", businessName);
    return preview;
  };

  return (
    <div className="space-y-4">
      {/* Subject line */}
      <div>
        <label className="text-sm font-semibold text-foreground mb-1.5 block">Subject Line</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. Spring special — 20% off all colour services!"
          className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary transition"
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowTags(!showTags)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
            showTags ? "bg-primary text-white" : "bg-surface border border-border text-foreground hover:border-primary"
          }`}
        >
          <Tags size={14} /> Merge Tags
        </button>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
            showPreview ? "bg-primary text-white" : "bg-surface border border-border text-foreground hover:border-primary"
          }`}
        >
          <Eye size={14} /> {showPreview ? "Edit" : "Preview"}
        </button>
      </div>

      {/* Merge tags panel */}
      {showTags && (
        <div className="flex flex-wrap gap-2 p-3 bg-surface border border-border rounded-xl animate-fade-in">
          {MERGE_TAGS.map((t) => (
            <button
              key={t.tag}
              onClick={() => insertTag(t.tag)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition"
            >
              <Code size={10} /> {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Content editor / preview */}
      {showPreview ? (
        <div className="min-h-[200px] p-5 bg-white dark:bg-surface border border-border rounded-xl">
          <div className="max-w-md mx-auto">
            <p className="text-sm font-semibold text-gray-800 dark:text-foreground mb-2">
              Subject: {getPreviewContent(subject) || "(No subject)"}
            </p>
            <hr className="border-border mb-3" />
            <div
              className="text-sm text-gray-700 dark:text-text-muted leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: getPreviewContent(content).replace(/\n/g, "<br/>") }}
            />
          </div>
        </div>
      ) : (
        <div>
          <label className="text-sm font-semibold text-foreground mb-1.5 block">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            placeholder={`Hi {{first_name}},\n\nWe have an exciting offer just for you at {{business_name}}!\n\n...`}
            className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary transition resize-none font-mono"
          />
        </div>
      )}

      {/* Save */}
      <button
        onClick={() => onSave({ subject, content })}
        disabled={!subject.trim() || !content.trim()}
        className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Send size={16} /> Save Campaign
      </button>
    </div>
  );
}
