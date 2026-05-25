import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiBookmark, FiEdit2, FiPlus, FiSearch, FiTrash2, FiX } from 'react-icons/fi';
import { getErrorMessage } from '../lib/axios';
import { noteService } from '../services/api';
import { CreateNoteInput, Note, NoteType } from '../types';
import Button from '../components/Button';

const emptyNote: CreateNoteInput = {
  title: '',
  content: '',
  type: 'note',
  tags: [],
  color: '#e11d48',
};

const noteTypes: NoteType[] = ['note', 'bookmark', 'idea', 'reminder'];

const colorChoices = ['#e11d48', '#22d3ee', '#ec4899', '#d946ef', '#7e22ce'];

const textFieldClass =
  'h-12 w-full rounded-lg border border-cyan-200/60 bg-white px-4 text-slate-950 placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/30';

const selectFieldClass =
  'h-12 w-full rounded-lg border border-cyan-200/60 bg-white px-3 text-slate-950 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/30';

const Home: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [tagsText, setTagsText] = useState('');
  const [formData, setFormData] = useState<CreateNoteInput>(emptyNote);

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

    if (!term) {
      return notes;
    }

    return notes.filter((note) => {
      return (
        note.title.toLowerCase().includes(term) ||
        note.content.toLowerCase().includes(term) ||
        note.tags?.some((tag) => tag.toLowerCase().includes(term))
      );
    });
  }, [notes, searchTerm]);

  const handleFormChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
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
      title: note.title,
      content: note.content,
      type: note.type,
      tags: note.tags || [],
      color: note.color || '#e11d48',
    });
    setTagsText((note.tags || []).join(', '));
  };
  const handleSaveNote = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required.');
      return;
    }
    try {
      setSaving(true);
      setError('');
      const payload = {
        ...formData,
        title: formData.title.trim(),
        content: formData.content.trim(),
        tags: tagsText
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
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
    if (!confirmed) {
      return;
    }

    try {
      setError('');
      await noteService.deleteNote(id);
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to delete note.'));
    }
  };
  return (
    <div className="min-h-screen bg-[linear-gradient(145deg,#000_0%,#18001f_46%,#050505_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold tracking-[0.28em] text-cyan-200/75">Shënimet me rëndësi </p>
          <p className="text-xs font-bold  text-green-100/75">Ruani informacionin, projektet dhe momentet e rëndësishme.</p>
        </div>
        <Button
          type="button"
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
        >
          {showForm ? <FiX className="h-4 w-5" /> : <FiPlus className="h-2 w-5" />}
          {showForm ? 'Mbylle' : 'Shënimet'}
        </Button>
      </header>

      <section className="panel-glass mb-6 rounded-lg p-4">
        <label className="relative block">
          <FiSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-300" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="h-12 w-full rounded-lg border border-fuchsia-300/20 bg-black/50 pl-11 pr-4 text-white outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
            placeholder="Kërkoni shënimet"
          />
        </label>
      </section>

      {showForm && (
        <motion.section
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="panel-glass mb-6 rounded-lg p-5"
        >
          <form onSubmit={handleSaveNote} className="grid gap-4 lg:grid-cols-2">
            <div className="lg:col-span-2">
              <p className="text-lg font-bold text-white">
                {editingNoteId ? 'Perditeso Shënimin' : 'Krijo Shënimin'}
              </p>
            </div>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-200">Titulli</span>
              <input
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                className={textFieldClass}
                placeholder="Shenoni emrin e shënimit"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
              <label>
                <span className="mb-2 block text-sm font-semibold text-slate-200">Lloji </span>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                  className={selectFieldClass}
                >
                  {noteTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="mb-2 block text-sm font-semibold text-slate-200">Tags</span>
                <input
                  value={tagsText}
                  onChange={(event) => setTagsText(event.target.value)}
                  className={textFieldClass}
                  placeholder="planifikimi, ide, projektet"
                />
              </label>
            </div>

            <label className="block lg:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-slate-200">Përmbajtja</span>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleFormChange}
                className="min-h-32 w-full resize-y rounded-lg border border-cyan-200/60 bg-white px-4 py-3 text-slate-950 placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/30"
                placeholder="Shenoni përmbajtjen e shënimit..."
              />
            </label>

            <div className="flex flex-wrap items-center gap-3 lg:col-span-2">
              {colorChoices.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, color }))}
                  className={`h-8 w-8 rounded-full border-2 ${
                    formData.color === color ? 'border-white' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Use color ${color}`}
                />
              ))}
              <div className="ml-auto flex gap-2">
                <Button type="button" variant="secondary" onClick={resetForm}>
                  Anulo
                </Button>
                <Button type="submit" loading={saving}>
                  {editingNoteId ? 'Ruaj Ndryshimet' : 'Ruaj Shënimin'}
                </Button>
              </div>
            </div>
          </form>
        </motion.section>
      )}

      {error && (
        <div className="mb-6 rounded-lg border border-rose-400/35 bg-rose-950/45 p-4 text-sm text-rose-100">
          {error}
        </div>
      )}

      {loading ? (
        <div className="panel-glass rounded-lg py-16 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-pink-500 border-t-transparent" />
          <p className="mt-4 text-sm text-slate-300">Duke ngarkuar shënimet...</p>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="panel-glass rounded-lg py-16 text-center">
          <p className="text-lg font-semibold text-white">Nuk u gjet asnjë shënim</p>
          <p className="mt-2 text-sm text-slate-400">Krijoni një shënim ose përshtatni kërkimin.</p>
        </div>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredNotes.map((note, index) => (
            <motion.article
              key={note.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="panel-glass rounded-lg p-5 transition hover:border-cyan-300/45"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: note.color }}>
                    <FiBookmark className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="break-words text-lg font-bold text-white">{note.title}</h2>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-cyan-200/75">{note.type}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => startEditingNote(note)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-200/25 bg-cyan-400/10 text-cyan-100 transition hover:bg-cyan-400/20"
                    aria-label="Përditeso shënimin"
                  >
                    <FiEdit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDeleteNote(note.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-rose-300/20 bg-rose-500/10 text-rose-200 transition hover:bg-rose-500/20"
                    aria-label="Fshije shënimin"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="line-clamp-3 text-sm leading-6 text-slate-300">{note.content}</p>

              {note.tags && note.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {note.tags.map((tag) => (
                    <span key={tag} className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-200">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.article>
          ))}
        </section>
      )}
    </div>
  );
};

export default Home;
