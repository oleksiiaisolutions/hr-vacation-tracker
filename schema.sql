-- Create Employees Table
create table employees (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  birthday text not null, -- Format: DD-MM
  start_date date not null    -- Format: YYYY-MM-DD
);

-- Create Requests Table
create table requests (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  employee_id uuid references employees(id) on delete cascade not null,
  date date not null,         -- Format: YYYY-MM-DD
  days int not null
);

-- Enable Row Level Security (RLS)
alter table employees enable row level security;
alter table requests enable row level security;

-- Create Policies (Public Access for Demo)
-- WARNING: In a real app, you'd want authenticated access.
create policy "Enable read access for all users" on employees for select using (true);
create policy "Enable insert access for all users" on employees for insert with check (true);
create policy "Enable delete access for all users" on employees for delete using (true);

create policy "Enable read access for all users" on requests for select using (true);
create policy "Enable insert access for all users" on requests for insert with check (true);
create policy "Enable delete access for all users" on requests for delete using (true);


