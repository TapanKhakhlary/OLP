/*
  # Initial Schema for LitPlatform

  1. New Tables
    - `profiles` - User profile information extending Supabase auth
    - `classes` - Teacher-created classes
    - `books` - Available books in the library
    - `assignments` - Teacher-created assignments
    - `submissions` - Student assignment submissions
    - `achievements` - Available achievements
    - `user_achievements` - User-earned achievements
    - `reading_progress` - Student reading progress tracking
    - `messages` - Communication between teachers and parents
    - `class_enrollments` - Student-class relationships
    - `parent_child_links` - Parent-child relationships

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'parent');
CREATE TYPE assignment_status AS ENUM ('not-started', 'in-progress', 'submitted', 'graded');
CREATE TYPE reading_status AS ENUM ('reading', 'completed', 'wishlist');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  role user_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  teacher_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Books table
CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  genre text NOT NULL,
  description text,
  cover_url text,
  reading_level text,
  pages integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  instructions text,
  book_id uuid REFERENCES books(id),
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  due_date timestamptz NOT NULL,
  max_score integer DEFAULT 100,
  created_at timestamptz DEFAULT now()
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid REFERENCES assignments(id) ON DELETE CASCADE,
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text,
  status assignment_status DEFAULT 'not-started',
  score integer,
  feedback text,
  submitted_at timestamptz,
  graded_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  rarity text DEFAULT 'common',
  created_at timestamptz DEFAULT now()
);

-- User achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id uuid REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Reading progress table
CREATE TABLE IF NOT EXISTS reading_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  status reading_status DEFAULT 'reading',
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  UNIQUE(user_id, book_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Class enrollments table
CREATE TABLE IF NOT EXISTS class_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  enrolled_at timestamptz DEFAULT now(),
  UNIQUE(class_id, student_id)
);

-- Parent child links table
CREATE TABLE IF NOT EXISTS parent_child_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  child_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(parent_id, child_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_child_links ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Classes policies
CREATE POLICY "Teachers can manage own classes" ON classes
  FOR ALL USING (teacher_id = auth.uid());

CREATE POLICY "Students can view enrolled classes" ON classes
  FOR SELECT USING (
    id IN (
      SELECT class_id FROM class_enrollments 
      WHERE student_id = auth.uid()
    )
  );

-- Books policies (public read access)
CREATE POLICY "Anyone can read books" ON books
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Teachers can manage books" ON books
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

-- Assignments policies
CREATE POLICY "Teachers can manage own assignments" ON assignments
  FOR ALL USING (teacher_id = auth.uid());

CREATE POLICY "Students can view class assignments" ON assignments
  FOR SELECT USING (
    class_id IN (
      SELECT class_id FROM class_enrollments 
      WHERE student_id = auth.uid()
    )
  );

-- Submissions policies
CREATE POLICY "Students can manage own submissions" ON submissions
  FOR ALL USING (student_id = auth.uid());

CREATE POLICY "Teachers can view class submissions" ON submissions
  FOR SELECT USING (
    assignment_id IN (
      SELECT id FROM assignments 
      WHERE teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can update class submissions" ON submissions
  FOR UPDATE USING (
    assignment_id IN (
      SELECT id FROM assignments 
      WHERE teacher_id = auth.uid()
    )
  );

-- Achievements policies (public read)
CREATE POLICY "Anyone can read achievements" ON achievements
  FOR SELECT TO authenticated USING (true);

-- User achievements policies
CREATE POLICY "Users can read own achievements" ON user_achievements
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can insert achievements" ON user_achievements
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Reading progress policies
CREATE POLICY "Users can manage own reading progress" ON reading_progress
  FOR ALL USING (user_id = auth.uid());

-- Messages policies
CREATE POLICY "Users can read own messages" ON messages
  FOR SELECT USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update own messages" ON messages
  FOR UPDATE USING (recipient_id = auth.uid());

-- Class enrollments policies
CREATE POLICY "Teachers can manage class enrollments" ON class_enrollments
  FOR ALL USING (
    class_id IN (
      SELECT id FROM classes 
      WHERE teacher_id = auth.uid()
    )
  );

CREATE POLICY "Students can view own enrollments" ON class_enrollments
  FOR SELECT USING (student_id = auth.uid());

-- Parent child links policies
CREATE POLICY "Parents can manage own links" ON parent_child_links
  FOR ALL USING (parent_id = auth.uid());

CREATE POLICY "Children can view parent links" ON parent_child_links
  FOR SELECT USING (child_id = auth.uid());

-- Insert sample data
INSERT INTO books (title, author, genre, description, cover_url, reading_level, pages) VALUES
  ('To Kill a Mockingbird', 'Harper Lee', 'Classic Literature', 'A gripping tale of racial injustice and childhood innocence.', 'https://images.pexels.com/photos/1181701/pexels-photo-1181701.jpeg?auto=compress&cs=tinysrgb&w=400', 'Grade 9-12', 376),
  ('The Great Gatsby', 'F. Scott Fitzgerald', 'Classic Literature', 'A critique of the American Dream set in the Jazz Age.', 'https://images.pexels.com/photos/1181719/pexels-photo-1181719.jpeg?auto=compress&cs=tinysrgb&w=400', 'Grade 10-12', 180),
  ('1984', 'George Orwell', 'Dystopian Fiction', 'A dystopian vision of a totalitarian society.', 'https://images.pexels.com/photos/1181708/pexels-photo-1181708.jpeg?auto=compress&cs=tinysrgb&w=400', 'Grade 10-12', 328),
  ('Pride and Prejudice', 'Jane Austen', 'Romance', 'A witty romance exploring class and social expectations.', 'https://images.pexels.com/photos/1181694/pexels-photo-1181694.jpeg?auto=compress&cs=tinysrgb&w=400', 'Grade 9-12', 432);

INSERT INTO achievements (name, description, icon, rarity) VALUES
  ('Bookworm', 'Read 10 books in a month', 'BookOpen', 'common'),
  ('Speed Reader', 'Complete a book in under 3 days', 'Zap', 'rare'),
  ('Genre Explorer', 'Read books from 5 different genres', 'Target', 'uncommon'),
  ('Perfect Score', 'Get 100% on an assignment', 'Star', 'epic'),
  ('Reading Streak', 'Read for 30 consecutive days', 'Trophy', 'legendary'),
  ('Essay Master', 'Submit 5 essays with A grades', 'Award', 'rare');