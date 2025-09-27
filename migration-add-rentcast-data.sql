-- Migration to add comprehensive RentCast data storage
-- This adds a JSONB column to store all additional property data from RentCast API

-- Add column for storing comprehensive RentCast data
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS rentcast_data JSONB;

-- Add index for JSONB queries (optional but improves performance)
CREATE INDEX IF NOT EXISTS idx_properties_rentcast_data ON properties USING GIN (rentcast_data);

-- Update existing properties to migrate any existing data into the JSONB column
UPDATE properties 
SET rentcast_data = jsonb_build_object(
    'lastUpdated', last_updated,
    'dataSource', data_source
)
WHERE rentcast_data IS NULL 
  AND (last_updated IS NOT NULL OR data_source IS NOT NULL);