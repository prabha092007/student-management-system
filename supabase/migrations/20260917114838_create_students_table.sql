/*
# Create students table (single-tenant, no auth)

1. New Tables
- `students`
  - `id` (bigint, primary key, auto-incrementing)
  - `name` (text, not null) — student's full name
  - `email` (text, unique, not null) — must be a valid unique email
  - `phone` (text, not null) — contact phone number
  - `department` (text, not null) — academic department
  - `year` (integer, not null) — year of study (1-4)
  - `cgpa` (numeric, not null) — GPA on a 0-10 scale
  - `created_at` (timestamptz, default now()) — automatically generated timestamp

2. Constraints
- `students_email_key` — unique constraint on email to prevent duplicates
- `students_cgpa_check` — check constraint ensuring cgpa is between 0 and 10
- `students_year_check` — check constraint ensuring year is between 1 and 5

3. Security
- Enable RLS on `students`.
- Allow anon + authenticated full CRUD because this is a single-tenant app with no sign-in.
- All four policies (SELECT, INSERT, UPDATE, DELETE) use `USING (true)` / `WITH CHECK (true)`
  because the data is intentionally public/shared.

4. Indexes
- Index on `email` for fast lookups and uniqueness enforcement.
- Index on `department` for filter queries.
- Index on `name` for search queries.
*/

CREATE TABLE IF NOT EXISTS students (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  department text NOT NULL,
  year integer NOT NULL CHECK (year >= 1 AND year <= 5),
  cgpa numeric(3,2) NOT NULL CHECK (cgpa >= 0 AND cgpa <= 10),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_students" ON students;
CREATE POLICY "anon_select_students" ON students FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_students" ON students;
CREATE POLICY "anon_insert_students" ON students FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_students" ON students;
CREATE POLICY "anon_update_students" ON students FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_students" ON students;
CREATE POLICY "anon_delete_students" ON students FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_department ON students(department);
CREATE INDEX IF NOT EXISTS idx_students_name ON students(name);
