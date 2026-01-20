--
-- PostgreSQL database dump
--

\restrict FJfsIMxzjjU0ToVI75dKqgs5xGBh8Jl9bOaYeH0hgaimNtu56jTDm2Cet64NGyI

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: clients; Type: TABLE; Schema: public; Owner: egauser
--

CREATE TABLE public.clients (
    id bigint NOT NULL,
    adresse character varying(200) NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    date_naissance date NOT NULL,
    email character varying(100) NOT NULL,
    nationalite character varying(50) NOT NULL,
    nom character varying(50) NOT NULL,
    prenom character varying(50) NOT NULL,
    sexe character varying(1) NOT NULL,
    telephone character varying(20) NOT NULL,
    updated_at timestamp(6) without time zone,
    user_id bigint
);


ALTER TABLE public.clients OWNER TO egauser;

--
-- Name: clients_id_seq; Type: SEQUENCE; Schema: public; Owner: egauser
--

CREATE SEQUENCE public.clients_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.clients_id_seq OWNER TO egauser;

--
-- Name: clients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: egauser
--

ALTER SEQUENCE public.clients_id_seq OWNED BY public.clients.id;


--
-- Name: comptes; Type: TABLE; Schema: public; Owner: egauser
--

CREATE TABLE public.comptes (
    id bigint NOT NULL,
    date_creation timestamp(6) without time zone NOT NULL,
    date_modification timestamp(6) without time zone,
    numero_compte character varying(34) NOT NULL,
    solde numeric(15,2) NOT NULL,
    type character varying(255) NOT NULL,
    client_id bigint NOT NULL,
    CONSTRAINT comptes_type_check CHECK (((type)::text = ANY ((ARRAY['EPARGNE'::character varying, 'COURANT'::character varying])::text[])))
);


ALTER TABLE public.comptes OWNER TO egauser;

--
-- Name: comptes_courant; Type: TABLE; Schema: public; Owner: egauser
--

CREATE TABLE public.comptes_courant (
    decouvert_autorise numeric(15,2),
    id bigint NOT NULL
);


ALTER TABLE public.comptes_courant OWNER TO egauser;

--
-- Name: comptes_epargne; Type: TABLE; Schema: public; Owner: egauser
--

CREATE TABLE public.comptes_epargne (
    taux_interet numeric(5,2),
    id bigint NOT NULL
);


ALTER TABLE public.comptes_epargne OWNER TO egauser;

--
-- Name: comptes_id_seq; Type: SEQUENCE; Schema: public; Owner: egauser
--

CREATE SEQUENCE public.comptes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comptes_id_seq OWNER TO egauser;

--
-- Name: comptes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: egauser
--

ALTER SEQUENCE public.comptes_id_seq OWNED BY public.comptes.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: egauser
--

CREATE TABLE public.notifications (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    message character varying(500) NOT NULL,
    read boolean NOT NULL,
    title character varying(100) NOT NULL,
    type character varying(50) NOT NULL,
    user_id bigint NOT NULL
);


ALTER TABLE public.notifications OWNER TO egauser;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: egauser
--

CREATE SEQUENCE public.notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notifications_id_seq OWNER TO egauser;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: egauser
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: egauser
--

CREATE TABLE public.transactions (
    id bigint NOT NULL,
    date_transaction timestamp(6) without time zone NOT NULL,
    description character varying(255),
    montant numeric(15,2) NOT NULL,
    nouveau_solde numeric(15,2),
    solde_precedent numeric(15,2),
    type character varying(255) NOT NULL,
    compte_destination_id bigint,
    compte_source_id bigint,
    CONSTRAINT transactions_type_check CHECK (((type)::text = ANY ((ARRAY['DEPOT'::character varying, 'RETRAIT'::character varying, 'VIREMENT'::character varying])::text[])))
);


ALTER TABLE public.transactions OWNER TO egauser;

--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: egauser
--

CREATE SEQUENCE public.transactions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.transactions_id_seq OWNER TO egauser;

--
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: egauser
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: egauser
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    email character varying(100) NOT NULL,
    enabled boolean NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(255) NOT NULL,
    updated_at timestamp(6) without time zone,
    username character varying(50) NOT NULL
);


ALTER TABLE public.users OWNER TO egauser;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: egauser
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO egauser;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: egauser
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: clients id; Type: DEFAULT; Schema: public; Owner: egauser
--

ALTER TABLE ONLY public.clients ALTER COLUMN id SET DEFAULT nextval('public.clients_id_seq'::regclass);


--
-- Name: comptes id; Type: DEFAULT; Schema: public; Owner: egauser
--

ALTER TABLE ONLY public.comptes ALTER COLUMN id SET DEFAULT nextval('public.comptes_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: egauser
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: egauser
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: egauser
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: egauser
--

COPY public.clients (id, adresse, created_at, date_naissance, email, nationalite, nom, prenom, sexe, telephone, updated_at, user_id) FROM stdin;
2	MADIBA	2026-01-02 01:38:46.237289	2005-07-16	vic@gmail.com	Mauritanienne	ATTOH	victor	M	+22890364262	2026-01-02 01:38:46.23739	\N
3	Tokoin	2026-01-05 14:00:31.576488	2006-03-21	phanou@gmail.com	Ivoirienne	GG	phanou	M	+22890010101	2026-01-05 14:00:43.960483	\N
4	avepozo	2026-01-12 14:20:47.036724	2005-03-06	bene@gmail.com	Ivoirienne	HOUNKALI	bene	M	+22890909090	2026-01-12 14:20:47.036827	\N
10	agoe	2026-01-18 19:12:14.421563	1873-09-11	lili@gmail.com	Sénégalaise	lala	lili	M	+22890364263	2026-01-18 19:12:14.421603	\N
11	douane	2026-01-18 19:14:42.95664	1745-04-12	rose@gmail.com	Mauritanienne	rosavi	rose	M	+22890010594	2026-01-18 19:14:42.95668	\N
12	avenou	2026-01-18 19:18:22.078424	2004-04-21	salim@gmail.com	Sénégalaise	tchomp	salim	M	+22897254053	2026-01-18 19:18:22.078507	\N
13	sagbado	2026-01-18 19:22:06.403483	2004-02-11	dada@gmail.com	Sénégalaise	dadavi	dada	M	+22897254052	2026-01-18 19:22:06.403537	\N
14	LOME	2026-01-18 19:25:36.687361	2001-02-02	kouadouffan@gmail.com	Sénégalaise	DOUFFAN	kouassi	M	+22890364269	2026-01-18 19:25:36.687435	\N
15	lome	2026-01-18 19:51:01.233048	2006-03-22	Oliva@gmail.com	Sénégalaise	EZE	oliva	F	+22897254054	2026-01-18 19:51:01.233148	\N
16	lome	2026-01-18 19:55:52.82394	1957-05-04	kapo@gmail.com	Sénégalaise	kapo	olivier	M	+22890364264	2026-01-18 19:55:52.823993	\N
17	lome	2026-01-18 19:59:49.85049	2005-05-31	evans@gmail.com	Sénégalaise	NEGLO	evans	M	+22897254055	2026-01-18 19:59:49.850611	\N
18	lome	2026-01-18 20:13:32.189723	2009-03-23	carine@gmail.com	Sénégalaise	DOUFFAN	carine	M	+22890364268	2026-01-18 20:13:32.189801	\N
20	lome	2026-01-18 20:15:48.535482	2004-09-02	tete@gmail.com	Sénégalaise	tete	tete	F	+22871374781	2026-01-18 20:15:48.535519	\N
1	yokoe	2026-01-01 23:50:12.464076	2005-09-04	elom@gmail.com	Française	DOUFFAN	elom	M	+22897254050	2026-01-18 20:37:18.29592	\N
5	yokoe	2026-01-18 18:30:07.321834	1975-05-21	angedouffan@gmail.com	Française	DOUFFA	ange	M	+22890364261	2026-01-18 20:37:38.140597	\N
\.


--
-- Data for Name: comptes; Type: TABLE DATA; Schema: public; Owner: egauser
--

COPY public.comptes (id, date_creation, date_modification, numero_compte, solde, type, client_id) FROM stdin;
3	2026-01-05 14:01:17.211682	2026-01-05 14:02:12.521201	FR0749232213984061805043814	100.00	COURANT	3
2	2026-01-02 01:41:04.658671	2026-01-12 14:25:14.036545	FR8830698053570782262655054	889900.00	COURANT	2
5	2026-01-18 18:30:18.278847	2026-01-18 18:30:18.27891	FR2669566808528479917066011	0.00	COURANT	5
6	2026-01-18 18:30:24.376248	2026-01-18 18:36:39.57896	FR7329180179404977312850842	9900.00	EPARGNE	5
1	2026-01-01 23:50:27.907189	2026-01-18 21:55:54.081115	FR7397144003914927384847789	20000.00	EPARGNE	1
4	2026-01-12 14:21:11.043381	2026-01-18 21:56:06.725708	FR5527446107803204109022512	1090000.00	EPARGNE	4
\.


--
-- Data for Name: comptes_courant; Type: TABLE DATA; Schema: public; Owner: egauser
--

COPY public.comptes_courant (decouvert_autorise, id) FROM stdin;
50000.00	2
50000.00	3
50000.00	5
\.


--
-- Data for Name: comptes_epargne; Type: TABLE DATA; Schema: public; Owner: egauser
--

COPY public.comptes_epargne (taux_interet, id) FROM stdin;
2.50	1
2.00	4
2.50	6
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: egauser
--

COPY public.notifications (id, created_at, message, read, title, type, user_id) FROM stdin;
1	2026-01-18 21:55:54.018007	Virement de 10000.00€ vers FR7397144003914927384847789	f	Virement envoyé	VIREMENT	4
2	2026-01-18 21:55:54.0298	Virement de 10000.00€ reçu de FR5527446107803204109022512	f	Virement reçu	VIREMENT	1
3	2026-01-18 21:56:06.71893	Dépôt de 1000000.00€ sur votre compte FR5527446107803204109022512	f	Dépôt effectué	DEPOT	4
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: egauser
--

COPY public.transactions (id, date_transaction, description, montant, nouveau_solde, solde_precedent, type, compte_destination_id, compte_source_id) FROM stdin;
1	2026-01-02 01:41:29.067386	economie	1000000.00	1000000.00	0.00	DEPOT	2	\N
2	2026-01-02 01:43:12.370985	cadeau	10000.00	990000.00	1000000.00	VIREMENT	1	2
4	2026-01-05 14:02:12.512457	phanou	100.00	989900.00	990000.00	VIREMENT	3	2
5	2026-01-12 14:25:14.027272	je l'aime	100000.00	889900.00	989900.00	VIREMENT	4	2
6	2026-01-18 18:36:30.172224	rien	10000.00	10000.00	0.00	DEPOT	6	\N
7	2026-01-18 18:36:39.564806	Retrait	100.00	9900.00	10000.00	RETRAIT	\N	6
8	2026-01-18 21:55:53.979729	ok	10000.00	90000.00	100000.00	VIREMENT	1	4
9	2026-01-18 21:56:06.711855		1000000.00	1090000.00	90000.00	DEPOT	4	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: egauser
--

COPY public.users (id, created_at, email, enabled, password, role, updated_at, username) FROM stdin;
2	2026-01-01 23:42:14.493418	prevo@gmail.com	t	$2a$10$GIz.0./pIZTJIUcakAzpIe/cTLBIqVDuDrZ4Zeavbp1fiMGwiT9Wq	ROLE_USER	2026-01-01 23:42:14.493465	prevo
3	2026-01-05 13:59:32.900754	phanou@gmail.com	t	$2a$10$gzRNmgVgEYiY1JWS9vjgn.5gSZyMSKawCPqmeItYX1rG93w4EHKCe	ROLE_USER	2026-01-05 13:59:32.900947	phanou
4	2026-01-17 10:20:39.246084	prichou@gmail.com	t	$2a$10$SEVCMT5/6nRlX9t6dBluJe1gAasZstrvocA8YReyjczSgxZSud73e	ROLE_USER	2026-01-17 10:20:39.246176	prichou
5	2026-01-18 18:25:33.511154	kokouvi@gmail.com	t	$2a$10$sSrzUpCqWcKCI6NGqtRYU.SevyLKG5WCHftaxrbEwdu.psGq0Sc0S	ROLE_USER	2026-01-18 18:25:33.511261	ange
1	2026-01-01 23:39:32.086089	admin@ega-bank.com	t	$2a$10$EFvI/Xy/js9C/GZjlwgXoedB7RqAsj4I3.CqJRg9EorF0UCVBbNrS	ROLE_ADMIN	2026-01-19 18:10:39.321541	admin
\.


--
-- Name: clients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: egauser
--

SELECT pg_catalog.setval('public.clients_id_seq', 20, true);


--
-- Name: comptes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: egauser
--

SELECT pg_catalog.setval('public.comptes_id_seq', 6, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: egauser
--

SELECT pg_catalog.setval('public.notifications_id_seq', 3, true);


--
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: egauser
--

SELECT pg_catalog.setval('public.transactions_id_seq', 9, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: egauser
--

SELECT pg_catalog.setval('public.users_id_seq', 5, true);


--
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: egauser
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- Name: comptes_courant comptes_courant_pkey; Type: CONSTRAINT; Schema: public; Owner: egauser
--

ALTER TABLE ONLY public.comptes_courant
    ADD CONSTRAINT comptes_courant_pkey PRIMARY KEY (id);


--
-- Name: comptes_epargne comptes_epargne_pkey; Type: CONSTRAINT; Schema: public; Owner: egauser
--

ALTER TABLE ONLY public.comptes_epargne
    ADD CONSTRAINT comptes_epargne_pkey PRIMARY KEY (id);


--
-- Name: comptes comptes_pkey; Type: CONSTRAINT; Schema: public; Owner: egauser
--

ALTER TABLE ONLY public.comptes
    ADD CONSTRAINT comptes_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: egauser
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: egauser
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: users uk_6dotkott2kjsp8vw4d0m25fb7; Type: CONSTRAINT; Schema: public; Owner: egauser
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk_6dotkott2kjsp8vw4d0m25fb7 UNIQUE (email);


--
-- Name: clients uk_chbwssnlj6d3v8fcet3hl92he; Type: CONSTRAINT; Schema: public; Owner: egauser
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT uk_chbwssnlj6d3v8fcet3hl92he UNIQUE (telephone);


--
-- Name: comptes uk_coswgxmsdb8j51fkqp4ncg27k; Type: CONSTRAINT; Schema: public; Owner: egauser
--

ALTER TABLE ONLY public.comptes
    ADD CONSTRAINT uk_coswgxmsdb8j51fkqp4ncg27k UNIQUE (numero_compte);


--
-- Name: users uk_r43af9ap4edm43mmtq01oddj6; Type: CONSTRAINT; Schema: public; Owner: egauser
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk_r43af9ap4edm43mmtq01oddj6 UNIQUE (username);


--
-- Name: clients uk_smrp6gi0tckq1w5rnd7boyowu; Type: CONSTRAINT; Schema: public; Owner: egauser
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT uk_smrp6gi0tckq1w5rnd7boyowu UNIQUE (user_id);


--
-- Name: clients uk_srv16ica2c1csub334bxjjb59; Type: CONSTRAINT; Schema: public; Owner: egauser
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT uk_srv16ica2c1csub334bxjjb59 UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: egauser
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_transaction_date; Type: INDEX; Schema: public; Owner: egauser
--

CREATE INDEX idx_transaction_date ON public.transactions USING btree (date_transaction);


--
-- Name: transactions fk44iwjecjfq1mb9j82mht0qm9k; Type: FK CONSTRAINT; Schema: public; Owner: egauser
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT fk44iwjecjfq1mb9j82mht0qm9k FOREIGN KEY (compte_destination_id) REFERENCES public.comptes(id);


--
-- Name: comptes_epargne fk6q9ogtm4dykd5yvx7d4mla87f; Type: FK CONSTRAINT; Schema: public; Owner: egauser
--

ALTER TABLE ONLY public.comptes_epargne
    ADD CONSTRAINT fk6q9ogtm4dykd5yvx7d4mla87f FOREIGN KEY (id) REFERENCES public.comptes(id);


--
-- Name: comptes fkgdxlnwob5n6i520rnxsbmr6ym; Type: FK CONSTRAINT; Schema: public; Owner: egauser
--

ALTER TABLE ONLY public.comptes
    ADD CONSTRAINT fkgdxlnwob5n6i520rnxsbmr6ym FOREIGN KEY (client_id) REFERENCES public.clients(id);


--
-- Name: comptes_courant fkkngudsjo0qpef31635jvnifih; Type: FK CONSTRAINT; Schema: public; Owner: egauser
--

ALTER TABLE ONLY public.comptes_courant
    ADD CONSTRAINT fkkngudsjo0qpef31635jvnifih FOREIGN KEY (id) REFERENCES public.comptes(id);


--
-- Name: transactions fkpvb5fnjxmx95y6awutv8kx6gw; Type: FK CONSTRAINT; Schema: public; Owner: egauser
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT fkpvb5fnjxmx95y6awutv8kx6gw FOREIGN KEY (compte_source_id) REFERENCES public.comptes(id);


--
-- Name: clients fktiuqdledq2lybrds2k3rfqrv4; Type: FK CONSTRAINT; Schema: public; Owner: egauser
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT fktiuqdledq2lybrds2k3rfqrv4 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict FJfsIMxzjjU0ToVI75dKqgs5xGBh8Jl9bOaYeH0hgaimNtu56jTDm2Cet64NGyI

