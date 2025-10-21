-- Add foreign key between propostas_financiamento and users
ALTER TABLE propostas_financiamento
ADD CONSTRAINT propostas_financiamento_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES users(id) 
ON DELETE CASCADE;