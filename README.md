# 🌟 Habit Nexus - Futuristic Habit Tracker

A sleek, modern habit tracking application built with Next.js 15, featuring a cyberpunk-inspired design with glass morphism, neon accents, and smooth animations.

## ✨ Revolutionary Features

### 🧬 Unique Features (No Other Habit App Has These!)

- **🧬 Habit DNA System**: Genetic-style behavioral trait mapping that analyzes your consistency, momentum, focus, resilience, balance, and evolution to create a unique genetic code for your habits
- **⚛️ Quantum Habit States**: Revolutionary probability-based tracking where habits exist in superposition until observed, with real-time wave function evolution and quantum entanglement between habits
- **🕰️ Habit Time Travel**: Journey through your behavioral timeline with AI-powered predictions, see past/future projections, and visualize habit evolution across different timelines
- **🧠 Neural Dashboard**: Advanced command center with AI insights, behavioral analysis, and consciousness-level habit tracking
- **📊 Multidimensional Analytics**: Radar charts, DNA visualization, quantum state diagrams, and time-based projections
- **🔮 Predictive Intelligence**: Machine learning algorithms that predict habit completion probability based on historical patterns, circadian rhythms, and quantum fluctuations

### 🎨 Advanced UI/UX

- **Futuristic Design**: Cyberpunk-inspired interface with glass morphism and neon accents
- **Quantum Animations**: Particle effects, DNA helixes, wave functions, and neural network visualizations
- **Adaptive Interface**: UI that evolves based on your habit DNA and quantum states
- **Immersive Experience**: Full-screen animations, floating particles, and dynamic gradients

### 🔐 Authentication & Sync

- **Supabase Integration**: Secure authentication with social login options
- **Real-time Sync**: Cloud-based data persistence with instant updates
- **Demo Mode**: Full functionality without requiring sign-up

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Database**: Supabase (configured but using localStorage for demo)
- **TypeScript**: Full type safety

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ installed
- Supabase account (optional, for cloud database)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Update `.env.local` with your Supabase credentials
   - Or keep using localStorage for local-only storage

3. **Set up Supabase database (optional):**
   - Create a new Supabase project
   - Run the SQL commands from `supabase-schema.sql` in your Supabase dashboard
   - Update the `.env.local` file with your project URL and anon key

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Design Features

### Color Palette
- **Neon Blue**: `#00f0ff` - Primary accent color
- **Neon Purple**: `#a855f7` - Secondary accent
- **Neon Pink**: `#f97316` - Tertiary accent
- **Cyber Dark**: `#0a0a0f` - Primary background
- **Glass Effects**: Semi-transparent overlays with backdrop blur

### Animations
- **Floating particles** in the header
- **Hover effects** on cards and buttons
- **Scale animations** on interactions
- **Fade transitions** for modals and content
- **Neon glow effects** on focus states

## 📱 Usage

### Basic Habit Tracking
1. **Create a Habit**: Click "Create New Habit" and customize with icons and colors
2. **Track Daily**: Mark habits complete with satisfying animations
3. **View Streaks**: Monitor your progress with visual indicators

### Revolutionary Features
4. **Explore Your Habit DNA**: Visit the DNA tab to see your behavioral genetic profile
5. **Observe Quantum States**: Use the Quantum tab to collapse wave functions and predict completion probabilities
6. **Time Travel**: Navigate through past and future timelines to see habit evolution
7. **Neural Dashboard**: Access the advanced dashboard for comprehensive insights
8. **AI Analytics**: Review multidimensional charts and predictive intelligence

### Navigation
- **Main Page**: Basic habit tracking with quick overview
- **Neural Dashboard**: Advanced analytics and revolutionary features
- **Authentication**: Sign up for cloud sync or use demo mode

## 🌐 Supabase Setup

To connect your Supabase database:

1. **Create a Supabase project**
2. **Run the SQL schema** from `supabase-schema.sql`
3. **Update environment variables** in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

## 📂 Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and theme
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main habit tracker component
├── components/
│   └── ui/                  # Reusable UI components
│       ├── Button.tsx       # Animated button component
│       ├── Card.tsx         # Glass morphism cards
│       └── Input.tsx        # Styled input fields
└── lib/
    ├── supabase.ts          # Database configuration
    └── utils.ts             # Utility functions
```

## 🎯 Future Enhancements

- **Analytics Dashboard**: Detailed habit statistics and charts
- **Social Features**: Share progress with friends
- **Habit Categories**: Organize habits by type
- **Reminders**: Push notifications for habit completion
- **Themes**: Multiple color schemes and visual styles
- **Export Data**: Download habit history as CSV/JSON

---

**Built with ❤️ using Next.js, Tailwind CSS, and Framer Motion**
