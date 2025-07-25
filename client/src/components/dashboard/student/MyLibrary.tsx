import React from 'react';
import { useState, useEffect } from 'react';
import { BookOpen, Clock, CheckCircle, Heart } from 'lucide-react';
import { apiRequest } from '../../../lib/queryClient';
import { useAuth } from '../../../contexts/AuthContext';

const MyLibrary: React.FC = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserBooks();
    }
  }, [user]);

  const fetchUserBooks = async () => {
    try {
      const data = await apiRequest(`/reading-progress/user/${user?.id}`);
      setBooks(data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBookToLibrary = async (bookId: string, status: 'reading' | 'completed' | 'wishlist') => {
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
      console.error('Error adding book:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
        <p className="text-gray-600">Track your reading journey and explore new books</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src={book.books.cover_url || 'https://images.pexels.com/photos/1181701/pexels-photo-1181701.jpeg?auto=compress&cs=tinysrgb&w=400'}
              alt={book.books.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-900 mb-1">{book.books.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{book.books.author}</p>
              <p className="text-gray-500 text-xs mb-3">{book.books.genre}</p>
              
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

      {books.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No books in your library yet</h3>
          <p className="text-gray-600">Start by adding some books to track your reading progress</p>
        </div>
      )}
    </div>
  );
};

export default MyLibrary;