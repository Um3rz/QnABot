# QnABot
https://storied-shortbread-36ee2c.netlify.app/

A modern Question and Answer chatbot built with Node.js and AI integration. This bot provides intelligent responses to user queries using advanced natural language processing capabilities.

## 🚀 Features

- **Intelligent Q&A**: Powered by AI models for accurate and contextual responses
- **RESTful API**: Clean backend architecture with Express.js
- **Real-time Chat**: WebSocket support for instant messaging
- **Customizable Responses**: Easy-to-configure question-answer pairs
- **Multi-format Support**: Handle text, images, and documents
- **Conversation Memory**: Maintain context across chat sessions
- **Admin Dashboard**: Manage bot responses and view analytics

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **AI Integration**: OpenAI API
- **Database**: MongoDB/PostgreSQL (configurable)
- **WebSockets**: Socket.io for real-time communication
- **Authentication**: JWT tokens
- **Deployment**: Docker support

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v16 or higher)
- npm or yarn package manager
- OpenAI API key (optional, for AI features)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Um3rz/QnABot.git
   cd QnABot
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies** (if applicable)
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**
   
   Create a `.env` file in the backend directory:
   ```env
   # Server Configuration
   PORT=4000
   NODE_ENV=development
   # AI Configuration
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-3.5-turbo
   OMDB_API_KEY="omdb api key"

   ```

## 🚀 Usage

### Development Mode

1. **Start the backend server**
   ```bash
   cd backend
   node server.js
   ```

2. **Start the frontend**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the application**
   - API: `http://localhost:4000`
   - Frontend: `http://localhost:5173` 

### Production Mode

```bash
cd backend
npm run build
npm start
```

## 📡 API Endpoints

### Chat Endpoints
- `POST /api/chat` - Send a message to the bot
- `GET /api/chat/history/:sessionId` - Get chat history
- `DELETE /api/chat/history/:sessionId` - Clear chat history

### Admin Endpoints
- `GET /api/admin/questions` - Get all Q&A pairs
- `POST /api/admin/questions` - Add new Q&A pair
- `PUT /api/admin/questions/:id` - Update Q&A pair
- `DELETE /api/admin/questions/:id` - Delete Q&A pair

### Health Check
- `GET /api/health` - Server health status

## 💬 Chat API Usage

Send a POST request to `/api/chat` with the following payload:

```json
{
  "message": "What is the weather today?",
  "sessionId": "unique-session-id",
  "userId": "user-123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "response": "I can help you with weather information, but I'll need your location first.",
    "sessionId": "unique-session-id",
    "timestamp": "2025-06-10T12:30:00Z"
  }
}
```

## 🔧 Configuration


### AI Model Configuration

Adjust AI behavior by modifying the model parameters:

```javascript
const aiConfig = {
  model: "gpt-3.5-turbo",
  temperature: 0.7,
  maxTokens: 150,
  systemPrompt: "You are a helpful customer service assistant."
};
```

## 🐳 Docker Deployment

1. **Build the Docker image**
   ```bash
   docker build -t qnabot .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```



## 📁 Project Structure

```
QnABot/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── utils/
│   ├── tests/
│   ├── package.json
│   └── .env.example
├── frontend/ (if applicable)
│   ├── src/
│   ├── public/
│   └── package.json
├── docker-compose.yml
├── Dockerfile
└── README.md
```


## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

**1. npm install fails with "No matching version found for @openai/agents"**
```bash
# Remove the problematic dependency and use the official OpenAI package
npm install openai --save
```

**2. Database connection issues**
- Ensure your database is running
- Check connection string in `.env` file
- Verify database credentials

**3. OpenAI API errors**
- Verify your API key is correct
- Check your OpenAI account billing status
- Ensure you have sufficient API credits



**Made with ❤️ by [Um3rz](https://github.com/Um3rz)**
