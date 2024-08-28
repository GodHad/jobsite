--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS;
CREATE ROLE u_recoore;
ALTER ROLE u_recoore WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'md5549558e086869d0edbbcb997b5cede91';






--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

-- Dumped from database version 12.20 (Ubuntu 12.20-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.20 (Ubuntu 12.20-0ubuntu0.20.04.1)

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
-- PostgreSQL database dump complete
--

--
-- Database "db_recoore" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 12.20 (Ubuntu 12.20-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.20 (Ubuntu 12.20-0ubuntu0.20.04.1)

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
-- Name: db_recoore; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE db_recoore WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8';


ALTER DATABASE db_recoore OWNER TO postgres;

\connect db_recoore

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
-- Name: job_application; Type: TABLE; Schema: public; Owner: u_recoore
--

CREATE TABLE public.job_application (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "positionId" integer NOT NULL,
    firstname character varying NOT NULL,
    lastname character varying NOT NULL,
    email character varying NOT NULL,
    "resumeFileName" character varying NOT NULL,
    "coverLetter" character varying NOT NULL,
    "linkedinProfile" character varying NOT NULL,
    website character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.job_application OWNER TO u_recoore;

--
-- Name: job_application_id_seq; Type: SEQUENCE; Schema: public; Owner: u_recoore
--

CREATE SEQUENCE public.job_application_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.job_application_id_seq OWNER TO u_recoore;

--
-- Name: job_application_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: u_recoore
--

ALTER SEQUENCE public.job_application_id_seq OWNED BY public.job_application.id;


--
-- Name: position; Type: TABLE; Schema: public; Owner: u_recoore
--

CREATE TABLE public."position" (
    id integer NOT NULL,
    "jobTitle" character varying NOT NULL,
    "jobLocation" character varying NOT NULL,
    "jobDescription" character varying NOT NULL,
    "companyName" character varying NOT NULL,
    "companySize" character varying NOT NULL,
    "companyIndustry" character varying NOT NULL,
    "companyAbout" character varying NOT NULL,
    "companyImageUrl" character varying,
    "jobExternalUrl" character varying,
    "jobApplicationType" character varying DEFAULT 'internal'::character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."position" OWNER TO u_recoore;

--
-- Name: position_id_seq; Type: SEQUENCE; Schema: public; Owner: u_recoore
--

CREATE SEQUENCE public.position_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.position_id_seq OWNER TO u_recoore;

--
-- Name: position_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: u_recoore
--

ALTER SEQUENCE public.position_id_seq OWNED BY public."position".id;


--
-- Name: saved_position; Type: TABLE; Schema: public; Owner: u_recoore
--

CREATE TABLE public.saved_position (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "positionId" integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.saved_position OWNER TO u_recoore;

--
-- Name: saved_position_id_seq; Type: SEQUENCE; Schema: public; Owner: u_recoore
--

CREATE SEQUENCE public.saved_position_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.saved_position_id_seq OWNER TO u_recoore;

--
-- Name: saved_position_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: u_recoore
--

ALTER SEQUENCE public.saved_position_id_seq OWNED BY public.saved_position.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: u_recoore
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    email character varying NOT NULL,
    "linkedinId" character varying NOT NULL,
    firstname character varying,
    lastname character varying,
    "linkedinPhotoUrl" character varying NOT NULL,
    "linkedinProfileUrl" character varying,
    "resumeFileName" character varying,
    "coverLetter" character varying,
    "linkedinProfile" character varying,
    website character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."user" OWNER TO u_recoore;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: u_recoore
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO u_recoore;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: u_recoore
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: job_application id; Type: DEFAULT; Schema: public; Owner: u_recoore
--

ALTER TABLE ONLY public.job_application ALTER COLUMN id SET DEFAULT nextval('public.job_application_id_seq'::regclass);


--
-- Name: position id; Type: DEFAULT; Schema: public; Owner: u_recoore
--

ALTER TABLE ONLY public."position" ALTER COLUMN id SET DEFAULT nextval('public.position_id_seq'::regclass);


--
-- Name: saved_position id; Type: DEFAULT; Schema: public; Owner: u_recoore
--

ALTER TABLE ONLY public.saved_position ALTER COLUMN id SET DEFAULT nextval('public.saved_position_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: u_recoore
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Data for Name: job_application; Type: TABLE DATA; Schema: public; Owner: u_recoore
--

COPY public.job_application (id, "userId", "positionId", firstname, lastname, email, "resumeFileName", "coverLetter", "linkedinProfile", website, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: position; Type: TABLE DATA; Schema: public; Owner: u_recoore
--

COPY public."position" (id, "jobTitle", "jobLocation", "jobDescription", "companyName", "companySize", "companyIndustry", "companyAbout", "companyImageUrl", "jobExternalUrl", "jobApplicationType", "createdAt", "updatedAt") FROM stdin;
191	Business Development Manager	Tel Aviv		Goldtec Technologies Ltd.	17	Defense and Space Manufacturing	Goldtec Technologies Ltd. is a system developing, manufacturing, integrating, and distributing, Israel based company. Our subsidiaries include Goldtec Multimedia, Military DVRs, and Thermal Beacon.	\N	https://www.goldtec.co.il/career/	external	2023-09-17 12:40:18.214167	2023-09-17 12:40:18.214167
192	Senior Software Development Engineer	Seattle, WA		Amazon	1115358	Technology, Information and Internet	Amazon is guided by four principles: customer obsession rather than competitor focus, passion for invention, commitment to operational excellence, and long-term thinking. We are driven by the excitement of building technologies, inventing products, and providing services that change lives. We embrace new ways of doing things, make decisions quickly, and are not afraid to fail. We have the scope and capabilities of a large company, and the spirit and heart of a small one.	\N	https://www.amazon.jobs/en/jobs/2449176/senior-software-development-engineer	external	2023-09-22 09:40:03.266756	2023-09-22 09:40:03.266756
193	Module Lead - Imaging & Sensing Technology Group	Cupertino, California		Apple	457882	Computers and Electronics Manufacturing	We’re a diverse collective of thinkers and doers, continually reimagining what’s possible to help us all do what we love in new ways. And the same innovation that goes into our products also applies to our practices — strengthening our commitment to leave the world better than we found it. This is where your work can make a difference in people’s lives. Including your own.	\N	https://jobs.apple.com/en-il/details/200490066/module-lead-imaging-sensing-technology-group?team=HRDWR	external	2023-09-22 09:40:03.266756	2023-09-22 09:40:03.266756
194	Cost Controller - Junior	Munich		Siemens	267821	Automation Machinery Manufacturing	Siemens is a technology company focused on industry, infrastructure, transport, and healthcare. From more resource-efficient factories, resilient supply chains, and smarter buildings and grids, to cleaner and more comfortable transportation as well as advanced healthcare, the company creates technology with purpose adding real value for customers. By combining the real and the digital worlds, Siemens empowers its customers to transform their industries and markets, helping them to transform the everyday for billions of people. Siemens also owns a majority stake in the publicly listed company Siemens Healthineers, a globally leading medical technology provider shaping the future of healthcare. In addition, Siemens holds a minority stake in Siemens Energy, a global leader in the transmission and generation of electrical power.	\N	https://jobs.siemens.com/careers?query=israel	external	2023-09-22 09:40:03.266756	2023-09-22 09:40:03.266756
195	Lead Travel Operations Specialist	Boston, MA		GE	232988	Industrial Machinery Manufacturing	GE rises to the challenge of building a world that works. For more than 125 years, GE has invented the future of industry, and today the company’s dedicated team, leading technology, and global reach and capabilities help the world work more efficiently, reliably, and safely. GE’s people are diverse and dedicated, operating with the highest level of integrity and focus to fulfill GE’s mission and deliver for its customers. www.ge.com	\N	https://jobs.gecareers.com/global/en/job/R3734686/Lead-Travel-Operations-Specialist	external	2023-09-22 09:40:03.266756	2023-09-22 09:40:03.266756
196	Financial Analyst	Palo Alto, CA		HP	188097	IT Services and IT Consulting	Our vision is to create a world where innovation drives extraordinary contributions to humanity. This vision guides everything we do, how we do it, and why we do it.	\N	https://jobs.hp.com/search-results/?business_unit=Israel	external	2023-09-22 09:40:03.266756	2023-09-22 09:40:03.266756
197	ATL Manager - Maternity Leave Replacement	Suwon-Si, Gyeonggi-Do		Samsung Electronics	170848	Computers and Electronics Manufacturing	Samsung Electronics is a global leader in technology, opening new possibilities for people everywhere. Through relentless innovation and discovery, we are transforming the worlds of TVs, smartphones, wearable devices, tablets, digital appliances, network systems, medical devices, semiconductors and LED solutions. Samsung is also leading in the Internet of Things space through, among others, our Smart Home and Digital Health initiatives.	\N	https://sec.wd3.myworkdayjobs.com/Samsung_Careers/1/refreshFacet/318c8bb6f553100021d223d9780d30be	external	2023-09-22 09:40:03.266756	2023-09-22 09:40:03.266756
198	Software Principal Engineer	Round Rock, Texas		Dell Technologies	153187	IT Services and IT Consulting	Technology drives human progress. This tenet is the core of our business and vision. Our customers and team members are integral to our continuing success as we provide the essential infrastructure for organizations to transform their digital futures.	\N	https://jobs.dell.com/job/gelil-yam/software-principal-engineer/375/54253719360	external	2023-09-22 09:40:03.266756	2023-09-22 09:40:03.266756
199	Internship at AI Research Team	Gerlingen-Schillerhöhe, Baden-Wuerttemberg		Bosch	146515	Technology, Information and Internet	The Bosch Group is a leading global supplier of technology and services. It employs roughly 402,600 associates worldwide (as of December 31, 2021). The company generated sales of 78.7 billion euros in 2021. Its operations are divided into four business sectors: Mobility Solutions, Industrial Technology, Consumer Goods, and Energy and Building Technology.	\N	https://jobs.smartrecruiters.com/BoschGroup/743999913934263-internship-at-ai-research-team?trid=a955befe-4b1f-45e2-82af-7d8f328db913	external	2023-09-22 09:40:03.266756	2023-09-22 09:40:03.266756
200	Android Team Leader	New York		Fiverr	144403	Technology, Information and Internet	Fiverr is a global platform connecting businesses with on-demand freelancers in the simplest way possible, helping anyone anywhere succeed.	\N	https://www.fiverr.com/jobs/Q0IuRDM1	external	2023-09-22 09:40:03.266756	2023-09-22 09:40:03.266756
201	(Senior) Specialist Solution Advisor in the Cloud Architecture & Advisory Team - Israel	Walldorf, BW		SAP	126982	Software Development	At SAP, our purpose is to help the world run better and improve people’s lives. Our promise is to innovate to help our customers run at their best. SAP is committed to helping every customer become a best-run business. We engineer solutions to fuel innovation, foster equality, and spread opportunity across borders and cultures. Together, with our customers and partners, we can transform industries, grow economies, lift up societies, and sustain our environment. #TheBestRun	\N	https://jobs.sap.com/job/Ra&amp;apos;anana-%28Senior%29-Specialist-Solution-Advisor-in-the-Cloud-Architecture-&amp;-Advisory-Team-Israel-4366202/960876901/	external	2023-09-22 09:40:03.266756	2023-09-22 09:40:03.266756
\.


--
-- Data for Name: saved_position; Type: TABLE DATA; Schema: public; Owner: u_recoore
--

COPY public.saved_position (id, "userId", "positionId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: u_recoore
--

COPY public."user" (id, email, "linkedinId", firstname, lastname, "linkedinPhotoUrl", "linkedinProfileUrl", "resumeFileName", "coverLetter", "linkedinProfile", website, "createdAt", "updatedAt") FROM stdin;
3	silismr@gmail.com	MmiAETQn-y	Moran	Silis	https://media.licdn.com/dms/image/C4E03AQFII7ct9vZ0Uw/profile-displayphoto-shrink_100_100/0/1517617613346?e=1687392000&v=beta&t=NsO8eV0RK-20UsVqhsls0D-AznwC-OjqPCzAEUGINDg	\N	\N	\N	\N	\N	2021-09-16 16:20:32.57479	2023-04-18 10:18:24.083306
1	contact@uxsysdev.com	loBjUzZHwJ	Richard	Teran	https://media-exp1.licdn.com/dms/image/C4E03AQH3cLlkTX439A/profile-displayphoto-shrink_100_100/0/1557702997334?e=1637798400&v=beta&t=f3RkOgm1SoGJzmCvKZ8s_u_NLeSjPUz_nrKadA4zULQ	https://www.linkedin.com/in/username	igg1qcktfuucog-coolfreecv_resume_en_06_n.docx	Cover Letter	\N	\N	2021-09-11 13:21:54.287206	2021-09-20 12:21:02.508619
2	silis25@gmail.com	FojGK2QFQE	Kfir	Silis	https://media.licdn.com/dms/image/v2/D4D03AQEsE9n5hTJt9w/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1693926067768?e=1729728000&v=beta&t=HbRvAYnhFKakI3CZwtkkGlQOW-bXNIX6MetlGWAoTPY	https://www.linkedin.com/in/kfirsilis/	igg5h3ll6avapzo-zSilis.pdf	Lots of candidates say they can do anything and everything for you. \r\n\r\nI am *not* one of them. \r\n\r\nI'm not a jack of all trades, but over the years I have mastered one thing really well: *Sales*\r\n\r\nIf you seek to enhance your product adoption or increase your revenue funnel or both, I might be the guy for you.\r\n\r\nI invite you to give me a call. Within 5 minutes you can assess if I am the best fit for this position.\r\n\r\nIt's totally free and totally worth it :)\r\n\r\nCheers,\r\n\r\nSilis	\N	\N	2021-09-11 13:40:10.683414	2024-08-20 21:05:22.993293
\.


--
-- Name: job_application_id_seq; Type: SEQUENCE SET; Schema: public; Owner: u_recoore
--

SELECT pg_catalog.setval('public.job_application_id_seq', 7, true);


--
-- Name: position_id_seq; Type: SEQUENCE SET; Schema: public; Owner: u_recoore
--

SELECT pg_catalog.setval('public.position_id_seq', 201, true);


--
-- Name: saved_position_id_seq; Type: SEQUENCE SET; Schema: public; Owner: u_recoore
--

SELECT pg_catalog.setval('public.saved_position_id_seq', 14, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: u_recoore
--

SELECT pg_catalog.setval('public.user_id_seq', 3, true);


--
-- Name: position PK_b7f483581562b4dc62ae1a5b7e2; Type: CONSTRAINT; Schema: public; Owner: u_recoore
--

ALTER TABLE ONLY public."position"
    ADD CONSTRAINT "PK_b7f483581562b4dc62ae1a5b7e2" PRIMARY KEY (id);


--
-- Name: saved_position PK_b9bdb81f7172415c3fb6122d45d; Type: CONSTRAINT; Schema: public; Owner: u_recoore
--

ALTER TABLE ONLY public.saved_position
    ADD CONSTRAINT "PK_b9bdb81f7172415c3fb6122d45d" PRIMARY KEY (id);


--
-- Name: job_application PK_c0b8f6b6341802967369b5d70f5; Type: CONSTRAINT; Schema: public; Owner: u_recoore
--

ALTER TABLE ONLY public.job_application
    ADD CONSTRAINT "PK_c0b8f6b6341802967369b5d70f5" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: u_recoore
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: user UQ_7a3585fa16f77b70fa10d18ee1e; Type: CONSTRAINT; Schema: public; Owner: u_recoore
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_7a3585fa16f77b70fa10d18ee1e" UNIQUE ("resumeFileName");


--
-- Name: user UQ_e12875dfb3b1d92d7d7c5377e22; Type: CONSTRAINT; Schema: public; Owner: u_recoore
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);


--
-- Name: IDX_63eaa1a867177fafb61e256f90; Type: INDEX; Schema: public; Owner: u_recoore
--

CREATE INDEX "IDX_63eaa1a867177fafb61e256f90" ON public."position" USING btree ("companyIndustry");


--
-- Name: IDX_676456cb620ec54f62b39e8207; Type: INDEX; Schema: public; Owner: u_recoore
--

CREATE INDEX "IDX_676456cb620ec54f62b39e8207" ON public."position" USING btree ("companyAbout");


--
-- Name: IDX_b53cfabb35e6691a957d4be5e2; Type: INDEX; Schema: public; Owner: u_recoore
--

CREATE INDEX "IDX_b53cfabb35e6691a957d4be5e2" ON public."position" USING btree ("companyName");


--
-- Name: IDX_cec759fdcc10de3fcdb54331f9; Type: INDEX; Schema: public; Owner: u_recoore
--

CREATE INDEX "IDX_cec759fdcc10de3fcdb54331f9" ON public."position" USING btree ("jobDescription");


--
-- Name: IDX_f911d01f194409bd5e853fd633; Type: INDEX; Schema: public; Owner: u_recoore
--

CREATE INDEX "IDX_f911d01f194409bd5e853fd633" ON public."position" USING btree ("jobTitle");


--
-- Name: DATABASE db_recoore; Type: ACL; Schema: -; Owner: postgres
--

GRANT CONNECT ON DATABASE db_recoore TO u_recoore;


--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

-- Dumped from database version 12.20 (Ubuntu 12.20-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.20 (Ubuntu 12.20-0ubuntu0.20.04.1)

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
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--

