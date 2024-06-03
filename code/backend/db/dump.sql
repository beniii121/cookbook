PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE recipes (
	id integer PRIMARY KEY AUTOINCREMENT,
	title text,
	ingredients text,
	description text,
	notes text,
	image_path text,
	liked integer default 0,
	created date
);
DELETE FROM sqlite_sequence;
COMMIT;
