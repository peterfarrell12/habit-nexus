-- Create habits table
CREATE TABLE habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL DEFAULT '#3b82f6',
  icon TEXT NOT NULL DEFAULT '⭐',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL
);

-- Create habit_logs table
CREATE TABLE habit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- Enable Row Level Security
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your auth setup)
CREATE POLICY "Users can view their own habits" ON habits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habits" ON habits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits" ON habits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits" ON habits
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view logs for their habits" ON habit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM habits 
      WHERE habits.id = habit_logs.habit_id 
      AND habits.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert logs for their habits" ON habit_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM habits 
      WHERE habits.id = habit_logs.habit_id 
      AND habits.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update logs for their habits" ON habit_logs
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM habits 
      WHERE habits.id = habit_logs.habit_id 
      AND habits.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete logs for their habits" ON habit_logs
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM habits 
      WHERE habits.id = habit_logs.habit_id 
      AND habits.user_id = auth.uid()
    )
  );xabzec-4ganNu-qavcof