
# Cloud-Closet

Cloud-Closet is a mobile application that lets users store and organize their wardrobe in the cloud. With Cloud-Closet, you can easily keep track of your clothes, categorize them, and access your virtual wardrobe anytime, anywhere.

## Features

- **Wardrobe Management**: Add, remove, and organize clothing items with ease.
- **Cloud Storage**: Your wardrobe is securely stored in the cloud, accessible from any device.
- **Weather Integration**: Get outfit suggestions based on the current weather, thanks to real-time weather data.
- **Categories & Tags**: Group your clothes by type, season, or custom tags.
- **Outfit Planning**: Plan and save outfits for future occasions.
- **Mobile-Friendly**: Optimized for mobile devices, making it easy to use on the go.

## Tech Stack

- **Frontend**: Built with React Native for a seamless mobile experience.
- **Backend**: NestJS API interacting with Supabase for storage and the OpenWeatherMap API for weather data.
- **Cloud Infrastructure**: Vercel for hosting frontend and backend services, Docker for containerization.
- **Database**: Supabase (PostgreSQL) for user and wardrobe data storage.
  
## Installation

To run this project locally, you'll need to clone the repository and set up both the frontend and backend.

### Prerequisites

- Node.js
- Docker (for containerization)
- Vercel CLI (optional, for deployment)
- OpenWeatherMap API key
- Supabase account and API keys

### Setup Instructions

1. **Clone the repository**:

    \`\`\`bash
    git clone https://github.com/yourusername/cloudcloset.git
    cd cloudcloset
    \`\`\`

2. **Frontend setup**:

    \`\`\`bash
    cd frontend
    npm install
    \`\`\`

3. **Backend setup**:

    Navigate to the backend directory and install dependencies.

    \`\`\`bash
    cd ../backend
    npm install
    \`\`\`

4. **Environment Variables**:

    Create \`.env\` files in both `frontend` and `backend` directories with the following information:

    **Backend (`backend/.env`)**:

    \`\`\`
    SUPABASE_URL=your_supabase_url
    SUPABASE_KEY=your_supabase_key
    OPENWEATHER_API_KEY=your_openweathermap_api_key
    \`\`\`

    **Frontend (`frontend/.env`)**:

    \`\`\`
    API_URL=http://localhost:8081
    \`\`\`

5. **Running the Application**:

    Start the backend service:

    \`\`\`bash
    cd backend
    npm run start:dev
    \`\`\`

    Start the frontend app (using React Native):

    \`\`\`bash
    cd ../frontend
    npm run start
    \`\`\`

6. **Docker Setup (optional)**:

    You can also use Docker to containerize and deploy the application. The Docker configurations are available in the \`docker-compose.yml\` file.

    To start the app with Docker:

    \`\`\`bash
    docker-compose up --build
    \`\`\`

## Deployment

Both the frontend and backend can be deployed on Vercel. You can connect your GitHub repository to Vercel for automatic deployments or use the Vercel CLI.

For manual deployment:

\`\`\`bash
vercel --prod
\`\`\`

## Contributing

We welcome contributions! Feel free to open issues or submit pull requests for new features, improvements, or bug fixes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
