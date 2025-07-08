-- Add evaluation_id to documents table
ALTER TABLE documents ADD COLUMN evaluation_id INTEGER;
-- (Optional) Add a foreign key constraint if you want strict referential integrity:
-- ALTER TABLE documents ADD CONSTRAINT fk_documents_evaluation FOREIGN KEY (evaluation_id) REFERENCES immigration_evaluations(id) ON DELETE SET NULL;
