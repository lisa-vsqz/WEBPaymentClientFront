# CRUD MVC Project

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies](#technologies)
- [Architecture](#architecture)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

The **Client Frontend** is a web application built with **Next.js** that provides a comprehensive reporting and analysis interface for the company. It leverages powerful data visualization and grid tools from Kendo React UI to offer detailed insights into company operations. The application integrates with backend APIs to fetch real-time data and presents it in an intuitive and interactive manner.

This tool is designed for business clients to analyze the company's state and make informed decisions based on the provided reports.

## Features

- **Dynamic Reports**: Analyze company performance with data-driven insights.
- **Date Range Filters**: Filter data based on custom date ranges.
- **Interactive Grids**: Use grids for sorting, filtering, grouping, and exporting data.
- **PDF and Excel Export**: Export reports directly in PDF or Excel formats.
- **Role-Based Access**: Secure access through NextAuth.js authentication.
- **Customizable UI**: Tailored views with Kendo React's theme integration.

## Technologies

- **Framework**: Next.js
- **UI Library**: Kendo React UI
- **Styling**: Tailwind CSS, SCSS
- **Authentication**: NextAuth.js
- **Icons**: FontAwesome
- **State Management**: React Hooks
- **Data Visualization**: Kendo React Grid, Date Inputs, and Dropdowns
- **Build Tool**: Vercel (Next.js built-in support)

## Architecture

This project is a **frontend-only** application that integrates with backend APIs to provide a dynamic reporting platform. The key components include:

- **Reusable Components**: Shared components for grids, forms, and visualizations.
- **Pages**: Next.js pages designed for specific report views.
- **API Integration**: Fetches and processes data from backend endpoints.
- **Authentication**: Manages login and session states with NextAuth.js.

```plaintext
┌───────────┐       ┌─────────────┐        ┌───────────────┐
│   Client  │ <-->  │ Backend API │ <-->   │   Database    │
└───────────┘       └─────────────┘        └───────────────┘
   (Frontend)          (Data Logic)           (Storage)
```

## Setup and Installation

### Prerequisites

- **Node.js**: Install from [nodejs.org](https://nodejs.org/)
- **npm**: Comes with Node.js
- **Backend**: Ensure the backend is running and accessible

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/client-frontend.git
   cd client-frontend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   - Create a `.env.local` file in the root directory:
     ```env
     NEXTAUTH_URL=http://localhost:3000
     NEXTAUTH_SECRET=your_secret_key
     BACKEND_API_URL=http://localhost:4000
     ```

4. **Run the Development Server**

   ```bash
   npm run dev
   ```

5. **Build for Production**

   ```bash
   npm run build
   npm start
   ```

6. **Access the App**
   - Open your browser and go to `http://localhost:3000` (default port).

---

## Usage

Once the app is running, business clients can log in to access the reporting dashboard. The app provides tools to analyze data with features like:

- **Date Range Selection**: Filter reports based on a selected range of dates.
- **Grid Features**: Sort, group, and filter data dynamically.
- **Export Options**: Download reports in Excel or PDF formats.
- **Interactive Analysis**: View key insights such as overdue invoices, providers with the most outstanding payments, and liquidity analysis.

## API Endpoints

The application interacts with the backend using the following API endpoints:

- **Liquidity Analysis**

  - **GET** `/api/liquidityanalysis/status`: Fetch current liquidity status.

- **Invoices**

  - **GET** `/api/invoices`: Retrieve all invoices.
  - **GET** `/api/invoices?range={start}&{end}`: Fetch invoices within a specific date range.

- **Providers**

  - **GET** `/api/providers`: Fetch all providers.
  - **GET** `/api/providers/avoid`: Retrieve providers flagged as avoidable.

- **Suggested Payments**
  - **GET** `/api/payments/suggested-payments`: Fetch payment suggestions based on outstanding invoices.

Make sure the backend is running and accessible at the URL defined in your `.env.local` file.

## Contributing

We welcome contributions! If you'd like to enhance this project, please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m 'Add feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a pull request.

All contributions, including bug fixes, new features, and documentation improvements, are appreciated.

## License

This project is licensed under the MIT License.
