# Veg Typing - Nepali Typing Test

A modern, feature-rich Nepali typing test application supporting both Unicode and Preeti fonts with real-time multiplayer racing, practice modes, and comprehensive statistics tracking.

## Features

- **Multiple Typing Modes**
  - Unicode typing support
  - Preeti font typing support
  - Guided practice lessons with finger positioning
  - **Multiplayer Arena**: Real-time racing with language-aware rooms (English, Preeti, Unicode) and automatic room cleanup.

- **Practice System**
  - Structured curriculum with progressive lessons
  - Virtual keyboard with finger guide
  - Heatmap visualization for weak keys
  - Character-by-character guidance

- **Statistics & Progress**
  - WPM (Words Per Minute) tracking
  - Accuracy metrics
  - Personal best records
  - Global leaderboard
  - Achievement system

- **User Features**
  - User authentication (login/signup)
  - Profile management
  - Settings customization (Sound, Caret style, Font size)
  - Theme support with persistent storage
  - Seamless page transitions for a premium UI experience
  - Real-time user stats sync across pages

## Tech Stack

### Frontend
- React 19 with Vite
- Tailwind CSS for styling
- Zustand for state management
- Socket.io-client for real-time features
- React Router for navigation
- Framer Motion for animations
- Recharts for data visualization

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Socket.io for real-time communication
- JWT authentication
- bcryptjs for password hashing

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

5. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

## Project Structure

```
Veg-Typing/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Authentication middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   └── index.js         # Server entry point
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── data/        # Key mappings and curriculum
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── store/       # Zustand stores
│   │   └── utils/       # Utility functions
│   └── index.html       # Entry HTML
└── README.md
```

## Usage

### Practice Mode
1. Navigate to the Practice page
2. Select a lesson from the curriculum
3. Follow the on-screen keyboard guide
4. Practice typing with real-time feedback

### Typing Test
1. Go to the Home page
2. Select your preferred mode (Unicode/Preeti)
3. Choose test duration
4. Start typing when ready
5. View your results after completion

### Multiplayer Race
1. Navigate to the Race page
2. Create or join a room
3. Wait for other players
4. Race against others in real-time

## Key Mappings

The application includes comprehensive key mappings for:
- Unicode Nepali characters
- Preeti font characters
- Consonants, vowels, and diacritics
- Complex symbols and conjuncts
- Numbers and punctuation

See `frontend/src/data/keyMappings.js` for complete mappings.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License
 
 This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.
