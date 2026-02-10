# Living Project Map

## A. Project Overview

This project is a comprehensive budgeting and financial management application designed to help users track their income, expenses, accounts, and investments. It features significant capabilities for managing recurring transactions (bills), multi-currency support, and ledger-based organization, allowing for potential collaboration or separation of financial contexts. The application is built as a monorepo with a React frontend and a NestJS backend.

## B. Key Technology Stack

### Frontend (Client)

- **Framework:** React v19
- **Build Tool:** Vite v7
- **Language:** TypeScript ~v5.9
- **Styling:** TailwindCSS v4, Radix UI, Shadcn UI
- **State Management:** Zustand v5, TanStack Query v5
- **Routing:** React Router v7
- **Key Libraries:**
    - `better-auth` v1.4.17: Authentication
    - `i18next` v25.8.0: Internationalization
    - `luxon` v3.7.2: Date/Time manipulation
    - `zod` v4.3.5: Schema validation

### Backend (Server)

- **Framework:** NestJS v11
- **Language:** TypeScript v5.7
- **Database:** MongoDB v7 (via Mongoose v9)
- **Runtime:** Node.js (implied by `@types/node` v22)
- **Key Libraries:**
    - `better-auth` v1.4.11: Authentication
    - `nestjs-i18n` v10.6.0: Internationalization
    - `nodemailer` v8.0.0: Email services
    - `currencyapi-js` v1.0.6: Currency conversion
    - `zod` v4.3.5: Schema validation

## C. Project Structure

```text
/
├── .agents/                 # Agent-specific configurations and context
├── client/                  # Frontend Application
│   ├── src/
│   │   ├── api/             # API client/definitions
│   │   ├── components/      # Reusable UI components
│   │   ├── constants/       # Global constants
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility libraries and helpers
│   │   ├── locale/          # i18n locale files
│   │   ├── pages/           # Application Route Components
│   │   ├── services/        # API service integrations
│   │   ├── stores/          # Global state stores (Zustand)
│   │   ├── types/           # TypeScript type definitions
│   │   └── ...
│   └── ...config files (vite.config.ts, tailwind.config.ts, etc.)
├── server/                  # Backend Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/         # REST API Module Controllers (Routes)
│   │   │   ├── modules/     # Domain Services and Internal Modules
│   │   │   └── ...
│   │   ├── config/          # Application Configuration
│   │   ├── constants/       # Server-side constants
│   │   ├── i18n/            # Server-side translations
│   │   ├── pipes/           # NestJS Pipes (Validation/Transformation)
│   │   ├── types/           # Server-side type definitions
│   │   └── ...
│   └── ...config files (nest-cli.json, tsconfig.json, etc.)
├── shared/                  # Shared Types/DTOs between Client and Server
└── skills/                  # Agent skills and capabilities
```

## D. Implemented Features

- **Authentication & User Management**
    - User Registration and Login
    - Email Verification
    - Password Reset/Forgot Password flows
    - Profile Management
    - OAuth support (integrated via Better Auth)

- **Financial Tracking**
    - **Transactions:** Create, read, update, and delete income/expense records.
    - **Accounts:** Manage bank, cash, and other asset accounts.
    - **Ledgers:** Organize transactions into specific ledgers (e.g., Personal, Joint).
    - **Recurring Transactions (Bills):** Manage and automate recurring payments.
    - **Categories:** Categorize transactions for analysis.

- **Advanced Features**
    - **Multi-Currency:** Support for multiple currencies and conversion (via Currency API).
    - **Jobs:** Background job processing (likely for recurring transactions).
    - **Sharing:** Share access to ledgers or accounts with other users.
    - **Stock:** Tracking of stock investments.
    - **Internationalization (i18n):** Full support for multiple languages (detected: English, Hebrew).
