-- ============================================================================
-- Baker's Fresh — Supabase Storage Policies
-- ============================================================================
-- HOW TO USE:
-- 1. First create the buckets manually in Storage UI:
--    - "order-references" (private, 10 MB limit)
--    - "cake-images" (public, 5 MB limit)
-- 2. Then go to SQL Editor and paste this entire file
-- 3. Click "Run"
-- ============================================================================

-- order-references: public can upload (one-time, from order form)
CREATE POLICY "Public can upload to order-references"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'order-references');

-- order-references: only authenticated (admin) can read
CREATE POLICY "Authenticated can read order-references"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'order-references' AND auth.role() = 'authenticated'
  );

-- order-references: only authenticated can delete (cleanup orders)
CREATE POLICY "Authenticated can delete order-references"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'order-references' AND auth.role() = 'authenticated'
  );

-- cake-images: public can read (for catalog display)
CREATE POLICY "Public can read cake-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'cake-images');

-- cake-images: only authenticated can upload/update/delete (admin manages catalog)
CREATE POLICY "Authenticated can insert cake-images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'cake-images' AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated can update cake-images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'cake-images' AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated can delete cake-images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'cake-images' AND auth.role() = 'authenticated'
  );
