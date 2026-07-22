import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiBookOpen, FiEdit2, FiFileText, FiLink, FiPaperclip, FiPlus, FiSearch, FiTrash2, FiX } from 'react-icons/fi';
import { getErrorMessage } from '../lib/axios';
import { noteService } from '../services/api';
import { CreateNoteInput, Note, NoteType } from '../types';
import Button from '../components/Button';
import GlassPanel from '../components/GlassPanel';

interface NoteFormState extends CreateNoteInput {
  category: string;
  important: boolean;
  emoji: string;
  attachmentType: string;
  attachmentLabel: string;
}

const emptyNote: NoteFormState = {
  title: '',
  content: '',
  type: 'note',
  tags: [],
  color: '#ff7a1a',
  category: 'general',
  important: false,
  emoji: '💡',
  attachmentType: 'text',
  attachmentLabel: '',
};

const noteTypes: NoteType[] = ['note', 'bookmark', 'idea', 'reminder'];
const attachmentOptions = ['text', 'link', 'pdf', 'word', 'excel', 'image'];
const colorChoices = ['#ff7a1a', '#22d3ee', '#ec4899', '#d946ef', '#7e22ce'];

const Home: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [tagsText, setTagsText] = useState('');
  const [formData, setFormData] = useState<NoteFormState>(emptyNote);

  const fetchNotes = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      const data = await noteService.getNotes();
      setNotes(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load notes.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchNotes();
  }, []);

  const filteredNotes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return notes;

    return notes.filter((note) => {
      return (
        note.title.toLowerCase().includes(term) ||
        note.content.toLowerCase().includes(term) ||
        note.tags?.some((tag) => tag.toLowerCase().includes(term))
      );
    });
  }, [notes, searchTerm]);

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = (): void => {
    setFormData(emptyNote);
    setTagsText('');
    setEditingNoteId(null);
    setShowForm(false);
  };

  const startEditingNote = (note: Note): void => {
    setError('');
    setEditingNoteId(note.id);
    setShowForm(true);
    setFormData({
      title: note.title.replace(/^\p{Emoji}\s*/u, ''),
      content: note.content,
      type: note.type,
      tags: note.tags || [],
      color: note.color || '#ff7a1a',
      category: 'general',
      important: false,
      emoji: note.title.match(/^\p{Emoji}/u)?.[0] || '💡',
      attachmentType: 'text',
      attachmentLabel: '',
    });
    setTagsText((note.tags || []).join(', '));
  };

  const handleSaveNote = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and description are required.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      const payload: CreateNoteInput = {
        title: `${formData.emoji} ${formData.title.trim()}`,
        content: `${formData.content.trim()}${formData.attachmentLabel ? `\n\nAttachment: ${formData.attachmentType.toUpperCase()} · ${formData.attachmentLabel}` : ''}`,
        type: formData.type,
        tags: tagsText
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        color: formData.color,
      };
      if (editingNoteId) {
        const updated = await noteService.updateNote(editingNoteId, payload);
        setNotes((prev) => prev.map((note) => (note.id === editingNoteId ? updated : note)));
      } else {
        const created = await noteService.createNote(payload);
        setNotes((prev) => [created, ...prev]);
      }
      resetForm();
    } catch (err) {
      setError(getErrorMessage(err, editingNoteId ? 'Failed to update note.' : 'Failed to create note.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (id: number): Promise<void> => {
    const confirmed = window.confirm('Delete this note?');
    if (!confirmed) return;

    try {
      setError('');
      await noteService.deleteNote(id);
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to delete note.'));
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-black/30 px-6 py-6 backdrop-blur-2xl lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300/70">Workspace notes</p>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">Organize idea and plan.</p>
          </div>
          <Button type="button" onClick={() => (showForm ? resetForm() : setShowForm(true))}>
            {showForm ? <FiX className="h-4 w-4" /> : <FiPlus className="h-4 w-4" />}
            {showForm ? 'Close' : 'New note'}
          </Button>
        </header>

        <GlassPanel className="mb-6 p-4">
          <label className="relative block">
            <FiSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-300" />
            <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="h-12 w-full rounded-2xl border border-white/10 bg-black/30 pl-11 pr-4 text-white outline-none focus:border-cyan-400/40" placeholder="Search notes" />
          </label>
        </GlassPanel>

        {showForm && (
          <GlassPanel className="mb-6 p-6">
            <form onSubmit={handleSaveNote} className="grid gap-4 lg:grid-cols-2">
              <div className="lg:col-span-2">
                <p className="text-lg font-semibold text-white">{editingNoteId ? 'Edit note' : 'Create note'}</p>
              </div>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-300">Title</span>
                <input name="title" value={formData.title} onChange={handleFormChange} className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-white outline-none focus:border-cyan-400/40" placeholder="AI project idea" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-300">Type</span>
                <select name="type" value={formData.type} onChange={handleFormChange} className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-3 text-white outline-none focus:border-cyan-400/40">
                  {noteTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-300">Emoji</span>
                <select name="emoji" value={formData.emoji} onChange={handleFormChange} className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-3 text-white outline-none focus:border-cyan-400/40">
                  {['💡', '📝', '📚', '💼', '🔗'].map((emoji) => <option key={emoji} value={emoji}>{emoji}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-300">Category</span>
                <input name="category" value={formData.category} onChange={handleFormChange} className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-white outline-none focus:border-cyan-400/40" placeholder="What is that about?" />
              </label>
              <label className="block lg:col-span-2">
                <span className="mb-2 block text-sm font-medium text-slate-300">Description</span>
                <textarea name="content" value={formData.content} onChange={handleFormChange} className="min-h-28 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-400/40" placeholder="Add details" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-300">What kind?</span>
                <select name="attachmentType" value={formData.attachmentType} onChange={handleFormChange} className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-3 text-white outline-none focus:border-cyan-400/40">
                  {attachmentOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-300">Extension</span>
                <input name="attachmentLabel" value={formData.attachmentLabel} onChange={handleFormChange} className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-white outline-none focus:border-cyan-400/40" placeholder="research.pdf" />
              </label>
              <label className="block lg:col-span-2">
                <span className="mb-2 block text-sm font-medium text-slate-300">Tags</span>
                <input value={tagsText} onChange={(event) => setTagsText(event.target.value)} className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-white outline-none focus:border-cyan-400/40" placeholder="strategy, planning" />
              </label>
              <div className="flex flex-wrap items-center gap-3 lg:col-span-2">
                {colorChoices.map((color) => (
                  <button key={color} type="button" onClick={() => setFormData((prev) => ({ ...prev, color }))} className={`h-8 w-8 rounded-full border-2 ${formData.color === color ? 'border-white' : 'border-transparent'}`} style={{ backgroundColor: color }} aria-label={`Use color ${color}`} />
                ))}
                <div className="ml-auto flex gap-2">
                  <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>
                  <Button type="submit" loading={saving}>{editingNoteId ? 'Save changes' : 'Save note'}</Button>
                </div>
              </div>
            </form>
          </GlassPanel>
        )}

        {error && <div className="mb-6 rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-100">{error}</div>}

        {loading ? (
          <GlassPanel className="py-16 text-center text-slate-400">Loading notes...</GlassPanel>
        ) : filteredNotes.length === 0 ? (
          <GlassPanel className="py-16 text-center text-slate-400">No notes yet. Create your first note.</GlassPanel>
        ) : (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredNotes.map((note, index) => (
              <motion.article key={note.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className="rounded-[1.75rem] border border-white/10 bg-black/30 p-5 backdrop-blur-xl">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl" style={{ backgroundColor: note.color }}>
                      <FiBookOpen className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="break-words text-lg font-semibold text-white">{note.title}</h2>
                    <p className="mt-1 text-xs uppercase tracking-[0.3em] text-cyan-200/70">{note.type}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button type="button" onClick={() => startEditingNote(note)} className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-cyan-200" aria-label="Edit note"><FiEdit2 className="h-4 w-4" /></button>
                    <button type="button" onClick={() => void handleDeleteNote(note.id)} className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-rose-200" aria-label="Delete note"><FiTrash2 className="h-4 w-4" /></button>
                  </div>
                </div>
                <p className="text-sm leading-6 text-slate-400">{note.content}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {note.tags?.map((tag) => <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">{tag}</span>)}
                </div>
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center gap-2 text-sm text-cyan-200">
                    <FiPaperclip className="h-4 w-4" />
                    <span>Attachment-ready workspace</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-400">
                    <span className="rounded-full bg-black/30 px-2.5 py-1"><FiLink className="mr-1 inline" />Link</span>
                    <span className="rounded-full bg-black/30 px-2.5 py-1"><FiFileText className="mr-1 inline" />PDF</span>
                    <span className="rounded-full bg-black/30 px-2.5 py-1"><FiFileText className="mr-1 inline" />DOCX</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default Home;
