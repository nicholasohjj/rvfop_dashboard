create table houses
(
    house_id     uuid         default uuid_generate_v4()    not null
        primary key,
    name         varchar(255) default ''::character varying not null
        unique,
    total_points integer      default 0
);

alter table houses
    owner to postgres;

grant delete, insert, references, select, trigger, truncate, update on houses to anon;

grant delete, insert, references, select, trigger, truncate, update on houses to authenticated;

grant delete, insert, references, select, trigger, truncate, update on houses to service_role;

create table groups
(
    group_id     uuid    default uuid_generate_v4() not null
        primary key,
    name         varchar(255)                       not null
        unique,
    house_id     uuid                               not null
        references houses
            on update cascade on delete restrict,
    total_points integer default 0,
    isprohuman   boolean default false
);

alter table groups
    owner to postgres;

grant delete, insert, references, select, trigger, truncate, update on groups to anon;

grant delete, insert, references, select, trigger, truncate, update on groups to authenticated;

grant delete, insert, references, select, trigger, truncate, update on groups to service_role;

create table activities
(
    activity_id uuid    default uuid_generate_v4() not null
        constraint activity_pkey
            primary key,
    name        varchar(255)                       not null
        unique,
    points      integer default 0
        constraint activity_points_check
            check (points >= 0),
    description text
);

alter table activities
    owner to postgres;

grant delete, insert, references, select, trigger, truncate, update on activities to anon;

grant delete, insert, references, select, trigger, truncate, update on activities to authenticated;

grant delete, insert, references, select, trigger, truncate, update on activities to service_role;

create table groupactivities
(
    group_id          uuid                                                not null
        references groups,
    activity_id       uuid                                                not null
        references activities,
    completion_status boolean                  default false,
    points_earned     integer                  default 0,
    tm_created        timestamp with time zone default ((now() AT TIME ZONE 'utc'::text) AT TIME ZONE 'Asia/Singapore'::text),
    group_activity_id uuid                     default uuid_generate_v4() not null
        primary key
);

alter table groupactivities
    owner to postgres;

grant delete, insert, references, select, trigger, truncate, update on groupactivities to anon;

grant delete, insert, references, select, trigger, truncate, update on groupactivities to authenticated;

grant delete, insert, references, select, trigger, truncate, update on groupactivities to service_role;

create table deductions
(
    group_id        uuid                                                                                     not null
        references groups,
    deductor_id     uuid                                                                                     not null
        references groups,
    points_deducted integer   default 0                                                                      not null
        constraint deductions_points_deducted_check
            check (points_deducted <= 0),
    tm_created      timestamp default ((now() AT TIME ZONE 'utc'::text) AT TIME ZONE 'Asia/Singapore'::text) not null,
    name            text      default ''::text,
    deduction_id    uuid      default uuid_generate_v4()                                                     not null
        primary key
);

alter table deductions
    owner to postgres;

grant delete, insert, references, select, trigger, truncate, update on deductions to anon;

grant delete, insert, references, select, trigger, truncate, update on deductions to authenticated;

grant delete, insert, references, select, trigger, truncate, update on deductions to service_role;

create table profiles
(
    id       uuid    not null
        primary key
        references ??? ()
        on delete cascade,
    email    varchar not null,
    house_id uuid
        references houses
            on update cascade on delete cascade,
    group_id uuid
        references groups
            on update cascade on delete cascade
);

alter table profiles
    owner to postgres;

create policy "Public profiles are viewable by everyone." on profiles
    as permissive
    for select
    using true;

create policy "Users can insert their own profile." on profiles
    as permissive
    for insert
    with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
    as permissive
    for update
    using (auth.uid() = id);

grant delete, insert, references, select, trigger, truncate, update on profiles to anon;

grant delete, insert, references, select, trigger, truncate, update on profiles to authenticated;

grant delete, insert, references, select, trigger, truncate, update on profiles to service_role;

create function handle_new_user() returns trigger
    security definer
    SET search_path = public
    language plpgsql
as
$$
begin
    -- missing source code
end;
$$;

alter function handle_new_user() owner to postgres;

grant execute on function handle_new_user() to anon;

grant execute on function handle_new_user() to authenticated;

grant execute on function handle_new_user() to service_role;

create function update_points_after_activity() returns trigger
    language plpgsql
as
$$
begin
    -- missing source code
end;
$$;

alter function update_points_after_activity() owner to postgres;

create trigger trigger_update_points_after_activity
    after insert
    on groupactivities
    for each row
execute procedure update_points_after_activity();

grant execute on function update_points_after_activity() to anon;

grant execute on function update_points_after_activity() to authenticated;

grant execute on function update_points_after_activity() to service_role;

create function check_isprohuman() returns trigger
    language plpgsql
as
$$
begin
    -- missing source code
end;
$$;

alter function check_isprohuman() owner to postgres;

create trigger trigger_check_isprohuman
    before insert or update
    on deductions
    for each row
execute procedure check_isprohuman();

grant execute on function check_isprohuman() to anon;

grant execute on function check_isprohuman() to authenticated;

grant execute on function check_isprohuman() to service_role;

create function update_points_after_deduction() returns trigger
    language plpgsql
as
$$
begin
    -- missing source code
end;
$$;

alter function update_points_after_deduction() owner to postgres;

create trigger trigger_update_points_after_deduction
    after insert or update
    on deductions
    for each row
execute procedure update_points_after_deduction();

grant execute on function update_points_after_deduction() to anon;

grant execute on function update_points_after_deduction() to authenticated;

grant execute on function update_points_after_deduction() to service_role;

