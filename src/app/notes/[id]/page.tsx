'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { use } from 'react';
import { ArrowLeftIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

type Note = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

type TransformModalProps = {
  isOpen: boolean;
  onClose: () => void;
  variations: string[];
  onSelect: (text: string) => void;
};

function TransformModal({ isOpen, onClose, variations, onSelect }: TransformModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Select a variation</h3>
        <div className="space-y-4">
          {variations.map((variation, index) => (
            <button
              key={index}
              onClick={() => {
                onSelect(variation);
                onClose();
              }}
              className="w-full text-left p-4 rounded-lg border hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200"
            >
              {variation}
            </button>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EditNote({ params }: { params: Promise<{ id: string }> }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const resolvedParams = use(params);
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTransformModalOpen, setIsTransformModalOpen] = useState(false);
  const [variations, setVariations] = useState<string[]>([]);
  const [isTransforming, setIsTransforming] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(`/api/notes/${resolvedParams.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch note');
        }
        const data = await response.json();
        setNote(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch note');
      } finally {
        setIsLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchNote();
    }
  }, [status, resolvedParams.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note) return;

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/notes/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: note.title,
          content: note.content,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update note');
      }

      router.push('/notes');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update note');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTransform = async () => {
    if (!note) return;
    setIsTransforming(true);

    try {
      const response = await fetch('/api/transform-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: note.content }),
      });

      if (!response.ok) {
        throw new Error('Failed to transform text');
      }

      const data = await response.json();
      setVariations(data.variations);
      setIsTransformModalOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to transform text');
    } finally {
      setIsTransforming(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={() => router.push('/notes')}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Notes
          </button>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-gray-600 mb-4">Note not found</div>
          <button
            onClick={() => router.push('/notes')}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Notes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-3">
              <Link
                href="/notes"
                className="group -ml-1 p-1 text-gray-500 hover:text-indigo-600"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
                Edit Note
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="title"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={note.title}
                onChange={(e) => setNote({ ...note, title: e.target.value })}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg py-3 px-4"
                required
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                Content
              </label>
              <textarea
                id="content"
                value={note.content}
                onChange={(e) => setNote({ ...note, content: e.target.value })}
                rows={15}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg leading-relaxed"
                required
              />
            </div>

            <div className="flex justify-between items-center space-x-4">
              <div className="flex space-x-4">
                <Link
                  href="/notes"
                  className="px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex justify-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
              <button
                type="button"
                onClick={handleTransform}
                disabled={isTransforming}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-transparent rounded-lg hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200"
              >
                <SparklesIcon className="h-5 w-5 mr-2" />
                {isTransforming ? 'Transforming...' : 'Transform to X Style'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <TransformModal
        isOpen={isTransformModalOpen}
        onClose={() => setIsTransformModalOpen(false)}
        variations={variations}
        onSelect={(text) => {
          if (note) {
            setNote({ ...note, content: text });
          }
        }}
      />
    </div>
  );
} 