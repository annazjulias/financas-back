--
-- PostgreSQL database dump
--

\restrict pq4VZ86mWobERchjUfE0PlAyDjMcp9bATEicZCMIvPavogzuXXoMqR36MB5XGZg

-- Dumped from database version 14.20 (Homebrew)
-- Dumped by pg_dump version 14.20 (Homebrew)

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
-- Name: Card; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Card" (
    id text NOT NULL,
    name text NOT NULL,
    "creditLimit" numeric(65,30),
    "closingDay" integer,
    "dueDay" integer,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Category; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Category" (
    id text NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Invoice; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Invoice" (
    id text NOT NULL,
    "cardId" text NOT NULL,
    reference text NOT NULL,
    "closingDate" timestamp(3) without time zone NOT NULL,
    "dueDate" timestamp(3) without time zone NOT NULL,
    status text DEFAULT 'aberta'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: PaymentMethod; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PaymentMethod" (
    id text NOT NULL,
    name text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Transaction; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Transaction" (
    id text NOT NULL,
    description text NOT NULL,
    amount numeric(65,30) NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    type text NOT NULL,
    "userId" text NOT NULL,
    "categoryId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "paymentMethodId" text,
    "cardId" text,
    "invoiceId" text,
    "installmentGroupId" text,
    "installmentNumber" integer,
    "totalInstallments" integer
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Data for Name: Card; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Card" (id, name, "creditLimit", "closingDay", "dueDay", "userId", "createdAt", "updatedAt") FROM stdin;
cmu43x5r40000anotgv5tlytr	Nubank	3000.000000000000000000000000000000	10	17	fzJPYFACN4Ms8vORN7i5LMQjgJw1	2026-09-16 12:58:50.848	2026-09-16 12:58:50.848
cmub9lm5q0000u9otb82tmo6m	Nubank	3000.000000000000000000000000000000	10	17	fzJPYFACN4Ms8vORN7i5LMQjgJw1	2026-09-21 13:12:13.166	2026-09-21 13:12:13.166
cmub9m43t0001u9otxnb2q80p	Cartão Teste Fechamento	3000.000000000000000000000000000000	20	27	fzJPYFACN4Ms8vORN7i5LMQjgJw1	2026-09-21 13:12:36.425	2026-09-21 13:12:36.425
cmub9zqlu0006u9ot3qrd7olc	Cartão Teste Parcelamento	5000.000000000000000000000000000000	10	17	fzJPYFACN4Ms8vORN7i5LMQjgJw1	2026-09-21 13:23:12.114	2026-09-21 13:23:12.114
cmupgts0j0000lootuswyl3r8	PicPay	400.000000000000000000000000000000	1	10	OopBGi0tLLZ2gdgiXf7IseSRZdX2	2026-10-01 11:43:17.779	2026-10-01 11:43:17.779
cmuph7q6e000dlootjworhxca	Mercado Pago	6000.000000000000000000000000000000	5	13	OopBGi0tLLZ2gdgiXf7IseSRZdX2	2026-10-01 11:54:08.582	2026-10-01 11:54:08.582
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Category" (id, name, type, "userId", "createdAt", "updatedAt") FROM stdin;
cmu16ivu60000haot7unu39s4	Alimentação	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	2026-09-14 11:48:25.134	2026-09-14 11:48:25.134
cmub7ogii0003myott31vinhs	Salário	receita	fzJPYFACN4Ms8vORN7i5LMQjgJw1	2026-09-21 12:18:26.586	2026-09-21 12:18:26.586
cmul96g7y000oa0otwyax38ae	estudos	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	2026-09-28 12:58:07.39	2026-09-28 12:58:07.39
cmupgu7080001loot8tvb8jpr	Auto Cuidado	despesa	OopBGi0tLLZ2gdgiXf7IseSRZdX2	2026-10-01 11:43:37.208	2026-10-01 11:43:37.208
cmupgus4s0002lootwqbn48eb	Alimentação	despesa	OopBGi0tLLZ2gdgiXf7IseSRZdX2	2026-10-01 11:44:04.588	2026-10-01 11:44:04.588
cmupgvcmd0003lootx6jdvr6a	Uber	despesa	OopBGi0tLLZ2gdgiXf7IseSRZdX2	2026-10-01 11:44:31.141	2026-10-01 11:44:31.141
\.


--
-- Data for Name: Invoice; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Invoice" (id, "cardId", reference, "closingDate", "dueDate", status, "createdAt", "updatedAt") FROM stdin;
cmu44tsma0000n7otodqjsqmq	cmu43x5r40000anotgv5tlytr	2026-09	2026-09-10 00:00:00	2026-09-17 00:00:00	paga	2026-09-16 13:24:13.474	2026-09-20 17:34:19.559
cmua4btjw0002kbotquic55wd	cmu43x5r40000anotgv5tlytr	2026-10	2026-10-10 00:00:00	2026-10-17 00:00:00	paga	2026-09-20 17:56:51.932	2026-09-21 08:51:11.94
cmub0zvue00019doticxkzqml	cmu43x5r40000anotgv5tlytr	2026-12	2026-12-10 03:00:00	2026-12-17 03:00:00	paga	2026-09-21 09:11:22.358	2026-09-21 09:58:41.42
cmub0zvub00009dotsoiebniy	cmu43x5r40000anotgv5tlytr	2026-11	2026-11-10 03:00:00	2026-11-17 03:00:00	paga	2026-09-21 09:11:22.355	2026-09-21 12:35:09.651
cmub0savk0000s9otcqw3hq67	cmu43x5r40000anotgv5tlytr	2026-10	2026-10-10 03:00:00	2026-10-17 03:00:00	paga	2026-09-21 09:05:28.592	2026-09-21 12:51:23.725
cmub8z1350000gwotdnm09ewp	cmu43x5r40000anotgv5tlytr	2027-01	2027-01-10 03:00:00	2027-01-17 03:00:00	aberta	2026-09-21 12:54:39.425	2026-09-21 12:54:39.425
cmub9n8md0002u9otljl7piga	cmub9m43t0001u9otxnb2q80p	2026-09	2026-09-20 03:00:00	2026-09-27 03:00:00	paga	2026-09-21 13:13:28.933	2026-09-21 13:16:53.041
cmub9tkus0004u9ot7p6ut940	cmub9m43t0001u9otxnb2q80p	2026-10	2026-10-20 03:00:00	2026-10-27 03:00:00	aberta	2026-09-21 13:18:24.724	2026-09-21 13:18:24.724
cmub9zzyv0007u9otzc2qiah9	cmub9zqlu0006u9ot3qrd7olc	2026-10	2026-10-10 03:00:00	2026-10-17 03:00:00	aberta	2026-09-21 13:23:24.247	2026-09-21 13:23:24.247
cmub9zzyx0008u9ot4kl8f8x7	cmub9zqlu0006u9ot3qrd7olc	2026-11	2026-11-10 03:00:00	2026-11-17 03:00:00	aberta	2026-09-21 13:23:24.249	2026-09-21 13:23:24.249
cmub9zzz00009u9otp08rvhb0	cmub9zqlu0006u9ot3qrd7olc	2026-12	2026-12-10 03:00:00	2026-12-17 03:00:00	aberta	2026-09-21 13:23:24.252	2026-09-21 13:23:24.252
cmul8zh0w0000a0ot3edm882i	cmub9lm5q0000u9otb82tmo6m	2026-10	2026-10-10 03:00:00	2026-10-17 03:00:00	aberta	2026-09-28 12:52:41.84	2026-09-28 12:52:41.84
cmul8zh170001a0ot14qqobzq	cmub9lm5q0000u9otb82tmo6m	2026-11	2026-11-10 03:00:00	2026-11-17 03:00:00	aberta	2026-09-28 12:52:41.852	2026-09-28 12:52:41.852
cmul8zh190002a0ot4yn67lg0	cmub9lm5q0000u9otb82tmo6m	2026-12	2026-12-10 03:00:00	2026-12-17 03:00:00	aberta	2026-09-28 12:52:41.853	2026-09-28 12:52:41.853
cmul8zh1b0003a0otjl8zp3l1	cmub9lm5q0000u9otb82tmo6m	2027-01	2027-01-10 03:00:00	2027-01-17 03:00:00	aberta	2026-09-28 12:52:41.855	2026-09-28 12:52:41.855
cmul8zh1d0004a0otq9koyehl	cmub9lm5q0000u9otb82tmo6m	2027-02	2027-02-10 03:00:00	2027-02-17 03:00:00	aberta	2026-09-28 12:52:41.857	2026-09-28 12:52:41.857
cmul8zh1f0005a0ot2qnva2rh	cmub9lm5q0000u9otb82tmo6m	2027-03	2027-03-10 03:00:00	2027-03-17 03:00:00	aberta	2026-09-28 12:52:41.859	2026-09-28 12:52:41.859
cmul8zh1g0006a0otnaoi7630	cmub9lm5q0000u9otb82tmo6m	2027-04	2027-04-10 03:00:00	2027-04-17 03:00:00	aberta	2026-09-28 12:52:41.86	2026-09-28 12:52:41.86
cmul8zh1h0007a0ot9vbj4ivz	cmub9lm5q0000u9otb82tmo6m	2027-05	2027-05-10 03:00:00	2027-05-17 03:00:00	aberta	2026-09-28 12:52:41.861	2026-09-28 12:52:41.861
cmul8zh1i0008a0otld1bxlxj	cmub9lm5q0000u9otb82tmo6m	2027-06	2027-06-10 03:00:00	2027-06-17 03:00:00	aberta	2026-09-28 12:52:41.862	2026-09-28 12:52:41.862
cmul8zh1k0009a0othyelqhva	cmub9lm5q0000u9otb82tmo6m	2027-07	2027-07-10 03:00:00	2027-07-17 03:00:00	aberta	2026-09-28 12:52:41.864	2026-09-28 12:52:41.864
cmul8zh1l000aa0otrfdup6tu	cmub9lm5q0000u9otb82tmo6m	2027-08	2027-08-10 03:00:00	2027-08-17 03:00:00	aberta	2026-09-28 12:52:41.865	2026-09-28 12:52:41.865
cmul8zh1n000ba0otpxygh0x1	cmub9lm5q0000u9otb82tmo6m	2027-09	2027-09-10 03:00:00	2027-09-17 03:00:00	aberta	2026-09-28 12:52:41.867	2026-09-28 12:52:41.867
cmuph0qf50006loot5fgxjpse	cmupgts0j0000lootuswyl3r8	2026-10	2026-10-01 03:00:00	2026-10-10 03:00:00	aberta	2026-10-01 11:48:42.305	2026-10-01 11:48:42.305
\.


--
-- Data for Name: PaymentMethod; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PaymentMethod" (id, name, "userId", "createdAt", "updatedAt") FROM stdin;
cmu43kng900016wottfy2qi5w	PIX	fzJPYFACN4Ms8vORN7i5LMQjgJw1	2026-09-16 12:49:07.257	2026-09-16 12:49:07.257
cmuazmiij0004kbotlt2peao3	Crédito	fzJPYFACN4Ms8vORN7i5LMQjgJw1	2026-09-21 08:32:58.939	2026-09-21 08:32:58.939
cmuazmwp60005kbots5nd493n	Débito	fzJPYFACN4Ms8vORN7i5LMQjgJw1	2026-09-21 08:33:17.322	2026-09-21 08:33:17.322
cmul9rzk70000agotaajcc0mz	Dinheiro	fzJPYFACN4Ms8vORN7i5LMQjgJw1	2026-09-28 13:14:52.232	2026-09-28 13:14:52.232
cmupgzesc0005lootctab0qg2	Crédito	OopBGi0tLLZ2gdgiXf7IseSRZdX2	2026-10-01 11:47:40.572	2026-10-01 11:47:40.572
\.


--
-- Data for Name: Transaction; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Transaction" (id, description, amount, date, type, "userId", "categoryId", "createdAt", "updatedAt", "paymentMethodId", "cardId", "invoiceId", "installmentGroupId", "installmentNumber", "totalInstallments") FROM stdin;
cmu15mom10000bfotxye2h5u4	Supermercado - atualizado	175.900000000000000000000000000000	2026-09-14 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	\N	2026-09-14 11:23:22.777	2026-09-14 11:35:48.93	\N	\N	\N	\N	\N	\N
cmu171mk30000m0otemh3f2b0	Compra no supermercado	100.000000000000000000000000000000	2026-09-14 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-14 12:02:59.571	2026-09-14 12:02:59.571	\N	\N	\N	\N	\N	\N
cmub302dh0001ueotbcpfdptk	Compra no débito	150.000000000000000000000000000000	2026-09-21 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-21 10:07:30.053	2026-09-21 10:07:30.053	cmuazmwp60005kbots5nd493n	cmu43x5r40000anotgv5tlytr	\N	\N	1	1
cmu43hzuh00006wot81jzd1yu	Supermercado	250.000000000000000000000000000000	2026-09-16 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	\N	2026-09-16 12:47:03.353	2026-09-16 12:47:03.353	\N	\N	\N	\N	\N	\N
cmu43l9lg00026wotg7ghnsiw	Supermercado	250.000000000000000000000000000000	2026-09-16 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-16 12:49:35.956	2026-09-16 12:49:35.956	cmu43kng900016wottfy2qi5w	\N	\N	\N	\N	\N
cmu44cckv0004anotxn7dagin	Supermercado no pix	599.000000000000000000000000000000	2026-09-16 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-16 13:10:39.535	2026-09-16 13:10:39.535	cmu43kng900016wottfy2qi5w	cmu43x5r40000anotgv5tlytr	\N	\N	\N	\N
cmu44d41m0005anotgnzxuxzh	Supermercado no pix	599.000000000000000000000000000000	2026-09-16 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-16 13:11:15.13	2026-09-16 13:11:15.13	cmu43kng900016wottfy2qi5w	\N	\N	\N	\N	\N
cmu45gebf0000rvotfecmmlon	Compra alterada para PIX	1500.000000000000000000000000000000	2026-09-16 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-16 13:41:48.027	2026-09-16 13:48:03.985	cmu43kng900016wottfy2qi5w	\N	\N	\N	\N	\N
cmuazosi40007kbotrvjiukxk	Compra no débito	150.000000000000000000000000000000	2026-09-20 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-21 08:34:45.196	2026-09-21 08:34:45.196	cmuazmwp60005kbots5nd493n	cmu43x5r40000anotgv5tlytr	\N	\N	\N	\N
cmuazwol60000h2otr9cr9z39	Compra no PIX	80.000000000000000000000000000000	2026-09-21 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-21 08:40:53.37	2026-09-21 08:40:53.37	cmu43kng900016wottfy2qi5w	\N	\N	\N	\N	\N
cmub7hibe0000myotdy5qqiyz	Salário	3500.000000000000000000000000000000	2026-09-21 00:00:00	receita	fzJPYFACN4Ms8vORN7i5LMQjgJw1	\N	2026-09-21 12:13:02.33	2026-09-21 12:13:02.33	cmu43kng900016wottfy2qi5w	\N	\N	\N	1	1
cmub7iri50001myotp7cxrsfl	Salário	3500.000000000000000000000000000000	2026-09-21 00:00:00	receita	fzJPYFACN4Ms8vORN7i5LMQjgJw1	\N	2026-09-21 12:14:00.893	2026-09-21 12:14:00.893	cmu43kng900016wottfy2qi5w	\N	\N	\N	1	1
cmub7js9a0002myotg336xvnf	Freelance	800.000000000000000000000000000000	2026-09-21 00:00:00	receita	fzJPYFACN4Ms8vORN7i5LMQjgJw1	\N	2026-09-21 12:14:48.526	2026-09-21 12:14:48.526	cmu43kng900016wottfy2qi5w	\N	\N	\N	1	1
cmub7qcm90004myotca0cw3pg	Salário	3500.000000000000000000000000000000	2026-09-21 00:00:00	receita	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmub7ogii0003myott31vinhs	2026-09-21 12:19:54.849	2026-09-21 12:19:54.849	cmu43kng900016wottfy2qi5w	\N	\N	\N	1	1
cmub871a30000e8otpzvlwpdg	Salário atualizado	3600.000000000000000000000000000000	2026-09-15 12:00:00	receita	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmub7ogii0003myott31vinhs	2026-09-21 12:32:53.308	2026-09-21 12:45:11.101	\N	\N	\N	\N	1	1
cmub9zzz5000au9otk7qzmwaa	Compra parcelada teste	300.000000000000000000000000000000	2026-09-21 12:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-21 13:23:24.257	2026-09-21 13:23:24.257	cmuazmiij0004kbotlt2peao3	cmub9zqlu0006u9ot3qrd7olc	cmub9zzyv0007u9otzc2qiah9	96ae1a09-9608-4501-aeca-c38209cf75cc	1	3
cmub9zzz6000bu9otjpd2mvpf	Compra parcelada teste	300.000000000000000000000000000000	2026-10-21 12:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-21 13:23:24.257	2026-09-21 13:23:24.257	cmuazmiij0004kbotlt2peao3	cmub9zqlu0006u9ot3qrd7olc	cmub9zzyx0008u9ot4kl8f8x7	96ae1a09-9608-4501-aeca-c38209cf75cc	2	3
cmub9zzz6000cu9ot62jh9asq	Compra parcelada teste	300.000000000000000000000000000000	2026-11-21 12:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-21 13:23:24.257	2026-09-21 13:23:24.257	cmuazmiij0004kbotlt2peao3	cmub9zqlu0006u9ot3qrd7olc	cmub9zzz00009u9otp08rvhb0	96ae1a09-9608-4501-aeca-c38209cf75cc	3	3
cmuba2onx000du9otz3k0zmx2	Teste compra PIX	100.000000000000000000000000000000	2026-09-21 12:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-21 13:25:29.565	2026-09-21 13:25:29.565	cmu43kng900016wottfy2qi5w	\N	\N	\N	1	1
cmuba4zgq000eu9otgczo1ex4	Teste compra débito	100.000000000000000000000000000000	2026-09-21 12:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-21 13:27:16.874	2026-09-21 13:27:16.874	cmuazmwp60005kbots5nd493n	cmub9zqlu0006u9ot3qrd7olc	\N	\N	1	1
cmuba5ljk000fu9ot0jheb8n5	Salário teste	3000.000000000000000000000000000000	2026-09-21 12:00:00	receita	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmub7ogii0003myott31vinhs	2026-09-21 13:27:45.488	2026-09-21 13:27:45.488	\N	\N	\N	\N	1	1
cmu444l9s0002anot3ao4gwau	Supermercado no cartão	500.000000000000000000000000000000	2026-09-16 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-16 13:04:37.552	2026-09-16 13:04:37.552	\N	cmu43x5r40000anotgv5tlytr	\N	\N	\N	\N
cmu44b67q0003anotcjtdm7ws	Supermercado no pix	599.000000000000000000000000000000	2026-09-16 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-16 13:09:44.63	2026-09-16 13:09:44.63	\N	cmu43x5r40000anotgv5tlytr	\N	\N	\N	\N
cmu45bbt70001eooto1htkqy4	Compra teste crédito	900.000000000000000000000000000000	2026-09-16 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-16 13:37:51.499	2026-09-16 13:37:51.499	\N	cmu43x5r40000anotgv5tlytr	cmu44tsma0000n7otodqjsqmq	\N	\N	\N
cmua43u8g0000kbotkq5wfe4w	Teste limite cartão	400.000000000000000000000000000000	2026-09-16 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-20 17:50:39.568	2026-09-20 17:50:39.568	\N	cmu43x5r40000anotgv5tlytr	cmu44tsma0000n7otodqjsqmq	\N	\N	\N
cmua444360001kbotcofsi9bw	Compra teste crédito	200.000000000000000000000000000000	2026-09-20 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-20 17:50:52.338	2026-09-20 17:50:52.338	\N	cmu43x5r40000anotgv5tlytr	cmu44tsma0000n7otodqjsqmq	\N	\N	\N
cmua4d3ip0003kbotyrgbhvzi	Compra outubro	500.000000000000000000000000000000	2026-10-05 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-20 17:57:51.505	2026-09-20 17:57:51.505	\N	cmu43x5r40000anotgv5tlytr	cmua4btjw0002kbotquic55wd	\N	\N	\N
cmuaznpo60006kbotrt0xzrbs	Compra outubro	500.000000000000000000000000000000	2026-10-05 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-21 08:33:54.87	2026-09-21 08:33:54.87	\N	cmu43x5r40000anotgv5tlytr	cmua4btjw0002kbotquic55wd	\N	\N	\N
cmuazyw940001h2ottnvublz1	Compra crédito - teste fatura	300.000000000000000000000000000000	2026-09-21 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-21 08:42:36.616	2026-09-21 08:42:36.616	\N	cmu43x5r40000anotgv5tlytr	cmu44tsma0000n7otodqjsqmq	\N	\N	\N
cmub02g1x0000pkotbopcgkcz	Teste nova fatura	300.000000000000000000000000000000	2026-09-21 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-21 08:45:22.245	2026-09-21 08:45:22.245	\N	cmu43x5r40000anotgv5tlytr	cmua4btjw0002kbotquic55wd	\N	\N	\N
cmub08drx0000keot4iwcpgvy	Teste compra dentro do limite	1000.000000000000000000000000000000	2026-09-21 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-21 08:49:59.229	2026-09-21 08:49:59.229	\N	cmu43x5r40000anotgv5tlytr	cmua4btjw0002kbotquic55wd	\N	\N	\N
cmub0savo0001s9ot8bb387ry	Teste parcelamento	300.000000000000000000000000000000	2026-09-21 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-21 09:05:28.596	2026-09-21 09:05:28.596	\N	cmu43x5r40000anotgv5tlytr	cmub0savk0000s9otcqw3hq67	\N	1	1
cmub33me00002ueotgj618o2u	Teste limite exato	1800.000000000000000000000000000000	2026-09-21 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-21 10:10:15.96	2026-09-21 10:10:15.96	\N	cmu43x5r40000anotgv5tlytr	cmub0savk0000s9otcqw3hq67	\N	1	1
cmub1qvyu0000fpotyb2cnu9w	Compra parcelada novamente editada	200.000000000000000000000000000000	2026-09-21 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-21 09:32:22.23	2026-09-21 09:55:59.753	\N	cmu43x5r40000anotgv5tlytr	cmub0savk0000s9otcqw3hq67	df531e8d-5357-4ff9-91fa-150e7e8a2514	1	3
cmub1qvyy0001fpot97woqqcc	Compra parcelada novamente editada	200.000000000000000000000000000000	2026-10-21 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-21 09:32:22.234	2026-09-21 09:55:59.757	\N	cmu43x5r40000anotgv5tlytr	cmub0zvub00009dotsoiebniy	df531e8d-5357-4ff9-91fa-150e7e8a2514	2	3
cmub1qvz00002fpotomsx8rag	Compra parcelada novamente editada	200.000000000000000000000000000000	2026-11-21 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-21 09:32:22.236	2026-09-21 09:55:59.758	\N	cmu43x5r40000anotgv5tlytr	cmub0zvue00019doticxkzqml	df531e8d-5357-4ff9-91fa-150e7e8a2514	3	3
cmub2ymw90000ueotqrzqvzra	Compra crédito dentro do limite	500.000000000000000000000000000000	2026-09-21 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-21 10:06:23.337	2026-09-21 10:06:23.337	\N	cmu43x5r40000anotgv5tlytr	cmub0savk0000s9otcqw3hq67	\N	1	1
cmub8z13a0001gwot919qvm3p	Teste novo ciclo	100.000000000000000000000000000000	2026-12-11 12:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-21 12:54:39.43	2026-09-21 12:54:39.43	\N	cmu43x5r40000anotgv5tlytr	cmub8z1350000gwotdnm09ewp	\N	1	1
cmub901aa0002gwot5qiq6s83	Segunda compra novo ciclo	150.000000000000000000000000000000	2026-12-15 12:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-21 12:55:26.338	2026-09-21 12:55:26.338	\N	cmu43x5r40000anotgv5tlytr	cmub8z1350000gwotdnm09ewp	\N	1	1
cmub9n8me0003u9otl6atnvyy	Teste fatura fechada	300.000000000000000000000000000000	2026-09-19 12:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-21 13:13:28.934	2026-09-21 13:13:28.934	\N	cmub9m43t0001u9otxnb2q80p	cmub9n8md0002u9otljl7piga	\N	1	1
cmub9tkux0005u9otnkrvzpas	Teste limite após pagamento	2500.000000000000000000000000000000	2026-09-21 12:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-21 13:18:24.729	2026-09-21 13:18:24.729	\N	cmub9m43t0001u9otxnb2q80p	cmub9tkus0004u9ot7p6ut940	\N	1	1
cmul8zh1v000ca0otbftb1nz4	auto escola	47.170000000000000000000000000000	2026-09-28 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-28 12:52:41.875	2026-09-28 12:52:41.875	\N	cmub9lm5q0000u9otb82tmo6m	cmul8zh0w0000a0ot3edm882i	e36972fa-b4ba-430b-b630-f67c58a9f0d1	1	12
cmul8zh1v000da0ot85xh1g85	auto escola	47.170000000000000000000000000000	2026-10-28 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-28 12:52:41.875	2026-09-28 12:52:41.875	\N	cmub9lm5q0000u9otb82tmo6m	cmul8zh170001a0ot14qqobzq	e36972fa-b4ba-430b-b630-f67c58a9f0d1	2	12
cmul8zh1v000ea0otshficspn	auto escola	47.170000000000000000000000000000	2026-11-28 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-28 12:52:41.875	2026-09-28 12:52:41.875	\N	cmub9lm5q0000u9otb82tmo6m	cmul8zh190002a0ot4yn67lg0	e36972fa-b4ba-430b-b630-f67c58a9f0d1	3	12
cmul8zh1v000fa0othlm4y8c4	auto escola	47.170000000000000000000000000000	2026-12-28 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-28 12:52:41.875	2026-09-28 12:52:41.875	\N	cmub9lm5q0000u9otb82tmo6m	cmul8zh1b0003a0otjl8zp3l1	e36972fa-b4ba-430b-b630-f67c58a9f0d1	4	12
cmul8zh1v000ga0otiozyykeo	auto escola	47.170000000000000000000000000000	2027-01-28 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-28 12:52:41.875	2026-09-28 12:52:41.875	\N	cmub9lm5q0000u9otb82tmo6m	cmul8zh1d0004a0otq9koyehl	e36972fa-b4ba-430b-b630-f67c58a9f0d1	5	12
cmul8zh1v000ha0otjcs38wi3	auto escola	47.170000000000000000000000000000	2027-02-28 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-28 12:52:41.875	2026-09-28 12:52:41.875	\N	cmub9lm5q0000u9otb82tmo6m	cmul8zh1f0005a0ot2qnva2rh	e36972fa-b4ba-430b-b630-f67c58a9f0d1	6	12
cmul8zh1v000ia0otrazdfhhw	auto escola	47.170000000000000000000000000000	2027-03-28 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-28 12:52:41.875	2026-09-28 12:52:41.875	\N	cmub9lm5q0000u9otb82tmo6m	cmul8zh1g0006a0otnaoi7630	e36972fa-b4ba-430b-b630-f67c58a9f0d1	7	12
cmul8zh1v000ja0ot7fmudwre	auto escola	47.170000000000000000000000000000	2027-04-28 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-28 12:52:41.875	2026-09-28 12:52:41.875	\N	cmub9lm5q0000u9otb82tmo6m	cmul8zh1h0007a0ot9vbj4ivz	e36972fa-b4ba-430b-b630-f67c58a9f0d1	8	12
cmul8zh1v000ka0otks3lq11k	auto escola	47.160000000000000000000000000000	2027-05-28 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-28 12:52:41.875	2026-09-28 12:52:41.875	\N	cmub9lm5q0000u9otb82tmo6m	cmul8zh1i0008a0otld1bxlxj	e36972fa-b4ba-430b-b630-f67c58a9f0d1	9	12
cmul8zh1v000la0oteg963jyi	auto escola	47.160000000000000000000000000000	2027-06-28 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-28 12:52:41.875	2026-09-28 12:52:41.875	\N	cmub9lm5q0000u9otb82tmo6m	cmul8zh1k0009a0othyelqhva	e36972fa-b4ba-430b-b630-f67c58a9f0d1	10	12
cmul8zh1v000ma0otygxdpdnm	auto escola	47.160000000000000000000000000000	2027-07-28 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-28 12:52:41.875	2026-09-28 12:52:41.875	\N	cmub9lm5q0000u9otb82tmo6m	cmul8zh1l000aa0otrfdup6tu	e36972fa-b4ba-430b-b630-f67c58a9f0d1	11	12
cmul8zh1v000na0otx91vzf5s	auto escola	47.160000000000000000000000000000	2027-08-28 00:00:00	despesa	fzJPYFACN4Ms8vORN7i5LMQjgJw1	cmu16ivu60000haot7unu39s4	2026-09-28 12:52:41.875	2026-09-28 12:52:41.875	\N	cmub9lm5q0000u9otb82tmo6m	cmul8zh1n000ba0otpxygh0x1	e36972fa-b4ba-430b-b630-f67c58a9f0d1	12	12
cmuph0qfd0007lootndv2wjpr	Maquiagem	26.800000000000000000000000000000	2026-09-11 00:00:00	despesa	OopBGi0tLLZ2gdgiXf7IseSRZdX2	cmupgu7080001loot8tvb8jpr	2026-10-01 11:48:42.313	2026-10-01 11:48:42.313	cmupgzesc0005lootctab0qg2	cmupgts0j0000lootuswyl3r8	cmuph0qf50006loot5fgxjpse	\N	1	1
cmuph2flk0008lootjnjlkc57	churasco	31.310000000000000000000000000000	2026-09-17 00:00:00	despesa	OopBGi0tLLZ2gdgiXf7IseSRZdX2	cmupgus4s0002lootwqbn48eb	2026-10-01 11:50:01.592	2026-10-01 11:50:01.592	cmupgzesc0005lootctab0qg2	cmupgts0j0000lootuswyl3r8	cmuph0qf50006loot5fgxjpse	\N	1	1
cmuph33yz0009loot3j7rilow	brigadeiro	15.000000000000000000000000000000	2026-09-18 00:00:00	despesa	OopBGi0tLLZ2gdgiXf7IseSRZdX2	cmupgus4s0002lootwqbn48eb	2026-10-01 11:50:33.179	2026-10-01 11:50:33.179	cmupgzesc0005lootctab0qg2	cmupgts0j0000lootuswyl3r8	cmuph0qf50006loot5fgxjpse	\N	1	1
cmuph41t8000aloots099shz9	uber	6.750000000000000000000000000000	2026-09-23 00:00:00	despesa	OopBGi0tLLZ2gdgiXf7IseSRZdX2	cmupgvcmd0003lootx6jdvr6a	2026-10-01 11:51:17.036	2026-10-01 11:51:17.036	cmupgzesc0005lootctab0qg2	cmupgts0j0000lootuswyl3r8	cmuph0qf50006loot5fgxjpse	\N	1	1
cmuph4wph000blootu0bbra7f	uber	7.920000000000000000000000000000	2026-09-25 00:00:00	despesa	OopBGi0tLLZ2gdgiXf7IseSRZdX2	cmupgvcmd0003lootx6jdvr6a	2026-10-01 11:51:57.077	2026-10-01 11:51:57.077	cmupgzesc0005lootctab0qg2	cmupgts0j0000lootuswyl3r8	cmuph0qf50006loot5fgxjpse	\N	1	1
cmuph5jcy000clootog2l09aj	marmitex	25.000000000000000000000000000000	2026-09-25 00:00:00	despesa	OopBGi0tLLZ2gdgiXf7IseSRZdX2	cmupgus4s0002lootwqbn48eb	2026-10-01 11:52:26.434	2026-10-01 11:52:26.434	cmupgzesc0005lootctab0qg2	cmupgts0j0000lootuswyl3r8	cmuph0qf50006loot5fgxjpse	\N	1	1
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (id, email, "createdAt", "updatedAt") FROM stdin;
fzJPYFACN4Ms8vORN7i5LMQjgJw1	teste@financas.com	2026-09-14 09:59:26.295	2026-10-01 11:30:29.078
OopBGi0tLLZ2gdgiXf7IseSRZdX2	anazjuliasilva15@gmail.com	2026-10-01 11:08:09.659	2026-10-01 11:54:18.954
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
c1341f52-9c68-4f39-bc5b-e5cfb46cb7d8	4f7a1284be9c8b341d199fa137ac1843c6ea704d5d398c3bbb0f8c7c18c18788	2026-09-10 09:53:41.508032-03	20260910125341_create_user	\N	\N	2026-09-10 09:53:41.480268-03	1
fcec655a-5995-4da0-bed3-2a200c040e81	4d357570d951480c5b06b4a1d233a4aa931d5b0c94fa618a8f7c2d35147e94ce	2026-09-10 09:55:44.918651-03	20260910125544_create_category	\N	\N	2026-09-10 09:55:44.913207-03	1
3241cf74-1f38-4c28-b532-a3d9d17e3a9c	02d406c07cf8e8826e7542a912d2518e81995d0e77128f0773af2f99e2b4e2e6	2026-09-10 09:58:26.925247-03	20260910125826_add_user_category_relation	\N	\N	2026-09-10 09:58:26.920436-03	1
afd96739-bdcd-42f4-982b-0740d93d0078	0ee258c4c6d39aab0de50ffb65ccc1a27e8ec85c98de31f7b3cc6e8e474373d4	2026-09-10 10:00:14.346346-03	20260910130014_create_transaction	\N	\N	2026-09-10 10:00:14.33705-03	1
0ef65719-3ad7-4b0e-9706-c106b1d15aaa	74317a1849b6d724e65c500326ccb6f9fcba47b679e93f6be37626d39f5e5882	2026-09-14 09:15:04.383255-03	20260914121504_create_payment_method	\N	\N	2026-09-14 09:15:04.37666-03	1
117727f8-6f1e-43ec-8e8c-89869838f055	915e53445ec7c004d7047f6ba0d14e1a072bb60d48b799a622117b64c96cead0	2026-09-15 10:47:26.227355-03	20260915134726_create_card	\N	\N	2026-09-15 10:47:26.216475-03	1
354bfdcf-32d0-41ed-ad6e-1a467e0decb9	5c8bbafec96f53e5580e379af7a75351d38005c8bc788639933268dd88560471	2026-09-16 09:43:17.009147-03	20260916124317_add_payment_method_to_transaction	\N	\N	2026-09-16 09:43:17.005881-03	1
96f78768-7d08-41b6-a7cb-ab194e24d1b7	7d0c25758c8179a93fcaed8c52e72cdebf166b1249151c25463f0f7fc6bce259	2026-09-16 09:52:36.808186-03	20260916125236_add_card_to_transaction	\N	\N	2026-09-16 09:52:36.804518-03	1
9ebbfe41-9c13-4603-a892-d7b1667e3339	dccced2dcd4c05c2327e48ee4b72177046b3b6222e7dc266638b6d893b291bad	2026-09-16 10:14:31.652-03	20260916131431_add_card_to_transactionpnpm	\N	\N	2026-09-16 10:14:31.638943-03	1
b6f5c002-b7a9-4a49-a47f-4dd90eb5b414	0f1bc6a4cbda21f9448ddd119fb045b84cef98b3871686b45d1d5e9f7badafc8	2026-09-21 05:53:30.494496-03	20260921085330_add_installments_to_transaction	\N	\N	2026-09-21 05:53:30.492745-03	1
\.


--
-- Name: Card Card_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Card"
    ADD CONSTRAINT "Card_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: Invoice Invoice_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_pkey" PRIMARY KEY (id);


--
-- Name: PaymentMethod PaymentMethod_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PaymentMethod"
    ADD CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY (id);


--
-- Name: Transaction Transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Card Card_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Card"
    ADD CONSTRAINT "Card_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Category Category_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Invoice Invoice_cardId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES public."Card"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PaymentMethod PaymentMethod_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PaymentMethod"
    ADD CONSTRAINT "PaymentMethod_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Transaction Transaction_cardId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES public."Card"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Transaction Transaction_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Transaction Transaction_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public."Invoice"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Transaction Transaction_paymentMethodId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES public."PaymentMethod"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Transaction Transaction_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict pq4VZ86mWobERchjUfE0PlAyDjMcp9bATEicZCMIvPavogzuXXoMqR36MB5XGZg

