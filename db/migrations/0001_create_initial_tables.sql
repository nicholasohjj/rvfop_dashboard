-- Create houses table
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

-- Create groups table
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


-- Create activities table
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


-- Create groupactivities table
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


-- Create deductions table
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

-- Create profiles table
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

