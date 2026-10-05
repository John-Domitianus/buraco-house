
create type public.app_role as enum ('admin','user');

create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path=public as $$ begin new.updated_at=now(); return new; end $$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null,
  avatar_url text,
  credits int not null default 1000,
  created_at timestamptz not null default now()
);
grant select, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique(user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role) returns boolean
language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.user_roles where user_id=_user_id and role=_role) $$;

create policy "own roles" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "own profile read" on public.profiles for select to authenticated using (id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "own profile update" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- prevent users from editing their own credits
create or replace function public.protect_credits() returns trigger language plpgsql set search_path=public as $$
begin
  if new.credits <> old.credits and current_setting('app.allow_credits', true) is distinct from 'on' and not public.has_role(auth.uid(),'admin') then
    new.credits := old.credits;
  end if;
  return new;
end $$;
create trigger profiles_protect_credits before update on public.profiles for each row execute function public.protect_credits();

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(id, nickname) values (new.id, coalesce(nullif(new.raw_user_meta_data->>'nickname',''), split_part(new.email,'@',1)));
  insert into public.user_roles(user_id, role) values (new.id,'user');
  if not exists (select 1 from public.user_roles where role='admin') then
    insert into public.user_roles(user_id, role) values (new.id,'admin');
  end if;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- settings (single row)
create table public.site_settings (
  id int primary key default 1 check (id = 1),
  store_name text not null default 'Mafia Store',
  hero_title text not null default 'Pokémon, leilões e oportunidades para sua jornada.',
  hero_description text not null default 'A central da nossa comunidade Cobblemon: acompanhe leilões, conheça a equipe, veja o ranking e teste sua sorte.',
  footer_tagline text not null default 'Uma plataforma criada para a comunidade de Cobblemon.',
  discord_server_url text not null default 'DISCORD_SERVER_URL',
  how_it_works jsonb not null default '[{"title":"Escolha o que deseja","description":"Explore os leilões e as ofertas disponíveis."},{"title":"Participe da negociação","description":"Dê seu lance no leilão ou negocie com a equipe."},{"title":"Fale pelo Discord","description":"Confirme os detalhes com um colaborador."},{"title":"Receba no servidor","description":"Sua compra é entregue dentro do jogo."}]'::jsonb,
  spin_cost int not null default 100,
  updated_at timestamptz not null default now()
);
grant select on public.site_settings to anon, authenticated;
grant update on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "settings public read" on public.site_settings for select using (true);
create policy "settings admin update" on public.site_settings for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
insert into public.site_settings(id) values (1);

create table public.collaborators (
  id uuid primary key default gen_random_uuid(),
  nickname text not null,
  name text,
  role text not null,
  description text,
  avatar_url text,
  discord_url text,
  display_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.auctions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  starts_at timestamptz not null,
  responsible text,
  location text,
  discord_url text,
  status text not null default 'scheduled' check (status in ('scheduled','live','ended')),
  image_url text,
  extra_info text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.auction_items (
  id uuid primary key default gen_random_uuid(),
  auction_id uuid not null references public.auctions(id) on delete cascade,
  name text not null,
  rarity text not null default 'Comum',
  info text,
  image_url text,
  starting_price numeric,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.rankings (
  id uuid primary key default gen_random_uuid(),
  nickname text not null,
  avatar_url text,
  total_spent numeric not null default 0,
  purchases int not null default 0,
  period text not null default 'total' check (period in ('month','quarter','total')),
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  image_url text,
  category text not null default 'Geral',
  published_at date not null default current_date,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.roulette_prizes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text,
  rarity text not null default 'Comum',
  probability numeric not null default 10 check (probability >= 0),
  color text not null default 'violet',
  active boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.roulette_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  nickname text not null,
  prize_id uuid references public.roulette_prizes(id) on delete set null,
  prize_name text not null,
  rarity text,
  created_at timestamptz not null default now()
);

do $$ declare t text; begin
  foreach t in array array['collaborators','auctions','auction_items','rankings','news','roulette_prizes'] loop
    execute format('grant select on public.%I to anon, authenticated', t);
    execute format('grant insert, update, delete on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "admin manage %s" on public.%I for all to authenticated using (public.has_role(auth.uid(),''admin'')) with check (public.has_role(auth.uid(),''admin''))', t, t);
  end loop;
end $$;

create policy "public collaborators" on public.collaborators for select using (active);
create policy "public auctions" on public.auctions for select using (true);
create policy "public auction items" on public.auction_items for select using (true);
create policy "public rankings" on public.rankings for select using (true);
create policy "public news" on public.news for select using (published);
create policy "public prizes" on public.roulette_prizes for select using (active);

grant select on public.roulette_results to anon, authenticated;
grant all on public.roulette_results to service_role;
alter table public.roulette_results enable row level security;
create policy "public results" on public.roulette_results for select using (true);

do $$ declare t text; begin
  foreach t in array array['collaborators','auctions','rankings','news','roulette_prizes','site_settings'] loop
    execute format('create trigger touch_%s before update on public.%I for each row execute function public.touch_updated_at()', t, t);
  end loop;
end $$;

-- secure spin
create or replace function public.spin_roulette() returns json language plpgsql security definer set search_path=public as $$
declare uid uuid := auth.uid(); cost int; bal int; nick text; total numeric; r numeric; acc numeric := 0; p record; chosen record;
begin
  if uid is null then raise exception 'Faça login para girar'; end if;
  select spin_cost into cost from site_settings where id=1;
  select credits, nickname into bal, nick from profiles where id=uid for update;
  if bal < cost then raise exception 'Créditos insuficientes'; end if;
  select sum(probability) into total from roulette_prizes where active;
  if total is null or total <= 0 then raise exception 'Nenhum prêmio ativo'; end if;
  r := random() * total;
  for p in select * from roulette_prizes where active order by display_order, created_at loop
    acc := acc + p.probability;
    if chosen.id is null and r < acc then chosen := p; end if;
  end loop;
  if chosen.id is null then select * into chosen from roulette_prizes where active order by display_order desc limit 1; end if;
  perform set_config('app.allow_credits','on',true);
  update profiles set credits = credits - cost where id=uid;
  insert into roulette_results(user_id,nickname,prize_id,prize_name,rarity) values (uid,nick,chosen.id,chosen.name,chosen.rarity);
  return json_build_object('prize_id',chosen.id,'prize_name',chosen.name,'rarity',chosen.rarity,'credits',bal-cost);
end $$;
revoke execute on function public.spin_roulette() from anon, public;
grant execute on function public.spin_roulette() to authenticated;

-- demo data
insert into public.collaborators(nickname,name,role,description,discord_url,display_order) values
('ExemploAdmin','(Demonstração)','Administrador','Responsável pela administração da loja.','COLLABORATOR_DISCORD_URL',1),
('ExemploVendas',null,'Vendedor','Cuida das negociações e entregas no servidor.','COLLABORATOR_DISCORD_URL',2),
('ExemploLeiloeiro',null,'Leiloeiro','Organiza e conduz os leilões semanais.','COLLABORATOR_DISCORD_URL',3);

with a as (insert into public.auctions(name,description,starts_at,responsible,location,discord_url,status,extra_info) values
('Leilão de Pokémon Raros (Demo)','Leilão demonstrativo com Pokémon raros e shinies.', now() + interval '2 days 4 hours','ExemploLeiloeiro','Spawn principal do servidor','AUCTION_DISCORD_URL','scheduled','Lances mínimos de 10% sobre o anterior.') returning id)
insert into public.auction_items(auction_id,name,rarity,info,starting_price,display_order)
select id, x.n, x.r, x.i, x.p, x.o from a, (values ('Dragonite Shiny','Lendário','IVs 6x31, natureza Adamant',500,1),('Gardevoir','Raro','Habilidade oculta',200,2),('Egg F5','Épico','Ovo com 5 IVs perfeitos',150,3)) as x(n,r,i,p,o);

insert into public.auctions(name,description,starts_at,responsible,location,discord_url,status) values
('Leilão de Abertura (Demo)','Primeiro leilão demonstrativo da loja.', now() - interval '14 days','ExemploAdmin','Spawn principal','AUCTION_DISCORD_URL','ended'),
('Leilão Shiny Week (Demo)','Semana dedicada a shinies.', now() - interval '7 days','ExemploLeiloeiro','Arena','AUCTION_DISCORD_URL','ended');

insert into public.rankings(nickname,total_spent,purchases,period,is_demo) values
('JogadorExemplo1',1200,14,'total',true),('JogadorExemplo2',950,11,'total',true),('JogadorExemplo3',720,9,'total',true),('JogadorExemplo4',500,6,'total',true),('JogadorExemplo5',310,4,'total',true),
('JogadorExemplo2',300,4,'month',true),('JogadorExemplo1',250,3,'month',true),('JogadorExemplo4',120,2,'month',true),
('JogadorExemplo1',700,8,'quarter',true),('JogadorExemplo3',540,6,'quarter',true),('JogadorExemplo2',410,5,'quarter',true),('JogadorExemplo5',200,3,'quarter',true);

insert into public.news(title,description,category,published_at) values
('Novo leilão anunciado','Um novo leilão de Pokémon raros foi agendado. Confira os detalhes na página de leilões.','Leilões',current_date),
('Novos Pokémon disponíveis','Chegaram novos Pokémon ao catálogo da loja. Fale com um colaborador no Discord.','Loja',current_date - 3),
('Evento especial chegando','Prepare-se: um evento especial da comunidade está a caminho.','Eventos',current_date - 6);

insert into public.roulette_prizes(name,rarity,probability,color,display_order) values
('Nada','Comum',35,'zinc',1),('Desconto 10%','Comum',25,'sky',2),('Egg F5','Raro',18,'emerald',3),('Pokémon raro','Épico',12,'violet',4),('Prêmio especial','Lendário',8,'amber',5),('Jackpot','Mítico',2,'rose',6);
