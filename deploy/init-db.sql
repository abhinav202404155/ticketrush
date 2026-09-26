-- Runs automatically on first container start (docker-entrypoint-initdb.d).
-- The POSTGRES_DB env var already creates ticketrush_auth; this adds the second.
CREATE DATABASE ticketrush_catalog;
