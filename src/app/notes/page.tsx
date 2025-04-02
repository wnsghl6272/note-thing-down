'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  Squares2X2Icon as ViewGridIcon,
  ListBulletIcon as ViewListIcon,
  ChevronDownIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

type Note = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  selected?: boolean;
};

type SortOption = 'updated' | 'title';

export default function NotesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('updated');
  const [selectedNotes, setSelectedNotes] = useState<Set<string>>(new Set());
  const [showSortMenu, setShowSortMenu] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch('/api/notes');
        if (!response.ok) {
          throw new Error('Failed to fetch notes');
        }
        const data = await response.json();
        setNotes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load notes');
      } finally {
        setIsLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchNotes();
    }
  }, [status]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete note');
      }

      setNotes(notes.filter((note) => note.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note');
    }
  };

  const handleSelectNote = (id: string) => {
    setSelectedNotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedNotes.size === notes.length) {
      setSelectedNotes(new Set());
    } else {
      setSelectedNotes(new Set(notes.map(note => note.id)));
    }
  };

  const handleDeleteSelected = async () => {
    if (!confirm('Are you sure you want to delete the selected notes?')) {
      return;
    }

    try {
      const deletePromises = Array.from(selectedNotes).map(id =>
        fetch(`/api/notes/${id}`, { method: 'DELETE' })
      );
      await Promise.all(deletePromises);
      setNotes(notes.filter(note => !selectedNotes.has(note.id)));
      setSelectedNotes(new Set());
    } catch (err) {
      setError('Failed to delete selected notes');
    }
  };

  const handlePostToTwitter = async () => {
    // Implementation of handlePostToTwitter function
  };

  const sortedNotes = [...notes].sort((a, b) => {
    if (sortBy === 'updated') {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    }
    // For title, handle numeric values differently
    const aTitle = a.title.trim();
    const bTitle = b.title.trim();
    const aNum = parseFloat(aTitle);
    const bNum = parseFloat(bTitle);
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum;
    }
    return aTitle.localeCompare(bTitle);
  });

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
                Note Things Down
              </h1>
            </div>
            <div className="flex items-center space-x-6">
              <Link
                href="/notes/new"
                className="group inline-flex items-center gap-x-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <PlusIcon className="h-5 w-5" />
                New Note
              </Link>
              <div className="flex items-center space-x-4">
                <Link href="/profile" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                  <img
                    src={session?.user?.image || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                    alt="Profile"
                    className="h-8 w-8 rounded-full ring-2 ring-indigo-500/20"
                  />
                  <span className="text-base font-medium text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
                    {session?.user?.name || 'User'}
                  </span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Logout
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    if (selectedNotes.size > 0) {
                      window.location.href = '/api/twitter-auth';
                    }
                  }}
                  disabled={selectedNotes.size === 0}
                  className={`inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-full transition-all duration-200 shadow-md hover:shadow-lg ${selectedNotes.size === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Post to Twitter
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-8 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Controls */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-gray-100"
            >
              {viewMode === 'grid' ? (
                <ViewListIcon className="h-5 w-5" />
              ) : (
                <ViewGridIcon className="h-5 w-5" />
              )}
            </button>
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-gray-100"
              >
                <span>Sort by: {sortBy === 'updated' ? 'Last updated' : 'Title'}</span>
                <ChevronDownIcon className="h-4 w-4" />
              </button>
              {showSortMenu && (
                <div className="absolute left-0 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setSortBy('updated');
                        setShowSortMenu(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                    >
                      {sortBy === 'updated' && <CheckIcon className="h-4 w-4 mr-2" />}
                      <span className={sortBy === 'updated' ? 'ml-0' : 'ml-6'}>Last updated</span>
                    </button>
                    <button
                      onClick={() => {
                        setSortBy('title');
                        setShowSortMenu(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                    >
                      {sortBy === 'title' && <CheckIcon className="h-4 w-4 mr-2" />}
                      <span className={sortBy === 'title' ? 'ml-0' : 'ml-6'}>Title</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {selectedNotes.size > 0 && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {selectedNotes.size} selected
              </span>
              <button
                onClick={handleDeleteSelected}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-full transition-colors duration-200"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Delete Selected
              </button>
            </div>
          )}
        </div>

        {notes.length === 0 ? (
          <div className="text-center">
            <div className="mt-6">
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-12">
                <h3 className="text-lg font-semibold text-gray-900">No notes yet</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Get started by creating a new note.
                </p>
                <div className="mt-6">
                  <Link
                    href="/notes/new"
                    className="inline-flex items-center gap-x-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Create your first note
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 
            "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" : 
            "space-y-4"
          }>
            {sortedNotes.map((note) => (
              <div
                key={note.id}
                className={`group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden ${
                  viewMode === 'list' ? 'p-4' : ''
                }`}
              >
                <div className={viewMode === 'grid' ? 'p-6' : 'flex items-center'}>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedNotes.has(note.id)}
                      onChange={() => handleSelectNote(note.id)}
                      className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                    />
                    <div className={viewMode === 'list' ? 'flex-1' : ''}>
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {note.title}
                      </h3>
                      <p className={`mt-2 text-sm text-gray-600 ${
                        viewMode === 'grid' ? 'line-clamp-3' : 'line-clamp-1'
                      }`}>
                        {note.content}
                      </p>
                      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                        <span>
                          Updated {new Date(note.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={`${
                    viewMode === 'grid' 
                      ? 'absolute top-4 right-4 opacity-0 group-hover:opacity-100' 
                      : 'flex items-center ml-4'
                  } flex items-center gap-2 transition-opacity duration-200`}>
                    <Link
                      href={`/notes/${note.id}`}
                      className="p-2 text-gray-600 hover:text-indigo-600 rounded-full hover:bg-gray-100"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-gray-100"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 