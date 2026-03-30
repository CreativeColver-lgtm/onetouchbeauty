"use client";
import { useState } from "react";
import {
  Plus, X, Eye, Edit2, ClipboardList, GripVertical,
  ToggleLeft, ToggleRight, Trash2, ChevronDown, ChevronUp,
  FileText, MessageSquare, CheckSquare, CircleDot,
  Calendar as CalendarIcon, PenTool, Type, Save,
} from "lucide-react";
import ConsultationForm from "@/components/ConsultationForm";
import type { ConsultationFormField } from "@/types/database";

interface FormDefinition {
  id: string;
  name: string;
  description: string;
  fields: ConsultationFormField[];
  isRequiredBeforeBooking: boolean;
  serviceIds: string[];
  isActive: boolean;
  responseCount: number;
}

interface FormResponse {
  id: string;
  clientName: string;
  date: string;
  data: Record<string, unknown>;
}

const FIELD_TYPES: { type: ConsultationFormField["type"]; label: string; icon: typeof Type }[] = [
  { type: "text", label: "Text Input", icon: Type },
  { type: "textarea", label: "Text Area", icon: MessageSquare },
  { type: "checkbox", label: "Checkbox", icon: CheckSquare },
  { type: "radio", label: "Radio Options", icon: CircleDot },
  { type: "date", label: "Date Picker", icon: CalendarIcon },
  { type: "signature", label: "Signature", icon: PenTool },
];

const SERVICES = [
  { id: "s1", name: "Haircut & Blow Dry" },
  { id: "s2", name: "Balayage" },
  { id: "s3", name: "Hair Colour" },
  { id: "s4", name: "Olaplex Treatment" },
  { id: "s5", name: "Bridal Hair" },
  { id: "s6", name: "Extensions" },
];

const mockForms: FormDefinition[] = [
  {
    id: "1",
    name: "Colour Consultation",
    description: "Complete before any colour service",
    fields: [
      { id: "f1", label: "Have you coloured your hair in the last 6 months?", type: "radio", required: true, options: ["Yes", "No"] },
      { id: "f2", label: "Any allergies to hair products?", type: "textarea", required: true, placeholder: "List any known allergies..." },
      { id: "f3", label: "Desired result", type: "textarea", required: false, placeholder: "Describe what you'd like..." },
      { id: "f4", label: "Patch test date", type: "date", required: true },
      { id: "f5", label: "I consent to the patch test results", type: "checkbox", required: true },
      { id: "f6", label: "Client Signature", type: "signature", required: true },
    ],
    isRequiredBeforeBooking: true,
    serviceIds: ["s2", "s3"],
    isActive: true,
    responseCount: 42,
  },
  {
    id: "2",
    name: "Bridal Consultation",
    description: "Initial consultation for bridal packages",
    fields: [
      { id: "f7", label: "Wedding date", type: "date", required: true },
      { id: "f8", label: "Wedding venue", type: "text", required: false, placeholder: "Venue name and location" },
      { id: "f9", label: "Number in bridal party", type: "text", required: false, placeholder: "e.g. 4 bridesmaids" },
      { id: "f10", label: "Preferred style", type: "radio", required: true, options: ["Classic Updo", "Half Up Half Down", "Loose Waves", "Braided", "Other"] },
      { id: "f11", label: "Hair accessories?", type: "radio", required: false, options: ["Veil", "Tiara", "Flowers", "Pins", "None"] },
      { id: "f12", label: "Additional notes", type: "textarea", required: false, placeholder: "Anything else we should know..." },
    ],
    isRequiredBeforeBooking: false,
    serviceIds: ["s5"],
    isActive: true,
    responseCount: 8,
  },
];

const mockResponses: Record<string, FormResponse[]> = {
  "1": [
    { id: "r1", clientName: "Emma Wilson", date: "2026-03-28", data: { f1: "Yes", f2: "None", f3: "Warm balayage tones", f4: "2026-03-27", f5: true } },
    { id: "r2", clientName: "Sarah Chen", date: "2026-03-20", data: { f1: "No", f2: "Allergic to PPD", f3: "Natural highlights", f4: "2026-03-19", f5: true } },
  ],
  "2": [
    { id: "r3", clientName: "Jade Thompson", date: "2026-03-29", data: { f7: "2026-08-15", f8: "The Savoy, London", f9: "4 bridesmaids", f10: "Classic Updo", f11: "Tiara" } },
  ],
};

export default function ConsultationFormsPage() {
  const [forms, setForms] = useState<FormDefinition[]>(mockForms);
  const [showEditor, setShowEditor] = useState(false);
  const [editingForm, setEditingForm] = useState<FormDefinition | null>(null);
  const [previewForm, setPreviewForm] = useState<FormDefinition | null>(null);
  const [viewingResponses, setViewingResponses] = useState<string | null>(null);
  const [expandedForm, setExpandedForm] = useState<string | null>(null);

  // Editor state
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formFields, setFormFields] = useState<ConsultationFormField[]>([]);
  const [isRequired, setIsRequired] = useState(false);
  const [assignedServices, setAssignedServices] = useState<string[]>([]);
  const [newFieldType, setNewFieldType] = useState<ConsultationFormField["type"]>("text");
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [newFieldOptions, setNewFieldOptions] = useState("");

  const openAddForm = () => {
    setEditingForm(null);
    setFormName("");
    setFormDescription("");
    setFormFields([]);
    setIsRequired(false);
    setAssignedServices([]);
    setShowEditor(true);
  };

  const openEditForm = (f: FormDefinition) => {
    setEditingForm(f);
    setFormName(f.name);
    setFormDescription(f.description);
    setFormFields([...f.fields]);
    setIsRequired(f.isRequiredBeforeBooking);
    setAssignedServices([...f.serviceIds]);
    setShowEditor(true);
  };

  const addField = () => {
    if (!newFieldLabel.trim()) return;
    const field: ConsultationFormField = {
      id: `f-${Date.now()}`,
      label: newFieldLabel.trim(),
      type: newFieldType,
      required: newFieldRequired,
      ...(newFieldType === "radio" && newFieldOptions
        ? { options: newFieldOptions.split(",").map((o) => o.trim()).filter(Boolean) }
        : {}),
      ...(newFieldType === "text" || newFieldType === "textarea" ? { placeholder: "" } : {}),
    };
    setFormFields((prev) => [...prev, field]);
    setNewFieldLabel("");
    setNewFieldOptions("");
    setNewFieldRequired(false);
  };

  const removeField = (fieldId: string) => {
    setFormFields((prev) => prev.filter((f) => f.id !== fieldId));
  };

  const moveField = (index: number, direction: "up" | "down") => {
    const newFields = [...formFields];
    const swapIdx = direction === "up" ? index - 1 : index + 1;
    if (swapIdx < 0 || swapIdx >= newFields.length) return;
    [newFields[index], newFields[swapIdx]] = [newFields[swapIdx], newFields[index]];
    setFormFields(newFields);
  };

  const saveForm = () => {
    if (!formName.trim() || formFields.length === 0) return;
    const form: FormDefinition = {
      id: editingForm?.id || Date.now().toString(),
      name: formName,
      description: formDescription,
      fields: formFields,
      isRequiredBeforeBooking: isRequired,
      serviceIds: assignedServices,
      isActive: editingForm?.isActive ?? true,
      responseCount: editingForm?.responseCount ?? 0,
    };
    if (editingForm) {
      setForms((prev) => prev.map((f) => f.id === editingForm.id ? form : f));
    } else {
      setForms((prev) => [...prev, form]);
    }
    setShowEditor(false);
  };

  const toggleService = (serviceId: string) => {
    setAssignedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((s) => s !== serviceId) : [...prev, serviceId]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Consultation Forms</h1>
          <p className="text-text-muted text-sm">{forms.length} forms · {forms.reduce((s, f) => s + f.responseCount, 0)} total responses</p>
        </div>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition"
        >
          <Plus size={16} /> Create Form
        </button>
      </div>

      {/* Forms list */}
      <div className="space-y-4">
        {forms.map((f) => (
          <div key={f.id} className="bg-surface-elevated border border-border rounded-2xl overflow-hidden">
            <div
              className="p-5 cursor-pointer hover:bg-surface/30 transition"
              onClick={() => setExpandedForm(expandedForm === f.id ? null : f.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <ClipboardList size={18} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{f.name}</h3>
                    <p className="text-xs text-text-muted mt-0.5">{f.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-text-muted">{f.fields.length} fields</span>
                      <span className="text-xs text-text-muted">·</span>
                      <span className="text-xs text-text-muted">{f.responseCount} responses</span>
                      {f.isRequiredBeforeBooking && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300 font-medium">
                          Required before booking
                        </span>
                      )}
                      {!f.isActive && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 font-medium">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); setPreviewForm(f); }}
                    className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition"
                    title="Preview"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); openEditForm(f); }}
                    className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition"
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setForms((prev) => prev.map((fm) => fm.id === f.id ? { ...fm, isActive: !fm.isActive } : fm));
                    }}
                    title={f.isActive ? "Deactivate" : "Activate"}
                  >
                    {f.isActive ? <ToggleRight size={20} className="text-accent" /> : <ToggleLeft size={20} className="text-text-muted" />}
                  </button>
                  {expandedForm === f.id ? <ChevronUp size={14} className="text-text-muted ml-1" /> : <ChevronDown size={14} className="text-text-muted ml-1" />}
                </div>
              </div>
            </div>

            {/* Expanded: fields + assigned services */}
            {expandedForm === f.id && (
              <div className="border-t border-border p-5 bg-surface/30">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Fields */}
                  <div>
                    <h4 className="text-xs font-semibold text-text-muted mb-2">Fields</h4>
                    <div className="space-y-1.5">
                      {f.fields.map((field, i) => (
                        <div key={field.id} className="flex items-center gap-2 p-2 bg-surface-elevated rounded-lg">
                          <span className="text-[10px] text-text-muted w-4">{i + 1}</span>
                          <span className="text-xs font-medium text-foreground flex-1">{field.label}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-border text-text-muted capitalize">{field.type}</span>
                          {field.required && (
                            <span className="text-[10px] text-red-500">*</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Responses + services */}
                  <div>
                    <h4 className="text-xs font-semibold text-text-muted mb-2">Assigned Services</h4>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {f.serviceIds.map((sid) => {
                        const svc = SERVICES.find((s) => s.id === sid);
                        return svc ? (
                          <span key={sid} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{svc.name}</span>
                        ) : null;
                      })}
                      {f.serviceIds.length === 0 && <span className="text-xs text-text-muted italic">All services</span>}
                    </div>

                    <button
                      onClick={() => setViewingResponses(viewingResponses === f.id ? null : f.id)}
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                      <FileText size={12} /> View Responses ({f.responseCount})
                    </button>

                    {viewingResponses === f.id && mockResponses[f.id] && (
                      <div className="mt-3 space-y-2">
                        {mockResponses[f.id].map((r) => (
                          <div key={r.id} className="p-3 bg-surface-elevated rounded-lg">
                            <div className="flex justify-between mb-1">
                              <span className="text-xs font-semibold text-foreground">{r.clientName}</span>
                              <span className="text-[10px] text-text-muted">{r.date}</span>
                            </div>
                            <div className="space-y-0.5">
                              {Object.entries(r.data).map(([key, val]) => {
                                const field = f.fields.find((fl) => fl.id === key);
                                return field ? (
                                  <p key={key} className="text-[11px] text-text-muted">
                                    <strong className="text-foreground">{field.label}:</strong> {String(val)}
                                  </p>
                                ) : null;
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {forms.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          <ClipboardList size={48} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No consultation forms</p>
          <p className="text-sm">Create your first form to collect client information</p>
        </div>
      )}

      {/* Preview Modal */}
      {previewForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setPreviewForm(null)} />
          <div className="relative bg-surface-elevated border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl mb-8">
            <button
              onClick={() => setPreviewForm(null)}
              className="absolute top-4 right-4 p-1.5 hover:bg-surface rounded-lg transition"
            >
              <X size={18} className="text-text-muted" />
            </button>
            <div className="mb-4">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Preview Mode</span>
            </div>
            <ConsultationForm
              fields={previewForm.fields}
              onSubmit={() => setPreviewForm(null)}
              title={previewForm.name}
              description={previewForm.description}
            />
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowEditor(false)} />
          <div className="relative bg-surface-elevated border border-border rounded-2xl p-6 w-full max-w-2xl shadow-2xl mb-8">
            <button
              onClick={() => setShowEditor(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-surface rounded-lg transition"
            >
              <X size={18} className="text-text-muted" />
            </button>

            <h2 className="text-lg font-bold text-foreground mb-5">
              {editingForm ? "Edit Form" : "Create Consultation Form"}
            </h2>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {/* Form basics */}
              <div>
                <label className="text-xs font-semibold text-text-muted mb-1 block">Form Name *</label>
                <input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                  placeholder="e.g. Colour Consultation"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted mb-1 block">Description</label>
                <input
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                  placeholder="Short description..."
                />
              </div>

              {/* Required toggle */}
              <div className="flex items-center justify-between p-3 bg-surface rounded-xl">
                <div>
                  <span className="text-sm font-semibold text-foreground">Required before booking</span>
                  <p className="text-xs text-text-muted">Clients must complete this form before confirming</p>
                </div>
                <button onClick={() => setIsRequired(!isRequired)}>
                  {isRequired ? <ToggleRight size={24} className="text-accent" /> : <ToggleLeft size={24} className="text-text-muted" />}
                </button>
              </div>

              {/* Assign to services */}
              <div>
                <label className="text-xs font-semibold text-text-muted mb-2 block">Assign to Services</label>
                <div className="flex flex-wrap gap-2">
                  {SERVICES.map((svc) => (
                    <button
                      key={svc.id}
                      onClick={() => toggleService(svc.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        assignedServices.includes(svc.id)
                          ? "bg-primary/10 text-primary border border-primary/30"
                          : "bg-surface border border-border text-text-muted hover:border-primary/30"
                      }`}
                    >
                      {svc.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Existing fields */}
              <div>
                <label className="text-xs font-semibold text-text-muted mb-2 block">
                  Fields ({formFields.length})
                </label>
                <div className="space-y-2">
                  {formFields.map((field, i) => (
                    <div key={field.id} className="flex items-center gap-2 p-2.5 bg-surface rounded-xl border border-border">
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => moveField(i, "up")}
                          disabled={i === 0}
                          className="p-0.5 text-text-muted hover:text-foreground disabled:opacity-20"
                        >
                          <ChevronUp size={10} />
                        </button>
                        <button
                          onClick={() => moveField(i, "down")}
                          disabled={i === formFields.length - 1}
                          className="p-0.5 text-text-muted hover:text-foreground disabled:opacity-20"
                        >
                          <ChevronDown size={10} />
                        </button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{field.label}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-elevated text-text-muted capitalize">{field.type}</span>
                          {field.required && <span className="text-[10px] text-red-500">Required</span>}
                          {field.options && <span className="text-[10px] text-text-muted">{field.options.length} options</span>}
                        </div>
                      </div>
                      <button
                        onClick={() => removeField(field.id)}
                        className="p-1 text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add new field */}
              <div className="p-4 bg-surface rounded-xl border border-dashed border-border">
                <h4 className="text-xs font-semibold text-foreground mb-3">Add Field</h4>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mb-3">
                  {FIELD_TYPES.map((ft) => (
                    <button
                      key={ft.type}
                      onClick={() => setNewFieldType(ft.type)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg text-[10px] font-medium transition ${
                        newFieldType === ft.type ? "bg-primary/10 text-primary border border-primary/30" : "bg-surface-elevated text-text-muted hover:text-foreground"
                      }`}
                    >
                      <ft.icon size={14} />
                      {ft.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <input
                    value={newFieldLabel}
                    onChange={(e) => setNewFieldLabel(e.target.value)}
                    placeholder="Field label..."
                    className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                  />

                  {newFieldType === "radio" && (
                    <input
                      value={newFieldOptions}
                      onChange={(e) => setNewFieldOptions(e.target.value)}
                      placeholder="Options (comma separated): Option A, Option B, Option C"
                      className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                  )}

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs text-text-muted cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newFieldRequired}
                        onChange={(e) => setNewFieldRequired(e.target.checked)}
                        className="w-3.5 h-3.5 accent-primary rounded"
                      />
                      Required field
                    </label>
                    <button
                      onClick={addField}
                      disabled={!newFieldLabel.trim()}
                      className="px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-dark transition disabled:opacity-40"
                    >
                      <Plus size={12} className="inline mr-1" />
                      Add Field
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-5 pt-4 border-t border-border">
              <button
                onClick={() => setShowEditor(false)}
                className="flex-1 py-2.5 bg-surface border border-border text-foreground font-semibold rounded-xl hover:bg-surface/80 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveForm}
                disabled={!formName.trim() || formFields.length === 0}
                className="flex-1 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition disabled:opacity-40 flex items-center justify-center gap-2"
              >
                <Save size={14} /> {editingForm ? "Save Changes" : "Create Form"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
