-- Create handle_new_user function
CREATE FUNCTION handle_new_user() RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email) VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
ALTER FUNCTION handle_new_user() OWNER TO postgres;
GRANT EXECUTE ON FUNCTION handle_new_user() TO anon;
-- Repeat for other functions and grants if needed...
