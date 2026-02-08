# CULT - Premium Fashion E-commerce Platform

A modern, production-ready e-commerce platform built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

### Authentication
- User signup/login with Google OAuth (Supabase)
- Demo mode for testing without authentication
- Protected routes and session management

### Product System
- Product listing with grid/list views
- Product detail pages with image gallery
- Category filtering and search
- Featured products on homepage
- Responsive product cards

### Cart & Orders
- Add/remove items from cart
- Quantity updates
- Cart persistence (local storage + database)
- Order history
- Order tracking

### Payments
- Razorpay integration (test mode)
- Cash on Delivery option
- Order confirmation

### Admin Panel
- Dashboard with stats
- Product management
- Order management
- Customer management

### UI/UX
- Fully responsive design
- Modern dark-themed aesthetic
- Smooth animations with Framer Motion
- Loading states and error handling
- Toast notifications

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Payments**: Razorpay

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for database/auth)

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd cult
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Razorpay (optional)
RAZORPAY_KEY_ID=your-key-id
RAZORPAY_KEY_SECRET=your-key-secret
```

4. **Set up Supabase**
   - Create a new project at [Supabase](https://supabase.com)
   - Run the database migrations in `src/lib/schema.sql`
   - Enable Google OAuth in Supabase Authentication settings

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗃️ Database Schema

The project uses the following tables:
- `users` - User profiles
- `products` - Product catalog
- `categories` - Product categories
- `product_variants` - Product sizes/colors
- `cart_items` - Shopping cart
- `orders` - Customer orders
- `order_items` - Order line items
- `payments` - Payment records
- `reviews` - Product reviews
- `wishlist` - User wishlist
- `addresses` - User addresses
- `coupons` - Discount coupons
- `notifications` - User notifications

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Netlify

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `.next`
4. Add environment variables
5. Deploy!

### Supabase

You can also deploy to Supabase:
```bash
npx supabase deploy
```

## 📁 Project Structure

```
cult/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── auth/              # Auth pages
│   │   ├── admin/             # Admin panel
│   │   ├── shop/              # Shop pages
│   │   ├── cart/              # Cart page
│   │   ├── checkout/           # Checkout page
│   │   ├── dashboard/          # User dashboard
│   │   ├── orders/             # Orders page
│   │   └── product/            # Product pages
│   ├── components/             # React components
│   │   ├── layout/            # Layout components
│   │   ├── product/           # Product components
│   │   ├── cart/              # Cart components
│   │   └── ui/                # UI primitives
│   ├── lib/                   # Utility functions
│   ├── store/                 # Zustand stores
│   ├── types/                 # TypeScript types
│   └── constants/             # Constants
├── scripts/                   # Setup scripts
├── public/                    # Static assets
└── next.config.js            # Next.js configuration
```

## 🔧 Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize colors:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#000000',
      accent: '#f97316',
    }
  }
}
```

### Products
Add sample products through Supabase dashboard or use the seed script:
```bash
npx tsx scripts/seed-database.ts
```

## 📝 API Routes

- `GET /api/products` - List products
- `GET /api/products?slug=xxx` - Get product by slug
- `GET /api/categories` - List categories
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add to cart
- `PATCH /api/cart` - Update cart item
- `DELETE /api/cart` - Remove from cart
- `GET /api/orders` - List orders
- `POST /api/orders` - Create order
- `POST /api/payments/create-order` - Create payment
- `POST /api/payments/verify` - Verify payment
- `POST /api/newsletter` - Subscribe newsletter

## 🧪 Testing

The app works in demo mode without Supabase configured. All features are functional with mock data for testing.

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For issues and questions, please open a GitHub issue.
