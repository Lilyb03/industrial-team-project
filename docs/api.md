# API Documentation

Base URL:

`/api`

All POST request bodies have content type `application/json`.

## Feature List

- [X] Sign-ups & login
- [X] get account data (balance and previous transactions)
- [X] make transaction
- [X] get details (like name, personal/company account etc.) for any account number
- [ ] receive transaction with notification
- [X] account permissions
- [ ] create, update, delete db entries (except transactions)
- [ ] Authentication

## Authentication

## Objects

### Account Data

The account data object is used to store account data which is then displayed to the user. This can only be requested by the user who owns the account.

Keys:

`account_number` integer - the number of the account for which data is stored

`balance` integer - the current account balance in pence

`permissions` string - either "customer", "company", or "admin" depending on level of permissions

`green_score` double - the account's current environmental green score

`transactions` array - a list of transaction objects

Example:

```json
{
	"account_number": 000000000,
	"balance": 100,
	"permissions": 0,
	"green_score": 10,
	"transactions": [
		{
			"timestamp": 1726657966,
			"sender": 000000000,
			"recipient": 000000001,
			"green_score": 0,
			"amount": 100
		}
	]
}
```

### Transaction

The transaction object is used to store data for a specific transaction.

Keys:

`timestamp` integer - unix timestamp of when transaction was carried out

`sender` integer - the account number of the sender

`recipient` integer - the account number of the recipient

`green_score` double - the green score of this transaction

`amount` integer - the amount transferred in pence

Example:

```json
{
	"timestamp": 1726657966,
	"sender": 000000000,
	"recipient": 000000001,
	"green_score": 0,
	"amount": 100
}
```

### Account Details

The object used to store details regarding the account - this information is public and can be requested by anyone.

Keys:

`account_number` integer - the account number

`account_type` integer - the type of account: 0 = personal, 1 = company

`name` string - user's first name or company name

`last_name` string - user's last name (null for company)

`company` object - company object (null if account is personal)

### Company

The object used to store the details of a company - this information is public and can be requested by anyone.

Keys:

`company_name` string - the name of the company

`spending_category` string - the category in which the company operates

`carbon_emissions` integer - the company's carbon emissions rating

`waste_management` integer - the company's waste management rating

`sustainability_practices` integer - the company's sustainability rating

`rag_score` double - the company's calculated RAG score

`account_number` integer - the company's account number

## Routes

### Sign up

This route is used to sign a user up to the app.

#### Request

Endpoint:
`POST /signup`

Required JSON keys:

`username` string - The requested username must be unique

`name` string - the user's first name or company namy

`last_name` string - the user's last name (null for companies)

`password` string - User's password

Optional JSON keys:

`initial_balance` integer - Defaults to 0. - The requested size of the initial transaction from account of many

`idempotency_key` string - random 10 character hex string to be used for idempotency

#### Response

Keys:

`type` integer - response type: 0 = success, 1 = failure  (more details in message key)

`message` string - relevant error or success message

`account_number` integer - the created account's account number

`account_data` object - relevant account data object (null if not applicable - e.g. if sign-up failed)

### Login

This route is used when a user is logging into the app.

#### Request

Endpoint:
`POST /login`

Required JSON keys:

`username` string - the user's username

`password` string - the user's password

#### Response

Keys:

`type` integer - response type: 0 = success, 1 = failure (more details in message key)

`message` string - relevant error or success message

`account_data` object - the user's account data object (null if not applicable - e.g. if login failed)

### Balance

This route is used to get the balance and transaction history of the current user. No other user is able to receive this data

#### Request

Endpoint:
`GET /balance`

Required GET parameters:

`account` integer - the account number the balance/data is requested for

Optional GET parameters:

`start_date` string - Defaults to 7 days before current date - the start date for which transactions are requested in `dd-mm-yyyy` format

`end_date` string - Defaults to current date - the end date for which transactions are requested in `dd-mm-yyyy` format

#### Response

Keys:

`type` integer - response type: 0 = success, 1 = failure, 2 = insufficient permissions (more details in message key)

`message` string - relevant error or success message

`account_data` object - account data object for the requested account

### Account Search

This route can be used to search for public account details based on an account number or name.

#### Request

Endpoint:
`GET /account`

Optional GET parameters:

`account` integer - the account number the data is requested for

`name` string - the name data is requested for

#### Response

!!! note
	The `data` key is constrained to 5 accounts

Keys:

`type` integer - response type: 0 = success, 1 = failure (more details in message key)

`message` string - relevant error or success message

`data` array - array of account details

### Company Search

This route can be used to search for companies based on a certain spending category.

#### Request

Endpoint:
`GET /account`

Required GET parameters:

`category` string - the spending category to search for


#### Response

!!! note
	The `data` key is constrained to 5 accounts

Keys:

`type` integer - response type: 0 = success, 1 = failure (more details in message key)

`message` string - relevant error or success message

`data` array - array of company details

### Transaction

This route is used to initiate a transaction.

#### Request

Endpoint:
`POST /transaction`

Required JSON keys:

`sender` integer - account number of sender

`recipient` integer - account number of recipient

`amount` double - amount to be transferred

#### Response

Keys:

`type` integer - response type: 0 = success, 1 = failure (more details in message key)

`message` string - relevant error or success message

`transaction` object - transaction object (null if not relevant)
