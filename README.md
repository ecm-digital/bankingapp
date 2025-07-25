# Bank Employee App Prototype

A modern React-based application designed for bank employees to manage customers, transactions, products, and daily operations.

## Features

- **Dashboard** - Overview of daily operations and key metrics
- **Customer Management** - View and manage customer information
- **Transaction Processing** - Handle various banking transactions
- **Product Management** - Manage banking products and services
- **Queue Management** - Manage customer service queue
- **Reports** - Generate and view operational reports
- **Cards & Loans** - Manage credit cards and loan applications

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ecm-digital/bankingapp.git
cd bankingapp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components
│   └── ui/             # Basic UI components
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── stores/             # Zustand state stores
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── data/               # Mock data
└── api/                # API layer
```

## Features Overview

### Authentication
- Protected routes with role-based access
- Session management

### Customer Management
- Customer search and filtering
- Customer profile management
- Transaction history

### Transaction Processing
- Multiple transaction types
- Real-time validation
- Transaction history tracking

### Product Management
- Banking product catalog
- Product configuration
- Pricing management

### Queue Management
- Customer service queue
- Priority handling
- Service time tracking

## Development

This project uses modern React patterns and best practices:

- Functional components with hooks
- TypeScript for type safety
- Zustand for lightweight state management
- Custom hooks for business logic
- Component composition patterns
- Responsive design with Tailwind CSS

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is proprietary software developed for ECM Digital.