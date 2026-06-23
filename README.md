# Smart Expense Tracker with AI Insights

A modern, intelligent expense tracking application built with React, Next.js, and OpenAI. Track your spending, identify patterns, and get AI-powered recommendations to optimize your financial habits.

## 🚀 Features

### Expense Management
- **Easy Entry**: Simple form to add expenses with amount, category, date, and description
- **Categorized Tracking**: Pre-defined categories (Groceries, Dining, Transportation, Entertainment, Shopping, Utilities, Healthcare, Education, Other)
- **Quick List**: View all your recent expenses with category icons and sorting by date
- **Delete Expenses**: Remove any expense with a single click

### AI-Powered Insights
- **Spending Analysis**: Get detailed breakdown of your spending by category with percentages
- **Trend Detection**: Visual charts showing spending patterns over time
- **Pattern Recognition**: AI identifies recurring spending behaviors and habits
- **Anomaly Detection**: Highlights unusual or spike spending that differs from your patterns
- **Smart Recommendations**: Personalized suggestions to reduce spending and optimize habits
- **Budget Suggestions**: AI-generated monthly budget recommendations based on your spending history

### Data Visualization
- **Pie Charts**: Category breakdown visualization
- **Line Charts**: Spending trends over time
- **Summary Cards**: Total spent, average transaction, and transaction count
- **Interactive Insights**: Collapsible sections for patterns, anomalies, and recommendations

## 🛠️ Tech Stack

### Frontend
- **React 19+** - UI components and interactivity
- **Next.js 16** - App Router for server-side rendering and API routes
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Beautiful charts and data visualizations

### Backend & Database
- **Next.js API Routes** - Serverless backend functions
- **PostgreSQL (Neon)** - Data persistence
- **Drizzle ORM** - Type-safe database queries

### AI Integration
- **OpenAI API** - GPT-4 for intelligent expense analysis
- **AI SDK** - Unified interface for LLM interactions

### Authentication (Optional Setup)
- **Better Auth** - User authentication (tables created but demo uses single-user mode)

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm/pnpm
- Neon PostgreSQL account
- OpenAI API key

### Setup Steps

1. **Clone and Install Dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Environment Variables**
   Create a `.env.local` file in the project root:
   ```
   DATABASE_URL=your_neon_postgres_connection_string
   OPENAI_API_KEY=your_openai_api_key
   BETTER_AUTH_SECRET=your_random_secret_key
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the app.

## 💡 How to Use

### Adding an Expense
1. Fill in the "Add Expense" form on the left sidebar
2. Enter the amount spent
3. Select the transaction date
4. Choose a category
5. (Optional) Add a description for reference
6. Click "Add Expense"
7. The expense will appear in the "Recent Expenses" list

### Generating AI Insights
1. Ensure you have at least a few expenses entered
2. Click the "Generate Insights" button in the top right of the AI Insights panel
3. Wait for the AI to analyze your spending (2-4 seconds)
4. View comprehensive insights including:
   - **Summary Statistics**: Total spent, average transaction, transaction count
   - **Category Breakdown**: Visual pie chart of spending by category
   - **Spending Trends**: Line chart showing spending patterns over time
   - **Patterns**: Identified recurring spending behaviors
   - **Anomalies**: Unusual spending spikes detected by AI
   - **Recommendations**: Personalized suggestions to optimize spending
   - **Budget Suggestions**: AI-recommended monthly budget per category

### Deleting an Expense
- Click the "✕" button next to any expense in the list to remove it

## 📊 Database Schema

### Expenses Table
```sql
CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  userId TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Expense Insights Table (for caching AI results)
```sql
CREATE TABLE expense_insights (
  id SERIAL PRIMARY KEY,
  userId TEXT NOT NULL,
  insights JSONB NOT NULL,
  generatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🤖 AI Features Explained

The application uses OpenAI's GPT-4-turbo model to analyze your expense data and provide intelligent insights:

### What the AI Analyzes
- Total spending across all categories
- Average transaction value
- Category-wise spending breakdown
- Spending trends and patterns over time
- Recurring purchases and behaviors
- Unusual spending that deviates from your patterns
- Budget recommendations based on your history

### How Recommendations Work
The AI considers:
- Your spending patterns and habits
- Category breakdowns and averages
- Seasonal or temporal spending trends
- Identified anomalies
- Your lifestyle and spending behaviors

### Sample Insights
- "You spend significantly more on dining on weekends compared to weekdays"
- "Your grocery spending has increased 15% this month compared to last month"
- "The $89.99 Uber trip on June 21st is 40% above your average transportation expense"
- "Consider setting a monthly budget of $400 for dining to reduce spending"

## 🔐 Data Privacy & Security

### Current Implementation
- Demo mode uses client-side state management (no database writes)
- All expense data is stored locally in React state
- No server calls are made for expense storage in demo mode

### Production Setup (with Authentication)
When setting up with Better Auth:
- User authentication via email/password
- Each user's expenses are isolated using userId
- All queries are scoped to the authenticated user
- Sensitive data is never logged or exposed

## 🚀 Deployment

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel project settings:
   - `DATABASE_URL` - Your Neon PostgreSQL connection string
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `BETTER_AUTH_SECRET` - A random 32+ character secret
3. Deploy! Vercel will automatically build and deploy on push

### Alternative Deployment
The app can be deployed to any Node.js hosting platform:
- AWS, Google Cloud, Azure
- Railway, Render, DigitalOcean
- Heroku (with hobby dyno or higher)

## 📝 API Endpoints

### Server Actions (in `/app/actions/`)

#### expenses.ts
- `addExpense()` - Add a new expense
- `getExpenses()` - Retrieve user's expenses
- `deleteExpense()` - Remove an expense

#### insights.ts
- `generateExpenseInsights()` - Call OpenAI to generate AI insights
- `getLatestInsights()` - Retrieve cached insights

## 🎨 Customization

### Categories
Edit categories in `/components/expense-form.tsx`:
```typescript
const CATEGORIES = ['Groceries', 'Dining', 'Transportation', ...]
```

### Colors & Styling
- Tailwind CSS configuration in `tailwind.config.ts`
- Chart colors in `/components/insights-dashboard.tsx`
- Design tokens in `app/globals.css`

### AI Model
Change the model in `/app/actions/insights.ts`:
```typescript
model: openai('gpt-4-turbo') // Change to 'gpt-3.5-turbo' for cost savings
```

## 🐛 Troubleshooting

### "OpenAI API key not set"
- Ensure `OPENAI_API_KEY` is in your `.env.local`
- Restart the dev server after adding the key

### "Failed to generate insights"
- Check your OpenAI API quota and rate limits
- Ensure you have a valid API key with access to GPT-4-turbo
- Check browser console for detailed error messages

### Expenses not persisting after refresh
- In demo mode, this is expected (client-side state)
- Set up database connection for persistent storage

### Database connection errors
- Verify `DATABASE_URL` is correct in `.env.local`
- Ensure your Neon database is active and accessible
- Check network connectivity to the database

## 📚 Project Structure

```
smart-expense-tracker/
├── app/
│   ├── actions/
│   │   ├── expenses.ts
│   │   └── insights.ts
│   ├── api/
│   │   └── auth/
│   ├── page.tsx
│   └── layout.tsx
├── components/
│   ├── expense-form.tsx
│   ├── expense-list.tsx
│   └── insights-dashboard.tsx
├── lib/
│   ├── auth.ts
│   ├── auth-client.ts
│   └── db/
│       ├── index.ts
│       └── schema.ts
├── public/
├── .env.local
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🤝 Contributing

Want to improve this project? Feel free to:
- Report bugs and issues
- Suggest new features
- Submit pull requests
- Share feedback and ideas

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes

## 🙌 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Charts by [Recharts](https://recharts.org/)
- AI powered by [OpenAI](https://openai.com/)
- Database by [Neon](https://neon.tech/)

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the development team.

---

**Happy expense tracking! Let AI help you understand and optimize your spending habits.** 💰📊
