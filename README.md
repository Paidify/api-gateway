# api-gateway
API Gateway that connects Paidify client app to its services. It handles services availability by applying the SOA pattern Circuit Breaker.

## Built With
 - [Node.js](https://nodejs.org/es/)

 - [Express](https://expressjs.com/es/)

 - [MySQL](https://www.mysql.com/) 

 - [Visual Studio Code](https://code.visualstudio.com)

## Getting Started
You can clone this repsitory to get the source code

    git clone https://github.com/Paidify/api-gateway.git

On the project root directory, run

    npm start

This will start your server on port 3000

## Usage
All endpoints begin with the API Gateway version (currently, /v1). Whenever authentication is required, a token should be through the Authorization header with the Bearer schema.

### Auth Service
|Method + Enpoint|Resource|JSON Body Fields|Auth|
|--|--|--|--|
|POST /login|Authentication with access token as response|username, password||

### Queries Service
|Method + Enpoint|Resource|JSON Body Fields|Auth|
|--|--|--|--|
|GET /pay-concepts|Get all payment concepts available|||
|GET /pay-concepts/:id|Get payment concept by id [1-30]|||
|GET /pay-methods|Get all payment methods registered by users||admin|
|GET /pay-methods/:id|Get payment method by id||admin|
|GET /payments|Get all payments (pending or settled)||admin|
|GET /payment/:id|Get payment by id||admin|
|GET /pay-reqs|Get pending payments||admin|
|GET /pay-reqs/:id|Get pending payment by id||admin|
|GET /pay-settled|Get payments settled (successful or rejected)||admin|
|GET /pay-settled/:id|Get payment settled by id||admin|
|GET /invoices|Get all invoices (for successful payments)||admin|
|GET /invoices/:id|Get invoice by id||admin|
|GET /guests|Get all people who paid without being users||admin|
|GET /guests/:id|Get guest by id||admin|
|GET /users|Get all people who paid without being users||admin|
|GET /users/:id|Get user by id||user, admin|
|GET /users/:id/pay-methods|Get payment methods from user||user, admin|
|GET /users/:id/pay-methods/:id|Get payment method by id from user||user, admin|
|POST /users/:id/pay-methods|Create payment method|card_number, card_type (credit, debit), owner|user|
|DELETE /users/:id/pay-methods/:id|Delete payment method by id||user|
|GET /users/:id/pay-concepts|Get payment concepts available for user||user, admin|
|GET /users/:id/pay-concepts/:id|Get payment concept by id available for user||user, admin|
|GET /users/:id/payments|Get payments from user (pending or settled)||user, admin|
|GET /users/:id/payments/:id|Get payment by id from user||user, admin|
|GET /users/:id/invoices|Get invoices (for successful payments) from user||user, admin|
|GET /users/:id/invoices/:id|Get invoice by id from user||user, admin|

### Payment Service
#### For Guests
|Method + Enpoint|Resource|JSON Body Fields|Auth|
|--|--|--|--|
|POST /pay|Make a payment|date, num_installments, campus_id, payment_concept_id, cvv, exp_year, exp_month, first_name, last_name, email, doc_number, doc_type, card_number, card_type, owner||

#### For Users
|Method + Enpoint|Resource|JSON Body Fields|Auth|
|--|--|--|--|
|POST /pay|Make a payment|date, num_installments, campus_id, payment_concept_id, cvv, exp_year, exp_month, payment_method_id, user_id||

### Balance Service
|Method + Enpoint|Resource|JSON Body Fields|Auth|
|--|--|--|--|
|POST /check-balance|Check cards balance|user_id, card_numbers (array)||

## Acknowledgements

 - [Insomnia](https://insomnia.rest)
