-- Real Estate Tracker Database Schema
-- PostgreSQL database schema for storing property information

-- Drop existing tables if they exist
DROP TABLE IF EXISTS properties CASCADE;

-- Create properties table
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    address VARCHAR(255) NOT NULL UNIQUE,
    city VARCHAR(100),
    state VARCHAR(50),
    zip VARCHAR(20),
    purchase_price DECIMAL(12, 2),
    monthly_rent DECIMAL(10, 2),
    hoa DECIMAL(10, 2) DEFAULT 0,
    property_tax DECIMAL(10, 2) DEFAULT 0,
    insurance DECIMAL(10, 2) DEFAULT 0,
    management_fees DECIMAL(10, 2) DEFAULT 0,
    repairs DECIMAL(10, 2) DEFAULT 0,
    vacancy DECIMAL(10, 2) DEFAULT 0,
    capex DECIMAL(10, 2) DEFAULT 0,
    mortgage DECIMAL(10, 2) DEFAULT 0,
    
    -- Calculated fields
    total_expenses DECIMAL(10, 2) GENERATED ALWAYS AS (
        COALESCE(hoa, 0) + 
        COALESCE(property_tax, 0) + 
        COALESCE(insurance, 0) + 
        COALESCE(management_fees, 0) + 
        COALESCE(repairs, 0) + 
        COALESCE(vacancy, 0) + 
        COALESCE(capex, 0) + 
        COALESCE(mortgage, 0)
    ) STORED,
    
    cash_flow DECIMAL(10, 2) GENERATED ALWAYS AS (
        COALESCE(monthly_rent, 0) - (
            COALESCE(hoa, 0) + 
            COALESCE(property_tax, 0) + 
            COALESCE(insurance, 0) + 
            COALESCE(management_fees, 0) + 
            COALESCE(repairs, 0) + 
            COALESCE(vacancy, 0) + 
            COALESCE(capex, 0) + 
            COALESCE(mortgage, 0)
        )
    ) STORED,
    
    -- Investment metrics
    coc_return DECIMAL(5, 2),
    rent_to_value DECIMAL(5, 2),
    cap_rate DECIMAL(5, 2),
    
    -- Risk assessment
    crime_score VARCHAR(20),
    flood_risk VARCHAR(20),
    market_risk VARCHAR(20),
    
    -- Property details from RentCast
    bedrooms INTEGER,
    bathrooms DECIMAL(3, 1),
    square_footage INTEGER,
    year_built INTEGER,
    lot_size INTEGER,
    property_type VARCHAR(50),
    county VARCHAR(100),
    
    -- Market data
    rent_estimate DECIMAL(10, 2),
    value_estimate DECIMAL(12, 2),
    
    -- Status
    status VARCHAR(20) DEFAULT 'active', -- active, sold, pending
    sold_date DATE,
    sold_price DECIMAL(12, 2),
    
    -- Metadata
    last_updated TIMESTAMP,
    data_source VARCHAR(50),
    notes TEXT,
    
    -- Comprehensive RentCast data storage
    rentcast_data JSONB,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_properties_address ON properties(address);
CREATE INDEX idx_properties_city_state ON properties(city, state);
CREATE INDEX idx_properties_cash_flow ON properties(cash_flow);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_created_at ON properties(created_at);
-- Index for JSONB queries
CREATE INDEX idx_properties_rentcast_data ON properties USING GIN (rentcast_data);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE
    ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data (optional - comment out for production)
-- INSERT INTO properties (address, city, state, zip, purchase_price, monthly_rent, property_tax, insurance, mortgage)
-- VALUES 
--     ('123 Main St', 'Las Vegas', 'NV', '89103', 250000, 2000, 208, 100, 1200),
--     ('456 Oak Ave', 'Henderson', 'NV', '89015', 300000, 2500, 250, 120, 1400);