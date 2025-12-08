-- Remove overly permissive public upload policy from storage
-- Uploads are handled securely via edge function with SERVICE_ROLE_KEY
DROP POLICY IF EXISTS "Public can upload documents" ON storage.objects;