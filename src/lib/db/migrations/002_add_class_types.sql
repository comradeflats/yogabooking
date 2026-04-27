-- Migration 002: Add class types support
-- Creates class_types table and updates time_slots table

-- Create class_types table
CREATE TABLE IF NOT EXISTS class_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  color VARCHAR(7) NOT NULL, -- Hex color code (e.g., #10b981)
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create index for active class types
CREATE INDEX IF NOT EXISTS idx_class_types_active ON class_types(is_active);

-- Alter time_slots table to add class type support
ALTER TABLE time_slots
  ADD COLUMN IF NOT EXISTS class_type_id INTEGER REFERENCES class_types(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS instructor_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS instructor_photo_url TEXT;

-- Create index for class type lookups
CREATE INDEX IF NOT EXISTS idx_time_slots_class_type ON time_slots(class_type_id);

-- Insert default class types
INSERT INTO class_types (name, description, color, duration_minutes) VALUES
  ('Vinyasa Flow', 'Dynamic flowing sequences synchronized with breath', '#10b981', 60),
  ('Yin Yoga', 'Slow-paced practice with longer holds to release deep tension', '#8b5cf6', 75),
  ('Power Yoga', 'Vigorous, fitness-based approach to vinyasa-style yoga', '#ef4444', 60),
  ('Hatha Yoga', 'Traditional practice focusing on physical postures and breathing', '#f59e0b', 60)
ON CONFLICT DO NOTHING;
