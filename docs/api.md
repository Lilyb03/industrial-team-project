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
			"transaction_id": 1,
			"timestamp": "2024-09-25T09:10:17.051Z",
			"sender_account": 000000000,
			"recipient_account": 000000001,
			"greenscore": 0,
			"amount": 100,
			"reference": "example"
		}
	]
}
```

### Transaction

The transaction object is used to store data for a specific transaction.

Keys:

`transaction_id` integer - sequential id of the transaction

`timestamp` string - string timestamp of when transaction was carried out

`sender_account` integer - the account number of the sender

`recipient_account` integer - the account number of the recipient

`greenscore` double - the green score of this transaction

`amount` integer - the amount transferred in pence

`reference` string - the transaction reference

Example:

```json
{
	"transaction_id": 1,
	"timestamp": "2024-09-25T09:10:17.051Z",
	"sender_account": 000000000,
	"recipient_account": 000000001,
	"greenscore": 0,
	"amount": 100,
	"reference": "example"
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

### Offer

The object used to store the details of an offer

Keys:

`discount_val` float - the value of the discount (as percentage of original price - e.g. `discount_val = 0.7` is equivalent to 30% off)

`discount_code` string - the discount code

`company` string - the name of the company the discount applies to

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
`GET /search/account`

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
`GET /search/company`

Required GET parameters:

`category` string - the spending category to search for


#### Response

!!! note
	The `data` key is constrained to 5 accounts

Keys:

`type` integer - response type: 0 = success, 1 = failure (more details in message key)

`message` string - relevant error or success message

`data` array - array of company details

### Offer Search

This route can be used to search for offers

#### Request

Endpoint:
`GET /search/offers`

#### Response

Keys:

`type` integer - response type: 0 = success, 1 = failure

`message` string - relevant error or success message

`data` array - array of offers

### Transaction

This route is used to initiate a transaction.

#### Request

Endpoint:
`POST /transaction`

Required JSON keys:

`sender` integer - account number of sender

`recipient` integer - account number of recipient

`amount` integer - amount to be transferred in pence

`reference` string - the transaction reference to be recorded

#### Response

Keys:

`type` integer - response type: 0 = success, 1 = failure (more details in message key)

`message` string - relevant error or success message

`transaction` object - transaction object (null if not relevant)

### Claim Offers

This route is used to claim offers.

#### Request

Endpoint:
`GET /claim-offer`

Required Params:

`account` integer - account number

#### Response

Keys:

`type` integer - response type: 0 = success, 1 = failure

`message` string - relevant error or success message
