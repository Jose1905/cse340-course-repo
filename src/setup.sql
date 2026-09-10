DROP TABLE IF EXISTS organizations;
CREATE TABLE organizations (
	id SERIAL PRIMARY KEY,
	name VARCHAR(150) NOT NULL,
	description TEXT NOT NULL,
	contact_email VARCHAR(255) NOT NULL,
	logo_filename VARCHAR(255) NOT NULL
);
INSERT INTO organizations (
		name,
		description,
		contact_email,
		logo_filename
	)
VALUES (
		'BrightFuture Builders',
		'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
		'info@brightfuturebuilders.org',
		'brightfuture-logo.png'
	),
	(
		'GreenHarvest Growers',
		'An urban farming collective promoting food sustainability and education in local neighborhoods.',
		'contact@greenharvest.org',
		'greenharvest-logo.png'
	),
	(
		'UnityServe Volunteers',
		'A volunteer coordination group supporting local charities and service initiatives.',
		'hello@unityserve.org',
		'unityserve-logo.png'
	);
DROP TABLE IF EXISTS service_projects;
CREATE TABLE service_projects (
	project_id SERIAL PRIMARY KEY,
	organization_id INTEGER NOT NULL,
	title varchar(50) NOT NULL,
	description TEXT NOT NULL,
	location TEXT NOT NULL,
	date DATE NOT NULL,
	FOREIGN KEY (organization_id) REFERENCES organizations(id)
);
INSERT INTO service_projects (
		organization_id,
		title,
		description,
		location,
		date
	)
VALUES -- Organization 1
	(
		1,
		'Community Food Drive',
		'Collect and distribute food to local families.',
		'Community Center',
		'2026-10-10'
	),
	(
		1,
		'Neighborhood Cleanup',
		'Clean streets and public areas in the community.',
		'Downtown',
		'2026-10-17'
	),
	(
		1,
		'Clothing Donation Drive',
		'Collect clothing donations for families in need.',
		'Community Center',
		'2026-10-24'
	),
	(
		1,
		'Senior Support Day',
		'Help elderly community members with household tasks.',
		'Senior Center',
		'2026-10-31'
	),
	(
		1,
		'Park Restoration',
		'Clean and improve a local public park.',
		'Central Park',
		'2026-11-07'
	),
	-- Organization 2
	(
		2,
		'Tree Planting Project',
		'Plant trees to improve the local environment.',
		'Riverside Park',
		'2026-10-11'
	),
	(
		2,
		'Recycling Campaign',
		'Collect recyclable materials from the community.',
		'City Plaza',
		'2026-10-18'
	),
	(
		2,
		'Community Garden',
		'Help create and maintain a community garden.',
		'Community Garden',
		'2026-10-25'
	),
	(
		2,
		'River Cleanup',
		'Remove trash and waste from the river area.',
		'River Walk',
		'2026-11-01'
	),
	(
		2,
		'Environmental Workshop',
		'Teach community members about environmental conservation.',
		'Public Library',
		'2026-11-08'
	),
	-- Organization 3
	(
		3,
		'Youth Mentoring',
		'Provide mentoring and educational support to young people.',
		'Youth Center',
		'2026-10-12'
	),
	(
		3,
		'School Supply Drive',
		'Collect school supplies for students in need.',
		'Local School',
		'2026-10-19'
	),
	(
		3,
		'Reading Program',
		'Help children improve their reading skills.',
		'Public Library',
		'2026-10-26'
	),
	(
		3,
		'Sports Day',
		'Organize recreational sports activities for children.',
		'Sports Complex',
		'2026-11-02'
	),
	(
		3,
		'Community Education Fair',
		'Provide educational resources and information to families.',
		'Community Center',
		'2026-11-09'
	);
DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
	category_id SERIAL PRIMARY KEY,
	category_name VARCHAR(50) NOT NULL
);
DROP TABLE IF EXISTS project_categories;
CREATE TABLE project_categories (
	category_id INTEGER NOT NULL,
	project_id INTEGER NOT NULL,
	PRIMARY KEY (category_id, project_id),
	FOREIGN KEY(category_id) REFERENCES categories(category_id),
	FOREIGN KEY(project_id) REFERENCES service_projects(project_id)
);
INSERT INTO categories (category_name)
VALUES ('Environmental & Conservation'),
	('Community & Social Support'),
	('Youth & Education');
INSERT INTO project_categories (category_id, project_id)
VALUES (1, 2),
	(1, 5),
	(1, 6),
	(1, 7),
	(1, 8),
	(1, 9),
	(1, 10),
	(2, 1),
	(2, 3),
	(2, 4),
	(3, 11),
	(3, 12),
	(3, 13),
	(3, 14),
	(3, 15);