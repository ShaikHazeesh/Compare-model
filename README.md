# 🏥 Medical AI Orchestrator

A powerful web application that compares responses from multiple Google Gemini AI models for medical queries, providing comprehensive analysis with confidence, accuracy, and F1 scores in a structured, easy-to-read format.

![Medical AI Orchestrator](https://img.shields.io/badge/Medical-AI%20Orchestrator-blue)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-blue)
![Vite](https://img.shields.io/badge/Vite-5.4.19-purple)

## 🌟 Features

### 🤖 Multi-Model AI Comparison
- **4 Advanced Gemini Models**: Compare responses from:
  - `gemini-2.5-pro` (Most Powerful)
  - `gemini-2.5-flash` (Hybrid Reasoning) 
  - `gemini-2.5-flash-lite` (Cost Effective)
  - `gemini-2.0-flash` (Balanced Multimodal)

### 📊 Intelligent Metrics
- **AI Self-Evaluation**: Each model provides its own confidence, accuracy, and F1 scores
- **Visual Progress Bars**: Easy-to-understand metric visualization
- **Performance Comparison**: Compare model performance side-by-side

### 🎨 Professional Medical Interface
- **Structured Responses**: Clean, organized medical advice format
- **Copy Functionality**: Copy individual sections or complete responses
- **Dark/Light Mode**: Theme support for comfortable viewing
- **Responsive Design**: Works perfectly on all devices

### 📋 Advanced Text Formatting
- **Medical-Specific Styling**: Enhanced formatting for medications, warnings, and schedules
- **Clean Text Display**: Markdown symbols automatically converted to proper formatting
- **Professional Layout**: Hospital-grade interface design

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ShaikHazeesh/Compare-model.git
   cd Compare-model
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080`

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1**: Modern React with hooks and functional components
- **TypeScript 5.8.3**: Type-safe development
- **Vite 5.4.19**: Lightning-fast build tool and dev server

### UI Framework
- **Tailwind CSS 3.4.17**: Utility-first CSS framework
- **shadcn/ui**: Beautiful, accessible component library
- **Radix UI**: Primitive components for building design systems

### AI Integration
- **@google/generative-ai**: Official Google Gemini SDK
- **Multiple Model Support**: Parallel processing of 4 Gemini models

### State Management
- **React Query**: Server state management and caching
- **React Hook Form**: Form state management
- **Custom Hooks**: Reusable logic for themes, mobile detection, and toasts

## 📁 Project Structure

```
gemini-doc-compare/
├── public/
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── ModelResponse.tsx   # AI response display component
│   │   └── theme-toggle.tsx    # Dark/light mode toggle
│   ├── hooks/
│   │   ├── use-mobile.tsx      # Mobile detection hook
│   │   ├── use-theme.tsx       # Theme management hook
│   │   └── use-toast.ts        # Toast notification hook
│   ├── lib/
│   │   ├── geminiService.ts    # Gemini API integration
│   │   └── utils.ts            # Utility functions
│   ├── pages/
│   │   ├── Index.tsx           # Main application page
│   │   └── NotFound.tsx        # 404 error page
│   ├── App.tsx                 # Root component
│   ├── main.tsx                # Application entry point
│   └── index.css               # Global styles and theme
├── .vscode/                    # VS Code configuration
├── package.json
├── tailwind.config.ts
├── vite.config.ts
└── README.md
```

## 🎯 How It Works

1. **Input Medical Query**: Enter your medical symptoms, questions, or health concerns
2. **AI Processing**: The system simultaneously queries 4 different Gemini models
3. **Structured Analysis**: Each model provides:
   - Clinical Assessment
   - Differential Diagnosis  
   - Treatment Recommendations
   - Medication Guidance
   - Follow-up Care Instructions
   - Self-evaluation metrics
4. **Compare Results**: View responses side-by-side with performance metrics
5. **Copy & Share**: Export individual sections or complete analyses

## 📊 Response Structure

Each AI model provides responses in a standardized medical format:

- **Clinical Assessment**: Initial evaluation of symptoms
- **Differential Diagnosis**: Possible conditions to consider
- **Diagnostic Approach**: Recommended tests and examinations
- **Medication Recommendations**: Specific drugs with dosages
- **Treatment Schedule**: Detailed daily/weekly treatment plans
- **Diet & Nutrition**: Food recommendations and restrictions
- **Lifestyle Modifications**: Activity and environmental changes
- **Warning Signs**: When to seek immediate medical attention
- **Follow-up Care**: Monitoring and re-evaluation guidelines

## ⚠️ Medical Disclaimer

**Important**: This application provides AI-generated medical information for educational purposes only. The responses should not be considered as professional medical diagnosis or treatment recommendations. Always consult with a licensed physician or healthcare provider for:

- Professional medical care
- Accurate diagnosis  
- Appropriate treatment decisions
- Emergency medical situations

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Build for development
npm run build:dev

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Your Google Gemini API key | Yes |

### VS Code Setup

The project includes VS Code configuration for optimal development experience:

- Tailwind CSS IntelliSense
- TypeScript support
- ESLint integration
- Prettier formatting

## 🚀 Deployment

### Lovable Platform (Recommended)
1. Visit [Lovable](https://lovable.dev)
2. Click Share → Publish
3. Follow the deployment instructions

### Manual Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting provider
3. Ensure environment variables are set in your hosting environment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI**: For providing advanced AI models
- **Lovable Platform**: For hosting and development support
- **shadcn/ui**: For beautiful, accessible components
- **Tailwind CSS**: For the utility-first CSS framework

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/ShaikHazeesh/Compare-model/issues) page
2. Create a new issue with detailed information
3. For urgent medical concerns, contact a healthcare professional immediately

---

**Built with ❤️ for better healthcare accessibility through AI**