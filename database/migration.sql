--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5
-- Dumped by pg_dump version 14.5

-- Started on 2022-10-17 17:33:28

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

--
-- TOC entry 3331 (class 1262 OID 16395)
-- Name: test_node; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE test_node WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'Russian_Russia.1251';


ALTER DATABASE test_node OWNER TO postgres;

\connect test_node

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

--
-- TOC entry 3332 (class 0 OID 0)
-- Name: test_node; Type: DATABASE PROPERTIES; Schema: -; Owner: postgres
--

ALTER DATABASE test_node IS_TEMPLATE = true;


\connect test_node

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
-- TOC entry 213 (class 1259 OID 16431)
-- Name: cache; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cache (
    data json NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.cache OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 16418)
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    payment_id character varying(100) NOT NULL,
    amount numeric(12,2),
    status character varying(20) DEFAULT 'waiting'::character varying NOT NULL
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 16417)
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.payments_id_seq OWNER TO postgres;

--
-- TOC entry 3333 (class 0 OID 0)
-- Dependencies: 211
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- TOC entry 210 (class 1259 OID 16410)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    name character varying(100) NOT NULL,
    balance numeric(12,2) DEFAULT 0.00 NOT NULL,
    last_payment_at timestamp with time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 16409)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 3334 (class 0 OID 0)
-- Dependencies: 209
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3175 (class 2604 OID 16421)
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- TOC entry 3173 (class 2604 OID 16413)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);



--
-- TOC entry 3324 (class 0 OID 16418)
-- Dependencies: 212
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.payments VALUES (8, 1, 'b75ffaa2-c045-4fdd-aa71-275c75b826a5', NULL, 'waiting');
INSERT INTO public.payments VALUES (11, 1, '312da55b-b24c-409c-809e-2aefb74fff0a', 10.00, 'paid');
INSERT INTO public.payments VALUES (10, 1, 'd7719de7-c49b-4e68-92c4-93ea3ce088e9', 255.41, 'refused');
INSERT INTO public.payments VALUES (9, 1, '304ff04b-ea92-46df-9671-8c799266c65b', 144.14, 'refused');
INSERT INTO public.payments VALUES (12, 2, '065e61e3-5886-4ba3-83a7-dbe65a74b726', 25.00, 'paid');
INSERT INTO public.payments VALUES (13, 2, 'df94e9db-1b73-41e2-b5bd-72346f3b9915', 25.00, 'paid');
INSERT INTO public.payments VALUES (7, 1, '0bc39c86-a8a9-461e-9ac5-956e7abd7638', 25.00, 'paid');
INSERT INTO public.payments VALUES (14, 3, '73369315-3711-4115-9667-572a1af918cf', 30.00, 'paid');
INSERT INTO public.payments VALUES (15, 3, 'dc73f63e-d792-49e2-8acd-bebc7029a24d', 30.00, 'paid');
INSERT INTO public.payments VALUES (16, 3, 'b367ca67-16c2-45d9-bc4a-86ea54b076ab', 30.00, 'paid');
INSERT INTO public.payments VALUES (17, 3, '9d7282a6-715d-47e3-a58f-905dfa5bc317', 30.00, 'refused');
INSERT INTO public.payments VALUES (18, 3, '3945d77d-15fc-44cd-8010-3a9a8b729eee', NULL, 'waiting');
INSERT INTO public.payments VALUES (19, 3, '7d8bb458-a4fe-4c2b-b1b3-8cea0f0f81b6', NULL, 'waiting');
INSERT INTO public.payments VALUES (20, 3, '4ccea053-1988-4c33-a347-d14d6e7c892b', NULL, 'waiting');
INSERT INTO public.payments VALUES (21, 3, 'de182844-7697-40bd-9d91-5e4b590dc196', NULL, 'waiting');


--
-- TOC entry 3322 (class 0 OID 16410)
-- Dependencies: 210
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES (2, 'User 2', 0.00, NULL);
INSERT INTO public.users VALUES (1, 'User 1', 125.00, NULL);
INSERT INTO public.users VALUES (3, 'User 3', 90.00, '2022-10-16 14:01:07.562671+03');


--
-- TOC entry 3335 (class 0 OID 0)
-- Dependencies: 211
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_id_seq', 21, true);


--
-- TOC entry 3336 (class 0 OID 0)
-- Dependencies: 209
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- TOC entry 3180 (class 2606 OID 16423)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- TOC entry 3178 (class 2606 OID 16416)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3181 (class 2606 OID 16424)
-- Name: payments user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;


-- Completed on 2022-10-17 17:33:28

--
-- PostgreSQL database dump complete
--

