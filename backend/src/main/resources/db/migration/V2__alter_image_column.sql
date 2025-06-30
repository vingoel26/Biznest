-- Migration to alter image column to LONGBLOB
ALTER TABLE business_listings MODIFY COLUMN image LONGBLOB; 