DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

CREATE TYPE type_names as ENUM ('customer', 'company', 'admin');

CREATE TABLE details (
  details_id INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NULL
);

CREATE TABLE type (
  type_id INT PRIMARY KEY,
  type_name type_names NOT NULL
);

CREATE TABLE company (
  company_id INT NOT NULL PRIMARY KEY,
  details_id INT NOT NULL,
  spending_category VARCHAR(255) NOT NULL,
  carbon REAL NOT NULL DEFAULT 0.0,
  waste REAL NOT NULL DEFAULT 0.0,
  sustainability REAL NOT NULL DEFAULT 0.0,
  greenscore REAL NOT NULL DEFAULT 0.0,
  CONSTRAINT fk_details_company FOREIGN KEY (details_id) REFERENCES details (details_id)
);

CREATE TABLE account (
  accountNumber INT NOT NULL,
  details_id INT NULL,
  company_id INT NULL,
  type_id INT NOT NULL,
  amount INT NOT NULL,
  PRIMARY KEY (accountNumber),
  CONSTRAINT fk_details_account FOREIGN KEY (details_id) REFERENCES details (details_id),
  CONSTRAINT fk_company_account FOREIGN KEY (company_id) REFERENCES company (company_id),
  CONSTRAINT fk_type_account FOREIGN KEY (type_id) REFERENCES type (type_id)
);

