# AcroKit - Partner Acroyoga Flow Builder

A modern React web application for building and sharing valid Acroyoga sequences between a Base and Flyer, featuring real-time data management and user authentication.

![AcroKit Screenshot](docs/screenshot.png)

## ✨ Features

### 🔐 **User Authentication**
- Magic link email authentication via InstantDB
- User profiles with avatars and session management
- Protected flow saving (login required)
- Sign in/sign out functionality

### 🏗️ **Constrained Flow Builder**
- **Smart pose validation** - only valid next moves are shown
- **Named transitions** - each move displays the transition technique (e.g., "Prasarita Twist", "Whale to Throne")
- **Partner role system** - Fixed Base (L-basing) and Flyer roles
- **Sequential building** - users can only remove the last item from their flow
- **Real-time validation** - no invalid transitions possible

### 📚 **Pose Library**
- 8 sample L-basing poses with difficulty levels
- Difficulty indicators: Easy (green), Medium (blue), Hard (red)
- Pose descriptions and transition data
- Clean card-based interface with hover effects

### 💾 **Flow Management**
- **Save flows** with names, descriptions, and privacy settings
- **My Flows gallery** - dedicated page for managing saved flows
- **Public/Private settings** - toggle flow visibility
- **Share functionality** - generate shareable links for public flows
- **Load & Edit** - load saved flows back into the builder

### 🎨 **Modern UI Design**
- **Responsive design** - works on mobile and desktop
- **Card-based layout** with gradient borders and shadows
- **Neutral color palette** with vibrant accent colors
- **Smooth animations** and hover effects
- **Professional typography** and spacing
- **Visual hierarchy** with proper contrast and accessibility

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v3
- **Database**: InstantDB (real-time, auth-enabled)
- **Authentication**: InstantDB Auth with magic links
- **State Management**: React Context + useState/useEffect
- **Testing**: Puppeteer for visual regression testing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd acrokit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📱 Usage

### Building Your First Flow

1. **Browse starting poses** - Choose from available foundational poses
2. **Select a pose** - Click "Add to flow" to begin your sequence
3. **Follow transitions** - Only valid next moves will be displayed
4. **View transition names** - Each step shows the technique name
5. **Save your flow** - Sign in and save with a name and description

### Managing Flows

1. **Sign in** - Click "Sign in" and use the magic link authentication
2. **Visit "My flows"** - View all your saved flow sequences
3. **Load & Edit** - Load any saved flow back into the builder
4. **Share flows** - Make flows public and share via generated links
5. **Manage privacy** - Toggle flows between public and private

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── AuthProvider.tsx  # Authentication context
│   ├── FlowBuilder.tsx   # Main flow building interface
│   ├── FlowsGallery.tsx  # Saved flows management
│   ├── Header.tsx        # Navigation header
│   ├── LoginModal.tsx    # Authentication modal
│   ├── PoseCard.tsx      # Individual pose cards
│   └── FlowSaveModal.tsx # Flow saving interface
├── data/
│   └── sampleData.ts     # Sample poses and transitions
├── lib/
│   └── instant.ts        # InstantDB configuration
└── App.tsx               # Main application component
```

## 🗄️ Data Schema

### Poses
- Name, description, difficulty level
- Optional images for pose, base position, flyer position
- Linked to valid transitions

### Transitions  
- Named transition techniques
- From/to pose relationships
- Optional descriptions and notes

### Flows
- User-owned sequences
- Public/private visibility settings
- Serialized step data with poses and transitions
- Timestamps and metadata

## 🎯 Core Concept

AcroKit implements a **constrained flow system** where:

1. **Only valid transitions are possible** - the system prevents invalid pose sequences
2. **Transitions are named** - each move shows the proper technique name
3. **Sequential building** - users build flows step-by-step with validation
4. **Educational value** - helps practitioners learn proper pose progressions

## 🚧 Current Status

### ✅ Completed Features
- Complete React + TypeScript application
- User authentication and session management  
- Constrained flow builder with validation
- Pose library with 8 sample poses
- Flow saving and management system
- Public/private flow settings
- Responsive design matching acrokit.com prototype
- Share functionality for public flows

### 🔄 Known Issues
- Flow loading from gallery to builder needs refinement
- InstantDB integration uses demo auth (needs real app ID for production)
- Limited pose library (8 poses, expandable)

### 🎯 Future Enhancements
- Expanded pose library with images
- Advanced filtering and search
- Flow collaboration features
- Mobile app version
- Video tutorials integration
- Community features and flow sharing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the original acrokit.com prototype
- Built with modern React and InstantDB technologies
- Designed for the acroyoga community

---

**Built with ❤️ for the acroyoga community**