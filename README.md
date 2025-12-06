# Product Showcase & Enquiry System

A full-stack application built with React (frontend), Node.js/Express (backend), and SQLite (database) that allows users to browse products, view details, and submit enquiries.

## Features

### Frontend (React)
- Responsive product listing with search and category filtering
- Product details view with enquiry form
- Real-time form validation
- Admin panel to view all submitted enquiries
- Mobile-responsive design

### Backend (Node.js/Express)
- RESTful API endpoints for products and enquiries
- Database operations with SQLite
- Input validation and error handling
- Pagination and filtering support

### Database (SQLite)
- Products table with sample data
- Enquiries table with foreign key relationship
- Pre-populated with 12 sample products

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- Git

## Installation & Setup

### 1. Clone the Repository
```
git clone https://github.com/Sanjeevan1122003/products-showcase.git
cd product-showcase-enquiry
```
### 2. Set Up Backend
```
cd backend
npm install
```
### 3. Set Up Frontend
```
cd frontend
npm install
```
### 4. Initialize Database
```
cd backend
npm run seed
```
## Running the Application
### Terminal 1 - Backend Server
```
cd backend
npm run dev
```
Backend will run on http://localhost:3001

### Terminal 2 - Frontend Development Server
```
cd frontend
npm start
```
Frontend will run on http://localhost:3000

## API Endpoints
### Products
- GET /api/products - Get all products with pagination
- GET /api/products/:id - Get single product by ID
- GET /api/products/categories - Get unique categories

### Enquiries
- GET /api/enquiries - Get all enquiries (admin endpoint)
- POST /api/enquiries - Submit new enquiry
- PUT /api/enquiries/:id/status- Update the status of the enquiry

## Project Structure
```
PRODUCT-SHOWCASE-ENQUIRY/
│
├── backend/
│   ├── routes/
│   │   ├── enquiries.js
│   │   ├── products.js
│   ├── .env
│   ├── db.js
│   ├── index.js
│   ├── products.db
│   ├── schema.sql
│   ├── seed.js
│   ├── seed.sql
│   ├── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── EnquiryForm.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── ProductList.jsx
│   │   ├── styles/
│   │   │   ├── AdminPanel.css
│   │   │   ├── EnquiryForm.css
│   │   │   ├── ProductDetails.css
│   │   │   ├── ProductList.css
│   │   │   ├── App.css
│   │   ├── App.js
│   │   ├── App.test.js
│   │   ├── index.js
│   │   ├── index.css
│   │   ├── logo.svg
│   │   ├── reportWebVitals.js
│   │   ├── setupTests.js
│   ├── package.json
│
└── README.md   ← (This file)
```
## Features in Detail
### Product Browsing
- View all products in a responsive grid
- Search products by name or description
- Filter by categories (Electronics, Books, etc.)
- Pagination for better performance

### Product Details
-View detailed product information
-See product images, price, rating, and stock status
-Submit enquiry for specific products

### Enquiry System
- Submit enquiries with contact information
- Real-time form validation
- Success/error feedback
- General enquiries (not tied to specific products)

### Admin Panel
- View all submitted enquiries
- See enquiry status and timestamps
- Filter and manage enquiries
- Update enquiry status

## Database Schema
### Products Table
```
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  short_desc TEXT NOT NULL,
  long_desc TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  stock_quantity INTEGER DEFAULT 100,
  rating DECIMAL(3, 2) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```
- id (primary key)
- name, category, description
- price, image_url
- stock_quantity, rating
- created_at timestamp

### Enquiries Table
```
CREATE TABLE enquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);
```
- id (primary key)
- product_id (foreign key to products)
- name, email, phone, message
- status (default: 'pending')
- created_at timestamp

## Features Implemented
### Backend:
- Express REST API with proper error handling
- SQLite database with schema and seed data
- Full CRUD operations for products and enquiries
- Input validation and sanitization
- Pagination and filtering
- CORS enabled

### Frontend:
- Responsive React application
- Product listing with search and filter
- Product details page
- Enquiry form with validation
- Admin panel to view enquiries
- Mobile-friendly design
  
### Database:
- Proper relational schema with foreign keys
- Sample data (12 products, 4 enquiries)
- Indexes for performance
- Timestamps for all records

### Bonus Features:
- Server-side pagination
- Real-time form validation
- Error boundaries
- Responsive design
- Comprehensive documentation

## License
This project is created for GVCC Solutions Company Assignment. Educational use only.

## Author
**Sanjeevan Thangaraj**  
📧 [sanjeevan1122003@gmail.com]  
🔗 [GitHub Profile](https://github.com/Sanjeevan1122003/)

⭐ **If you like this project, consider giving it a star on GitHub!**
