# Commission Tracker

A modern web application for tracking insurance commissions and chargebacks. Built with Next.js, React, and Tailwind CSS.

## Features

- **Commission Calculator**: Calculate commissions based on insurance company and policy type
- **Chargeback Tracking**: Log and track chargebacks with reasons and amounts
- **Real-time Summary**: View total earnings, chargebacks, and net earnings
- **Data Persistence**: All data is saved locally in the browser
- **Responsive Design**: Works on desktop and mobile devices

## Insurance Companies & Rates

- **Aetna**: Auto (10%), Life (12%), Health (8%), Property (11%)
- **State Farm**: Auto (9%), Life (15%), Health (7%), Property (10%)
- **Liberty Mutual**: Auto (8%), Life (10%), Health (6%), Property (12%)

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ (for local development)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd commission-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically detect it's a Next.js project and deploy it

### Build Commands

```bash
npm run build  # Build for production
npm start      # Start production server
```

## Project Structure

```
commission-tracker/
├── app/
│   ├── layout.tsx    # Root layout with global styles
│   └── page.tsx      # Main application page
├── styles/
│   └── globals.css   # Global Tailwind CSS
├── public/           # Static assets
├── package.json      # Dependencies and scripts
├── tailwind.config.js # Tailwind configuration
└── tsconfig.json     # TypeScript configuration
```

## Usage

1. **Add Commission Entry**:
   - Fill in client name, select insurance company and policy type
   - Enter policy value and date
   - Click "Calculate Commission" to see the result and save the entry

2. **Log Chargeback**:
   - Enter client name, reason, amount, and date
   - Click "Log Chargeback" to save the chargeback

3. **View Summary**:
   - See total earnings, chargebacks, and net earnings at the top
   - Scroll through commission entries and chargebacks below

## Data Storage

All data is stored locally in the browser's localStorage. This means:
- Data persists between browser sessions
- Data is not shared between devices
- Clearing browser data will remove all entries

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE). 