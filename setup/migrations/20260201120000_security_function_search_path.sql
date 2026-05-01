-- Harden trigger helper search_path for advisor linter (function_search_path_mutable).
-- Safe to run multiple times after functions exist.

ALTER FUNCTION update_updated_at() SET search_path = public;
ALTER FUNCTION generate_order_number() SET search_path = public;
