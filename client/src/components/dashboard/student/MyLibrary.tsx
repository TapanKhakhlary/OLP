import React from 'react';
import { useState, useEffect } from 'react';
import { BookOpen, Clock, CheckCircle, Heart, Search, ExternalLink, Plus } from 'lucide-react';
import { apiRequest } from '../../../lib/queryClient';
import { useAuth } from '../../../contexts/AuthContext';

interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  subject?: string[];
}

const MyLibrary: React.FC = () => {
  const { user } = useAuth();
  const [myBooks, setMyBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<OpenLibraryBook[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState<'my-library' | 'search'>('my-library');

  useEffect(() => {
    if (user) {
      fetchUserBooks();
    }
  }, [user]);

  const fetchUserBooks = async () => {
    try {
      const data = await apiRequest(`/reading-progress/user/${user?.id}`);
      setMyBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchBooks = async () => {
    if (!searchTerm.trim()) return;
    
    setSearchLoading(true);
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(searchTerm)}&limit=20`
      );
      const data = await response.json();
      setSearchResults(data.docs || []);
      setHasSearched(true);
    } catch (error) {
      console.error('Error searching books:', error);
      alert('Error searching books. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchBooks();
    }
  };

  const getCoverUrl = (coverId: number) => {
    return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
  };

  const getBookUrl = (key: string) => {
    return `https://openlibrary.org${key}`;
  };

  const addToMyLibrary = async (book: OpenLibraryBook, status: 'reading' | 'completed' | 'wishlist') => {
    try {
      // Create a book entry first if it doesn't exist
      const bookData = {
        title: book.title,
        author: book.author_name ? book.author_name.slice(0, 2).join(', ') : 'Unknown Author',
        genre: book.subject ? book.subject[0] : 'General',
        cover_url: book.cover_i ? getCoverUrl(book.cover_i) : null,
        description: `Published: ${book.first_publish_year || 'Unknown'}`,
        isbn: book.key.split('/').pop() || '',
      };

      // Add to reading progress
      await apiRequest(`/reading-progress`, {
        method: 'POST',
        body: JSON.stringify({
          userId: user?.id,
          bookId: book.key,
          status,
          progress: status === 'completed' ? 100 : 0,
          bookData
        }),
      });
      
      fetchUserBooks();
      alert(`"${book.title}" has been added to your library!`);
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Error adding book to library. Please try again.');
    }
  };

  const updateBookStatus = async (bookId: string, status: 'reading' | 'completed' | 'wishlist') => {
    try {
      await apiRequest(`/reading-progress/${bookId}`, {
        method: 'PUT',
        body: JSON.stringify({
          status,
          progress: status === 'completed' ? 100 : 0,
        }),
      });
      fetchUserBooks();
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'reading':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'wishlist':
        return <Heart className="h-4 w-4 text-red-600" />;
      default:
        return <BookOpen className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reading':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'wishlist':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Library</h1>
        <p className="text-gray-600">Track your reading journey and discover new books from Open Library</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('my-library')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'my-library'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Books
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'search'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Discover Books
            </button>
          </nav>
        </div>
      </div>

      {/* My Library Tab */}
      {activeTab === 'my-library' && (
        <div>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myBooks.map((book) => (
                  <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <img
                      src={book.books?.cover_url || 'https://images.pexels.com/photos/1181701/pexels-photo-1181701.jpeg?auto=compress&cs=tinysrgb&w=400'}
                      alt={book.books?.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">{book.books?.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{book.books?.author}</p>
                      <p className="text-gray-500 text-xs mb-3">{book.books?.genre}</p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(book.status)}`}>
                          {getStatusIcon(book.status)}
                          <span className="capitalize">{book.status}</span>
                        </div>
                        {book.status === 'reading' && (
                          <span className="text-sm text-gray-600">{book.progress}%</span>
                        )}
                      </div>

                      {book.status === 'reading' && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${book.progress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {myBooks.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No books in your library yet</h3>
                  <p className="text-gray-600">Start by searching and adding books from the "Discover Books" tab</p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Search Tab */}
      {activeTab === 'search' && (
        <div>
          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search for books, authors, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={searchBooks}
                disabled={searchLoading || !searchTerm.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {searchLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {/* Loading State */}
          {searchLoading && (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Search Results */}
          {!searchLoading && searchResults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map((book) => (
                <div key={book.key} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    {book.cover_i ? (
                      <img
                        src={getCoverUrl(book.cover_i)}
                        alt={book.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`flex items-center justify-center h-full ${book.cover_i ? 'hidden' : ''}`}>
                      <BookOpen className="h-12 w-12 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {book.author_name ? book.author_name.slice(0, 2).join(', ') : 'Unknown Author'}
                    </p>
                    {book.first_publish_year && (
                      <p className="text-gray-500 text-xs mb-3">First published: {book.first_publish_year}</p>
                    )}
                    
                    {book.subject && book.subject.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {book.subject.slice(0, 3).map((subject, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-col space-y-2">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => addToMyLibrary(book, 'reading')}
                          className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Reading</span>
                        </button>
                        <button
                          onClick={() => addToMyLibrary(book, 'wishlist')}
                          className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
                        >
                          <Heart className="h-4 w-4" />
                          <span>Wishlist</span>
                        </button>
                      </div>
                      <a
                        href={getBookUrl(book.key)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm"
                      >
                        <ExternalLink className="h-4 w-4 text-gray-600 mr-1" />
                        View Details
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!searchLoading && hasSearched && searchResults.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
              <p className="text-gray-600">Try searching with different keywords</p>
            </div>
          )}

          {/* Initial State */}
          {!searchLoading && !hasSearched && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Discover Books from Open Library</h3>
              <p className="text-gray-600">Enter a book title, author, or topic to get started</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyLibrary;