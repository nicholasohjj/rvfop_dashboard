-- we don't know how to generate root <with-no-name> (class Root) :(
 comment on database postgres is 'default administrative connection database';

grant connect,
create,
temporary on database postgres to dashboard_user;


create table houses ( house_id uuid default uuid_generate_v4() not null primary key, house_name varchar(255) default ''::character varying not null constraint houses_name_key unique, total_points integer default 0, house_logo text, house_description text, house_ig text, pro_human_points integer default 0 not null);


alter table houses owner to postgres;


create policy "Enable read access for all users" on houses as permissive
for
select using true;


create policy "Enable update for authenticated users only" on houses as permissive
for
update to authenticated using (auth.uid() IS NOT NULL);

grant
delete,
insert, references,
select, trigger,
        truncate,
update on houses to anon;

grant
delete,
insert, references,
select, trigger,
        truncate,
update on houses to authenticated;

grant
delete,
insert, references,
select, trigger,
        truncate,
update on houses to service_role;


create table activities ( activity_id uuid default uuid_generate_v4() not null constraint activity_pkey primary key, activity_name varchar(255) not null constraint activities_name_key unique, description text);


alter table activities owner to postgres;


create policy "Enable insert for authenticated users only" on activities as permissive
for
insert to authenticated with check true;


create policy "Enable read access for authenticated users only" on activities as permissive
for
select to authenticated using true;


create policy "Enable delete access for authenticated users only" on activities as permissive
for
delete using true;


create policy "Enable read access for all users" on activities as permissive
for
select using true;

grant
delete,
insert, references,
select, trigger,
        truncate,
update on activities to anon;

grant
delete,
insert, references,
select, trigger,
        truncate,
update on activities to authenticated;

grant
delete,
insert, references,
select, trigger,
        truncate,
update on activities to service_role;


create table matches ( match_id uuid default gen_random_uuid() not null primary key, usersid uuid[], is_ongoing boolean default true not null);


alter table matches owner to postgres;


create policy "Enable read access for all users" on matches as permissive
for
select using true;


create policy "Enable insert for authenticated users only" on matches as permissive
for
insert to authenticated with check true;


create policy "Enable splitaccess for all users" on matches as permissive
for
update using true;


create policy "Enable delete for authenticated users only" on matches as permissive
for
delete to authenticated using true;

grant
delete,
insert, references,
select, trigger,
        truncate,
update on matches to anon;

grant
delete,
insert, references,
select, trigger,
        truncate,
update on matches to authenticated;

grant
delete,
insert, references,
select, trigger,
        truncate,
update on matches to service_role;


create table roles ( role text not null primary key,
                                                role_name text, is_active boolean default true not null,
                                                                                               needs_group boolean default true not null,
                                                                                                                                has_progress boolean default false not null,
                                                                                                                                                                   can_deduct boolean default false not null,
                                                                                                                                                                                                    can_add_activity boolean default false not null);


alter table roles owner to postgres;


create policy "Enable read access for all users" on roles as permissive
for
select using true;

grant
delete,
insert, references,
select, trigger,
        truncate,
update on roles to anon;

grant
delete,
insert, references,
select, trigger,
        truncate,
update on roles to authenticated;

grant
delete,
insert, references,
select, trigger,
        truncate,
update on roles to service_role;


create table channels ( channel text not null primary key, is_active boolean default false);


alter table channels owner to postgres;


create policy "Enable read access for all users" on channels as permissive
for
select using true;

grant
delete,
insert, references,
select, trigger,
        truncate,
update on channels to anon;

grant
delete,
insert, references,
select, trigger,
        truncate,
update on channels to authenticated;

grant
delete,
insert, references,
select, trigger,
        truncate,
update on channels to service_role;


create table group_roles ( role text not null constraint group_role_pkey primary key, description text);


alter table group_roles owner to postgres;


create table groups
    ( group_id uuid default uuid_generate_v4() not null primary key, group_name varchar(255) not null constraint groups_name_key unique, house_id uuid not null references houses on update cascade on delete restrict, total_points integer default 0, group_role text default 'good'::text not null references group_roles on update cascade on delete restrict, group_display_name text not null unique, group_image text);


alter table groups owner to postgres;


create policy "Enable update for authenticated users only" on groups as permissive
for
update to authenticated using (auth.uid() IS NOT NULL);


create policy "Enable read access for all users" on groups as permissive
for
select using true;

grant
delete,
insert, references,
select, trigger,
        truncate,
update on groups to anon;

grant
delete,
insert, references,
select, trigger,
        truncate,
update on groups to authenticated;

grant
delete,
insert, references,
select, trigger,
        truncate,
update on groups to service_role;


create table deductions
    ( deducted_group_id uuid not null references groups on update cascade on delete restrict, group_id uuid not null references groups on update cascade on delete restrict, points_deducted integer default 0 not null constraint deductions_points_deducted_check check (points_deducted >= 0), tm_created timestamp with time zone default (now() AT TIME ZONE 'utc'::text) not null, deduction_id uuid default uuid_generate_v4() not null primary key, comments text);


alter table deductions owner to postgres;


create policy "Enable insert for authenticated users only" on deductions as permissive
for
insert to authenticated with check true;


create policy "Enable read access for authenticated users only" on deductions as permissive
for
select to authenticated using true;


create policy "Enable delete access for authenticated users only" on deductions as permissive
for
delete to authenticated using true;


create policy "Enable update for authenticated users only" on deductions as permissive
for
update to authenticated using (auth.uid() IS NOT NULL);

grant
delete,
insert, references,
select, trigger,
        truncate,
update on deductions to anon;

grant
delete,
insert, references,
select, trigger,
        truncate,
update on deductions to authenticated;

grant
delete,
insert, references,
select, trigger,
        truncate,
update on deductions to service_role;


create table profiles
    ( email varchar constraint public_profiles_email_fkey references ??? () on update cascade on delete cascade, id uuid not null primary key constraint public_profiles_id_fkey references ??? () on update cascade on delete cascade, group_id uuid default 'b8963657-54e1-47a3-adef-81fda923e454'::uuid references groups on update cascade on delete restrict, role text default 'spectator'::text references roles on update cascade on delete restrict, profile_name text);


alter table profiles owner to postgres;


create table groupactivities
    ( group_id uuid not null references groups on update cascade on delete restrict, activity_id uuid not null references activities on update cascade on delete restrict, points_earned integer default 0, tm_created timestamp with time zone default ((now() AT TIME ZONE 'utc'::text) AT TIME ZONE 'Asia/Singapore'::text), group_activity_id uuid default uuid_generate_v4() not null primary key, gm_id uuid not null references profiles on update cascade on delete restrict, comments text default '""'::text not null);


alter table groupactivities owner to postgres;


create policy "Enable read access for authenticated users only" on groupactivities as permissive
for
select using true;


create policy "Enable insert for authenticated users only" on groupactivities as permissive
for
insert to authenticated with check true;


create policy "Enable delete access for authenticated users only" on groupactivities as permissive
for
delete using true;


create policy "Enable update for authenticated users only" on groupactivities as permissive
for
update to authenticated using (auth.uid() IS NOT NULL);

grant
delete,
insert, references,
select, trigger,
        truncate,
update on groupactivities to anon;

grant
delete,
insert, references,
select, trigger,
        truncate,
update on groupactivities to authenticated;

grant
delete,
insert, references,
select, trigger,
        truncate,
update on groupactivities to service_role;


create policy "Enable read access for all users" on profiles as permissive
for
select to authenticated using true;


create policy "Enable update for authenticated users only" on profiles as permissive
for
update to authenticated using (auth.uid() IS NOT NULL);


create policy "Enable insert for authenticated users only" on profiles as permissive
for
insert to authenticated with check true;

grant
delete,
insert, references,
select, trigger,
        truncate,
update on profiles to anon;

grant
delete,
insert, references,
select, trigger,
        truncate,
update on profiles to authenticated;

grant
delete,
insert, references,
select, trigger,
        truncate,
update on profiles to service_role;


create table messages
    ( message_id uuid default gen_random_uuid() not null primary key, user_id uuid default gen_random_uuid() constraint public_messages_user_id_fkey references profiles on update cascade on delete cascade, message text, tm_created timestamp with time zone default now() not null, channel text references channels on update cascade on delete restrict);


alter table messages owner to postgres;


create policy "Enable insert for authenticated users only" on messages as permissive
for all to authenticated with check true;


create policy "Enable read access for all users" on messages as permissive
for
select using true;

grant
delete,
insert, references,
select, trigger,
        truncate,
update on messages to anon;

grant
delete,
insert, references,
select, trigger,
        truncate,
update on messages to authenticated;

grant
delete,
insert, references,
select, trigger,
        truncate,
update on messages to service_role;


create table private_messages
    ( message_id uuid default gen_random_uuid() not null primary key, user_id uuid default gen_random_uuid() constraint public_private_messages_user_id_fkey references profiles on update cascade on delete cascade, message text, tm_created timestamp with time zone default now() not null, match_id uuid default gen_random_uuid() references matches on update cascade on delete restrict);

comment on table private_messages is 'Messages from matcher';


alter table private_messages owner to postgres;


create policy "Enable read access for all users" on private_messages as permissive
for
select using true;


create policy "Enable insert for authenticated users only" on private_messages as permissive
for
insert to authenticated with check true;

grant
delete,
insert, references,
select, trigger,
        truncate,
update on private_messages to anon;

grant
delete,
insert, references,
select, trigger,
        truncate,
update on private_messages to authenticated;

grant
delete,
insert, references,
select, trigger,
        truncate,
update on private_messages to service_role;


create policy "Enable read access for all users" on group_roles as permissive
for
select using true;

grant
delete,
insert, references,
select, trigger,
        truncate,
update on group_roles to anon;

grant
delete,
insert, references,
select, trigger,
        truncate,
update on group_roles to authenticated;

grant
delete,
insert, references,
select, trigger,
        truncate,
update on group_roles to service_role;


create function handle_new_user() returns trigger security definer
SET search_path = public language plpgsql as $$begin
  insert into public.profiles (id, email, role, group_id, profile_name)
  values (new.id, new.email,
NEW.raw_user_meta_data->>'role',
    (NEW.raw_user_meta_data->>'group_id')::uuid,
    NEW.raw_user_meta_data->>'profile_name'

  );
  return new;
end;$$;


alter function handle_new_user() owner to postgres;

grant execute on function handle_new_user() to anon;

grant execute on function handle_new_user() to authenticated;

grant execute on function handle_new_user() to service_role;


create function check_user_verified_status(user_email text) returns boolean language plpgsql as $$
DECLARE
    is_verified BOOLEAN;
BEGIN
    SELECT email_confirmed_at IS NOT NULL INTO is_verified
    FROM auth.users
    WHERE email = user_email;

    IF is_verified IS NULL THEN
        -- If no user found, return FALSE
        RETURN FALSE;
    END IF;

    RETURN is_verified;
END;
$$;


alter function check_user_verified_status(text) owner to postgres;

grant execute on function check_user_verified_status(text) to anon;

grant execute on function check_user_verified_status(text) to authenticated;

grant execute on function check_user_verified_status(text) to service_role;


create function update_profile_on_email_confirm() returns trigger language plpgsql as $$
BEGIN
  -- Assuming 'email_confirmed_at' is set to NOT NULL only when the email is verified
  IF NEW.email_confirmed_at IS NOT NULL THEN
    INSERT INTO public.profiles (id, email, email_confirmed_at)
    VALUES (NEW.id, NEW.email, NEW.email_confirmed_at)
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        email_confirmed_at = EXCLUDED.email_confirmed_at;
    RETURN NEW;
  END IF;
  RETURN NULL; -- No operation if email is not verified
END;
$$;


alter function update_profile_on_email_confirm() owner to postgres;

grant execute on function update_profile_on_email_confirm() to anon;

grant execute on function update_profile_on_email_confirm() to authenticated;

grant execute on function update_profile_on_email_confirm() to service_role;


create procedure remove_activity(IN points_earned integer, IN deleted_group_id uuid) language plpgsql as $$
  declare hid uuid;
  Begin

  SELECT house_id INTO hid FROM Groups WHERE group_id = deleted_group_id;

  UPDATE Groups
  SET total_points = total_points - points_earned
  WHERE group_id = deleted_group_id;

  UPDATE houses
  SET total_points = total_points - points_earned
  WHERE house_id = hid;
  end;
$$;


alter procedure remove_activity(integer, uuid) owner to postgres;

grant execute on procedure remove_activity(integer, uuid) to anon;

grant execute on procedure remove_activity(integer, uuid) to authenticated;

grant execute on procedure remove_activity(integer, uuid) to service_role;


create procedure add_deduction(IN points_deducted integer, IN hid uuid, IN gid uuid) language plpgsql as $$
  BEGIN
  UPDATE houses
  SET total_points = total_points - points_deducted
  where house_id = hid;

  UPDATE groups
  SET total_points = total_points - points_deducted
  where group_id = gid;
  END
$$;


alter procedure add_deduction(integer, uuid, uuid) owner to postgres;

grant execute on procedure add_deduction(integer, uuid, uuid) to anon;

grant execute on procedure add_deduction(integer, uuid, uuid) to authenticated;

grant execute on procedure add_deduction(integer, uuid, uuid) to service_role;


create function add_points() returns trigger language plpgsql as $$DECLARE
  gr TEXT;
BEGIN

  SELECT group_role INTO gr FROM groups WHERE group_id = NEW.group_id;

  -- Update the total points in the groups table
  UPDATE groups
  SET total_points = total_points + NEW.points_earned
  WHERE group_id = NEW.group_id;


  -- Return the NEW record to indicate success
  RETURN NEW;
END;$$;


alter function add_points() owner to postgres;


create trigger on_add_activity after
insert on groupactivities
for each row execute procedure add_points();

grant execute on function add_points() to anon;

grant execute on function add_points() to authenticated;

grant execute on function add_points() to service_role;


create function remove_points() returns trigger language plpgsql as $$declare
tp int;
begin

  -- Find the house_id associated with the group_id of the newly added activity
  select total_points into tp from groups where groups.group_id = OLD.group_id;

  -- Update the total points in the groups table
  if tp - OLD.points_earned >= 0 then
  UPDATE groups
  SET total_points = total_points - OLD.points_earned
  WHERE groups.group_id = OLD.group_id;

  else
  UPDATE groups
  SET total_points = 0
  WHERE groups.group_id = OLD.group_id;

  end if;
  RETURN NEW;

  -- Return the NEW record to indicate success
end;$$;


alter function remove_points() owner to postgres;


create trigger remove_activity after
delete on groupactivities
for each row execute procedure remove_points();

grant execute on function remove_points() to anon;

grant execute on function remove_points() to authenticated;

grant execute on function remove_points() to service_role;


create function deduct_points() returns trigger language plpgsql as $$declare
role text;
deducted_role text;
BEGIN
  -- Ensure deductions only occur if the house has enough points and it's the correct house
  
  IF NEW.group_id = NEW.deducted_group_id THEN RAISE EXCEPTION 'You cannot deduct your own group!';

  end if;

  select group_role into role from groups where groups.group_id = NEW.group_id;
  select group_role into deducted_role from groups where groups.group_id = NEW.deducted_group_id;

  if deducted_role = 'bad' then raise exception 'You cannot deduct a Pro-Human group!';

  end if;
  
  if role = 'good' then raise exception 'You are not a pro-human group!';

  END IF;
      -- Deduct points from the group
    UPDATE groups
    SET total_points = total_points - NEW.points_deducted
    WHERE groups.group_id = NEW.group_id;

    -- Deduct points from the house specified in NEW.house_id
    UPDATE groups
    SET total_points = total_points - NEW.points_deducted
    WHERE groups.group_id = NEW.deducted_group_id;
    RETURN NEW;
END;$$;


alter function deduct_points() owner to postgres;


create trigger on_deduct
before
insert on deductions
for each row execute procedure deduct_points();

grant execute on function deduct_points() to anon;

grant execute on function deduct_points() to authenticated;

grant execute on function deduct_points() to service_role;


create function undo_deduction() returns trigger language plpgsql as $$BEGIN

    -- Deduct points from the group
    UPDATE groups
    SET total_points = total_points + OLD.points_deducted
    WHERE groups.group_id = OLD.group_id;

    -- Deduct points from the house specified in NEW.house_id
    UPDATE groups
    SET total_points = total_points + OLD.points_deducted
    WHERE groups.group_id = OLD.deducted_group_id;
    RETURN NEW;
END;$$;


alter function undo_deduction() owner to postgres;


create trigger on_remove_deductions after
delete on deductions
for each row execute procedure undo_deduction();

grant execute on function undo_deduction() to anon;

grant execute on function undo_deduction() to authenticated;

grant execute on function undo_deduction() to service_role;


create function get_group_data(user_id uuid) returns TABLE(group_id uuid, total_points integer, group_name character varying, email character varying) language plpgsql as $$
BEGIN
    RETURN QUERY
    SELECT g.group_id, g.total_points, g.group_name, p.email
    FROM groups g
    JOIN profiles p ON g.group_id = p.group_id
    WHERE p.id = user_id;
END;
$$;


alter function get_group_data(uuid) owner to postgres;

grant execute on function get_group_data(uuid) to anon;

grant execute on function get_group_data(uuid) to authenticated;

grant execute on function get_group_data(uuid) to service_role;


create function get_activity_data(current_group_id uuid) returns TABLE(activity_name character varying, description text, points_earned integer, tm_created timestamp with time zone) language plpgsql as $$
BEGIN
    RETURN QUERY
    SELECT a1.activity_name, a1.description, ga1.points_earned, ga1.tm_created
    FROM groupactivities ga1
    JOIN activities a1 ON ga1.activity_id = a1.activity_id -- Assuming the correct column is a1.id
    WHERE ga1.group_id = current_group_id;
END;
$$;


alter function get_activity_data(uuid) owner to postgres;

grant execute on function get_activity_data(uuid) to anon;

grant execute on function get_activity_data(uuid) to authenticated;

grant execute on function get_activity_data(uuid) to service_role;


create function get_deductions(current_group_id uuid) returns TABLE(points_deducted integer, tm_created timestamp with time zone, house_name character varying) language plpgsql as $$BEGIN
    RETURN QUERY
    SELECT d1.points_deducted, d1.tm_created, g1.group_name
    FROM deductions d1 join groups g1 on d1.deducted_group_id = g1.group_id
    where d1.group_id = current_group_id;
END;$$;


alter function get_deductions(uuid) owner to postgres;

grant execute on function get_deductions(uuid) to anon;

grant execute on function get_deductions(uuid) to authenticated;

grant execute on function get_deductions(uuid) to service_role;


create function get_awarded_games(gm_id uuid) returns
SETOF record language sql as $$SELECT *
FROM groupactivities ga1
JOIN groups g1 on g1.group_id = ga1.group_id
JOIN activities a1 on a1.activity_id = ga1.activity_id
where ga1.gm_id = get_awarded_games.gm_id;$$;


alter function get_awarded_games(uuid) owner to postgres;

grant execute on function get_awarded_games(uuid) to anon;

grant execute on function get_awarded_games(uuid) to authenticated;

grant execute on function get_awarded_games(uuid) to service_role;


create function get_profile() returns record language plpgsql as $$
declare
result_record record;
begin
select * into result_record from profiles natural join roles where id = auth.uid();

if found then
return result_record;
else
return null;

end if;
end;
$$;


alter function get_profile() owner to postgres;

grant execute on function get_profile() to anon;

grant execute on function get_profile() to authenticated;

grant execute on function get_profile() to service_role;


create function fetch_messages(input_channel text) returns TABLE(message_id uuid, user_id uuid, message text, tm_created timestamp with time zone, channel text, email character varying, profile_name text) language plpgsql as $$
BEGIN
  RETURN QUERY SELECT
      m.message_id,
      m.user_id,
      m.message,
      m.tm_created,
      m.channel,
      p.email,
      p.profile_name
    FROM messages m
    JOIN profiles p ON m.user_id = p.id
    WHERE m.channel = input_channel;
END;
$$;


alter function fetch_messages(text) owner to postgres;

grant execute on function fetch_messages(text) to anon;

grant execute on function fetch_messages(text) to authenticated;

grant execute on function fetch_messages(text) to service_role;


create function fetch_private_messages(input_channel text) returns TABLE(message_id uuid, user_id uuid, message text, tm_created timestamp with time zone, channel text, email character varying, profile_name text) language plpgsql as $$
BEGIN
  RETURN QUERY SELECT
      m.message_id,
      m.user_id,
      m.message,
      m.tm_created,
      m.channel,
      p.email,
      p.profile_name
    FROM private_messages m
    JOIN profiles p ON m.user_id = p.id
    WHERE m.channel = input_channel;
END;
$$;


alter function fetch_private_messages(text) owner to postgres;

grant execute on function fetch_private_messages(text) to anon;

grant execute on function fetch_private_messages(text) to authenticated;

grant execute on function fetch_private_messages(text) to service_role;


create function update_group_points_and_role() returns trigger language plpgsql as $$DECLARE
  hid UUID;
  points_changed INT;
BEGIN
  -- Ensure total_points is not negative for the new group
  IF NEW.total_points < 0 THEN
    NEW.total_points := 0;
  END IF;

  -- Find the house_id associated with the group_id of the newly added activity
  SELECT house_id INTO hid FROM groups WHERE group_id = NEW.group_id;

  -- Calculate the points changed
  points_changed := NEW.total_points - OLD.total_points;

  IF NEW.group_role = 'good' THEN
    -- Increment total_points in houses table
    UPDATE houses
    SET total_points = houses.total_points + points_changed
    WHERE house_id = hid;

    -- Ensure houses.total_points is not negative
    UPDATE houses
    SET total_points = 0
    WHERE house_id = hid AND total_points < 0;

  ELSIF NEW.group_role = 'bad' THEN
    -- Increment pro_human_points in houses table
    UPDATE houses
    SET pro_human_points = houses.pro_human_points + points_changed
    WHERE house_id = hid;
  END IF;

  -- Handle group role changes
  IF OLD.group_role = 'good' AND NEW.group_role = 'bad' THEN
    UPDATE houses
    SET total_points = houses.total_points - (SELECT total_points FROM groups WHERE group_id = OLD.group_id),
        pro_human_points = houses.pro_human_points + (SELECT total_points FROM groups WHERE group_id = OLD.group_id)
    WHERE house_id = hid;

    -- Ensure houses.total_points is not negative
    UPDATE houses
    SET total_points = 0
    WHERE house_id = hid AND total_points < 0;

  ELSIF OLD.group_role = 'bad' AND NEW.group_role = 'good' THEN
    UPDATE houses
    SET total_points = houses.total_points + (SELECT total_points FROM groups WHERE group_id = OLD.group_id),
        pro_human_points = houses.pro_human_points - (SELECT total_points FROM groups WHERE group_id = OLD.group_id)
    WHERE house_id = hid;

    -- Ensure houses.total_points is not negative
    UPDATE houses
    SET total_points = 0
    WHERE house_id = hid AND total_points < 0;
  END IF;

  RETURN NEW;
END;$$;


alter function update_group_points_and_role() owner to postgres;


create trigger group_points_change
before
update on groups
for each row execute procedure update_group_points_and_role();

grant execute on function update_group_points_and_role() to anon;

grant execute on function update_group_points_and_role() to authenticated;

grant execute on function update_group_points_and_role() to service_role;


create function update_group_activity() returns trigger language plpgsql as $$DECLARE
  hid UUID;
  points_changed INT;
  tp int;
BEGIN
  IF NEW.points_earned < 0 THEN
    RAISE EXCEPTION 'Points cannot be negative';
  END IF;
  -- Find the house_id associated with the group_id of the newly added activity
  SELECT house_id INTO hid FROM groups WHERE group_id = NEW.group_id;

  -- Calculate the points changed
  points_changed := NEW.points_earned - OLD.points_earned;

    IF OLD.group_id = NEW.group_id then

      SELECT total_points INTO tp FROM groups WHERE group_id = OLD.group_id;

      IF tp + points_changed < 0 then
          UPDATE groups
    SET total_points = 0
    WHERE groups.group_id = NEW.group_id;

 else

    UPDATE groups
    SET total_points = groups.total_points + points_changed
    WHERE groups.group_id = NEW.group_id;

end if;

    else

        UPDATE groups
    SET total_points = groups.total_points + NEW.points_earned
    WHERE groups.group_id = NEW.group_id;


          SELECT total_points INTO tp FROM groups WHERE group_id = OLD.group_id;

          if tp - old.points_earned < 0 then



    UPDATE groups
    SET total_points = 0
    WHERE groups.group_id = OLD.group_id;

    else




    UPDATE groups
    SET total_points = groups.total_points -OLD.points_earned
    WHERE groups.group_id = OLD.group_id;

    end if;

    end if;

  RETURN NEW;
END;$$;


alter function update_group_activity() owner to postgres;


create trigger update_group_activity_trigger
before
update on groupactivities
for each row execute procedure update_group_activity();

grant execute on function update_group_activity() to anon;

grant execute on function update_group_activity() to authenticated;

grant execute on function update_group_activity() to service_role;


create function update_deduction() returns trigger language plpgsql as $$DECLARE
  points_changed INT;
  role text;
  deducted_role text;
  tp int;
  deducted_tp int;
BEGIN
  IF NEW.points_deducted < 0 THEN
    RAISE EXCEPTION 'Deducted points cannot be negative';
  END IF;
  -- Find the house_id associated with the group_id of the newly added activity
  SELECT group_role INTO role FROM groups WHERE group_id = NEW.group_id;
  SELECT group_role INTO deducted_role FROM groups WHERE group_id = NEW.deducted_group_id;


  if deducted_role = 'bad' or role = 'good' then
  raise exception 'You are deducting a pro-human group or you are not a pro-human group';
  end if;

  SELECT total_points INTO tp FROM groups WHERE group_id = NEW.group_id;
  points_changed := NEW.points_deducted - OLD.points_deducted;
  SELECT total_points INTO deducted_tp FROM groups WHERE group_id = NEW.deducted_group_id;

  if old.group_id = new.group_id then
  if tp - points_changed < 0 then raise exception 'Insufficient points to deduct';
  end if;
    UPDATE groups
    SET total_points = groups.total_points - points_changed
    WHERE groups.group_id = new.group_id;
end if;

  if old.group_id <> new.group_id then
  if tp - new.points_deducted < 0 then raise exception 'Insufficient points to deduct';
  end if;
    UPDATE groups
    SET total_points = groups.total_points - new.points_deducted
    WHERE groups.group_id = new.group_id;

    UPDATE groups
    SET total_points = groups.total_points +  old.points_deducted
    WHERE groups.group_id = old.group_id;
end if;



  if old.deducted_group_id = new.deducted_group_id then
  if deducted_tp - points_changed < 0 then raise exception 'Deduction will result in negative points for deducted group';
  end if;
    UPDATE groups
    SET total_points = groups.total_points - points_changed
    WHERE groups.group_id = new.deducted_group_id;
end if;

  if old.deducted_group_id <> new.deducted_group_id then
  if deducted_tp - NEW.points_deducted < 0 then raise exception 'Deduction will result in negative points for deducted group';
  end if;
    UPDATE groups
    SET total_points = groups.total_points - NEW.points_deducted
    WHERE groups.group_id = new.deducted_group_id;

    UPDATE groups
    SET total_points = groups.total_points + OLD.points_deducted
    WHERE groups.group_id = old.deducted_group_id;
end if;


  RETURN NEW;
END;$$;


alter function update_deduction() owner to postgres;


create trigger update_deduction_trigger
before
update on deductions
for each row execute procedure update_deduction();

grant execute on function update_deduction() to anon;

grant execute on function update_deduction() to authenticated;

grant execute on function update_deduction() to service_role;


create function stop_manual_profile_insert() returns trigger language plpgsql as $$
begin

if not exists (
  select 1 from auth.users u where u.email = new.email
) then
raise exception 'You can only add users using supabase auth';
else
return new;
end if;
end;
$$;


alter function stop_manual_profile_insert() owner to postgres;


create trigger stop_manual_profile_insert_trigger
before
insert on profiles
for each row execute procedure stop_manual_profile_insert();

grant execute on function stop_manual_profile_insert() to anon;

grant execute on function stop_manual_profile_insert() to authenticated;

grant execute on function stop_manual_profile_insert() to service_role;


create function stop_manual_profile_delete() returns trigger language plpgsql as $$
begin

if exists (
  select 1 from auth.users u where u.email = old.email
) then
raise exception 'You can only delete users using supabase auth';
else
return old;
end if;
end;
$$;


alter function stop_manual_profile_delete() owner to postgres;


create trigger stop_manual_profile_delete_trigger
before
delete on profiles
for each row execute procedure stop_manual_profile_delete();

grant execute on function stop_manual_profile_delete() to anon;

grant execute on function stop_manual_profile_delete() to authenticated;

grant execute on function stop_manual_profile_delete() to service_role;


create function findroom(id uuid) returns TABLE(match_id uuid, usersid uuid[]) language plpgsql as $$DECLARE
  match_found BOOLEAN;
  found_match_id UUID;
  found_usersid UUID[];
BEGIN
  -- Check if there is an existing room
  SELECT m.match_id, m.usersid
  INTO found_match_id, found_usersid
  FROM matches m
  WHERE NOT (id = ANY(m.usersid)) AND array_length(m.usersid, 1) = 1 AND is_ongoing = true
  LIMIT 1;

  -- Determine if a match was found
  match_found := found_match_id IS NOT NULL;

  IF match_found THEN
    -- Update the first matching row by appending the id to the usersid array
    UPDATE matches
    SET usersid = array_append(matches.usersid, id)
    WHERE matches.match_id = found_match_id
    RETURNING matches.match_id, matches.usersid
    INTO found_match_id, found_usersid;
  ELSE
    -- Insert a new row if no matching room was found
    INSERT INTO matches (usersid)
    VALUES (ARRAY[id])
    RETURNING matches.match_id, matches.usersid
    INTO found_match_id, found_usersid;
  END IF;

  -- Return the result
  RETURN QUERY SELECT found_match_id, found_usersid;
END;$$;


alter function findroom(uuid) owner to postgres;

grant execute on function findroom(uuid) to anon;

grant execute on function findroom(uuid) to authenticated;

grant execute on function findroom(uuid) to service_role;


create function leaveroom(id uuid) returns TABLE(match_id uuid, usersid uuid[]) language plpgsql as $$DECLARE
    -- Declare a variable to store the match ID and usersid array of the row being processed
    match_row RECORD;
BEGIN
    -- Iterate through all rows in the matches table
    FOR match_row IN SELECT m.match_id, m.usersid FROM matches m LOOP
        -- Check if the user ID exists in the usersid array of the current row
        IF id = ANY (match_row.usersid) THEN
            -- Check the length of the usersid array
            IF array_length(match_row.usersid, 1) = 2 THEN
                -- Set is_ongoing to false if the usersid array has a length of 2
                UPDATE matches
                SET is_ongoing = false
                WHERE matches.match_id = match_row.match_id;

                -- Return the modified row (for the purpose of the RETURNS TABLE)
                RETURN QUERY SELECT match_row.match_id, match_row.usersid;
            ELSE
                -- Remove the user ID from the usersid array
                match_row.usersid := array_remove(match_row.usersid, id);

                -- Check if the usersid array is now empty
                IF array_length(match_row.usersid, 1) IS NULL THEN
                    -- Delete the row if the usersid array is empty
                    DELETE FROM matches WHERE matches.match_id = match_row.match_id;
                ELSE
                    -- Update the row with the modified usersid array
                    UPDATE matches
                    SET usersid = match_row.usersid
                    WHERE matches.match_id = match_row.match_id;
                END IF;

                -- Return the modified row (for the purpose of the RETURNS TABLE)
                RETURN QUERY SELECT match_row.match_id, match_row.usersid;
            END IF;
        END IF;
    END LOOP;

    -- If no match is found, return an empty result
    RETURN;
END;$$;


alter function leaveroom(uuid) owner to postgres;

grant execute on function leaveroom(uuid) to anon;

grant execute on function leaveroom(uuid) to authenticated;

grant execute on function leaveroom(uuid) to service_role;


create function checkmatchedcorrectly() returns trigger language plpgsql as $$
BEGIN
    -- Check that the length of the usersid array is less than or equal to 2
    IF array_length(NEW.usersid, 1) > 2 THEN
        RAISE EXCEPTION 'The usersid array cannot contain more than 2 elements';
    END IF;

    RETURN NEW;
END;
$$;


alter function checkmatchedcorrectly() owner to postgres;


create trigger validate_usersid_length
before
insert
or
update on matches
for each row execute procedure checkmatchedcorrectly();

grant execute on function checkmatchedcorrectly() to anon;

grant execute on function checkmatchedcorrectly() to authenticated;

grant execute on function checkmatchedcorrectly() to service_role;


create function prevent_group_delete() returns trigger language plpgsql as $$
BEGIN
    RAISE EXCEPTION 'Deletion from this table is not allowed';
    RETURN NULL;
END;
$$;


alter function prevent_group_delete() owner to postgres;


create trigger prevent_house_delete
before
delete on houses
for each row execute procedure prevent_group_delete();


create trigger prevent_group_delete
before
delete on groups
for each row execute procedure prevent_group_delete();


create trigger prevent_role_delete
before
delete on roles
for each row execute procedure prevent_group_delete();


create trigger prevent_channel_delete
before
delete on channels
for each row execute procedure prevent_group_delete();


create trigger prevent_group_role_delete
before
delete on group_roles
for each row execute procedure prevent_group_delete();

grant execute on function prevent_group_delete() to anon;

grant execute on function prevent_group_delete() to authenticated;

grant execute on function prevent_group_delete() to service_role;


create function update_group_points() returns trigger language plpgsql as $$DECLARE
  hid UUID;
  gr TEXT;
BEGIN
  -- Find the house_id associated with the group_id of the newly added activity
  SELECT house_id INTO hid FROM groups WHERE group_id = NEW.group_id;
  RAISE NOTICE 'house_id found: %', hid;

  -- Find the group_role associated with the group_id of the newly added activity
  SELECT group_role INTO gr FROM groups WHERE group_id = NEW.group_id;
  RAISE NOTICE 'group_role found: %', gr;

  -- Update the total points in the groups table
  UPDATE groups
  SET total_points = total_points + NEW.points_earned
  WHERE group_id = NEW.group_id;
  RAISE NOTICE 'Updated total points for group_id % by % points', NEW.group_id, NEW.points_earned;

  -- Check if total_points is negative and set it to 0 if it is
  UPDATE groups
  SET total_points = 0
  WHERE group_id = NEW.group_id AND total_points < 0;
  RAISE NOTICE 'Adjusted total points for group_id % to 0 due to negative value', NEW.group_id;

  -- Return the NEW record to indicate success
  RETURN NEW;
END;$$;


alter function update_group_points() owner to postgres;

grant execute on function update_group_points() to anon;

grant execute on function update_group_points() to authenticated;

grant execute on function update_group_points() to service_role;


create function prevent_house_insertion() returns trigger language plpgsql as $$
BEGIN
    RAISE EXCEPTION 'Inserting into the houses table is not allowed';
    RETURN NULL;
END;
$$;


alter function prevent_house_insertion() owner to postgres;


create trigger prevent_insert_on_houses
before
insert on houses
for each row execute procedure prevent_house_insertion();

grant execute on function prevent_house_insertion() to anon;

grant execute on function prevent_house_insertion() to authenticated;

grant execute on function prevent_house_insertion() to service_role;


create function prevent_group_insertion() returns trigger language plpgsql as $$
BEGIN
    RAISE EXCEPTION 'Inserting into the groups table is not allowed';
    RETURN NULL;
END;
$$;


alter function prevent_group_insertion() owner to postgres;


create trigger prevent_insert_on_groups
before
insert on groups
for each row execute procedure prevent_group_insertion();

grant execute on function prevent_group_insertion() to anon;

grant execute on function prevent_group_insertion() to authenticated;

grant execute on function prevent_group_insertion() to service_role;


create function prevent_role_insertion() returns trigger language plpgsql as $$
BEGIN
    RAISE EXCEPTION 'Inserting into the roles table is not allowed';
    RETURN NULL;
END;
$$;


alter function prevent_role_insertion() owner to postgres;


create trigger prevent_insert_on_roles
before
insert on roles
for each row execute procedure prevent_role_insertion();

grant execute on function prevent_role_insertion() to anon;

grant execute on function prevent_role_insertion() to authenticated;

grant execute on function prevent_role_insertion() to service_role;


create function prevent_group_role_insertion() returns trigger language plpgsql as $$
BEGIN
    RAISE EXCEPTION 'Inserting into the group_roles table is not allowed';
    RETURN NULL;
END;
$$;


alter function prevent_group_role_insertion() owner to postgres;


create trigger prevent_insert_on_group_roles
before
insert on group_roles
for each row execute procedure prevent_group_role_insertion();

grant execute on function prevent_group_role_insertion() to anon;

grant execute on function prevent_group_role_insertion() to authenticated;

grant execute on function prevent_group_role_insertion() to service_role;


create function prevent_message_update() returns trigger language plpgsql as $$
BEGIN
    IF NEW.message IS DISTINCT FROM OLD.message THEN
        RAISE EXCEPTION 'Updating the message attribute is not allowed';
    END IF;
    RETURN NEW;
END;
$$;


alter function prevent_message_update() owner to postgres;


create trigger prevent_message_update_trigger
before
update on messages
for each row execute procedure prevent_message_update();

grant execute on function prevent_message_update() to anon;

grant execute on function prevent_message_update() to authenticated;

grant execute on function prevent_message_update() to service_role;


create function check_total_points() returns trigger language plpgsql as $$
BEGIN
    IF NEW.total_points < 0 THEN
        RAISE EXCEPTION 'Total points cannot be less than 0';
    END IF;

        IF NEW.pro_human_points < 0 THEN
        RAISE EXCEPTION 'Pro human points cannot be less than 0';
    END IF;
    RETURN NEW;
END;
$$;


alter function check_total_points() owner to postgres;


create trigger check_total_points_before_update
before
update on houses
for each row execute procedure check_total_points();

grant execute on function check_total_points() to anon;

grant execute on function check_total_points() to authenticated;

grant execute on function check_total_points() to service_role;


create function check_total_group_points() returns trigger language plpgsql as $$
BEGIN
    IF NEW.total_points < 0 THEN
        RAISE EXCEPTION 'Total points cannot be less than 0';
    END IF;
    RETURN NEW;
END;
$$;


alter function check_total_group_points() owner to postgres;


create trigger check_total_group_points_before_update
before
update on groups
for each row execute procedure check_total_group_points();

grant execute on function check_total_group_points() to anon;

grant execute on function check_total_group_points() to authenticated;

grant execute on function check_total_group_points() to service_role;

