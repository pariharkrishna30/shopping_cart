# eshopping

Full-stack eCommerce application with a React storefront/admin client and a Laravel REST API.

## Stack

- Frontend: React + Vite + React Router + React Query + Zustand
- Backend: Laravel 12 REST API + Sanctum
- Database: MySQL
- Payments: Stripe Payment Intents

## Structure

- `api/` Laravel backend
- `web/` React frontend

## Backend setup

1. Copy `api/.env.example` to `api/.env`
2. Configure MySQL and Stripe keys
3. Run `composer install`
4. Run `php artisan key:generate`
5. Run `php artisan migrate --seed`
6. Run `php artisan storage:link`
7. Run `php artisan serve`

Demo accounts after seeding:

- Admin: `admin@eshopping.test` / `password`
- Customer: `customer@eshopping.test` / `password`

## Frontend setup

1. Copy `web/.env.example` to `web/.env`
2. Set `VITE_API_URL` and `VITE_STRIPE_PUBLISHABLE_KEY`
3. Run `npm install`
4. Run `npm run dev`

## Features

- User auth: register, login, logout, password reset token flow
- Storefront: category filters, search, product detail pages
- Cart: guest local persistence and authenticated cart sync
- Checkout: shipping form, Stripe PaymentElement, order confirmation
- Account: profile updates, order history, order status visibility
- Admin: sales dashboard, category CRUD, product CRUD with uploads, order status updates, user block/unblock

## API docs

Postman collection: [docs/postman_collection.json](docs/postman_collection.json)
