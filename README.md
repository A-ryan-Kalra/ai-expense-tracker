# 💸 AI Expense Tracker

An intelligent expense tracking application that not only records and manages your expenses but also provides **AI-powered insights and visualizations** across daily, weekly, and monthly timelines.

---


## 🗃️ Work Flow

```tsx
User → React Frontend → Express Backend → LangChain + OpenAI
     ←──────────── SSE Streaming Response ────────────
```
<img width="1920" height="1080" alt="workflow-1920x1080" src="https://github.com/user-attachments/assets/3af6bee8-aca9-4a61-b992-9045db6e64c7" />

--

## 🚀 Features

- 📌 **Expense Management**
  - Add, store, and retrieve expenses easily
  - Maintain a complete history of transactions

- 📊 **AI-Powered Analytics**
  - Generate charts and insights using natural language
  - Analyze spending patterns by:
    - Day
    - Week
    - Month

- 🤖 **GenAI Integration**
  - Uses LLMs to interpret user queries
  - Converts natural language into actionable expense queries

- 🔧 **Tool Calling (LangChain)**
  - AI performs structured operations like:
    - Create expense
    - Fetch expense history
    - Aggregate data for analytics

- ⚡ **Real-time Streaming (SSE)**
  - Stream responses from:
    LLM → Backend → Frontend
  - Enables smooth, real-time updates in UI

---

## 🏗️ Tech Stack

### Frontend
- React.js (Vite)

### Backend
- Express.js

### AI Layer
- OpenAI API  
- LangChain (tool calling + orchestration)

### Communication
- Server-Sent Events (SSE)

---

## 🧠 How It Works

1. User interacts via UI  
   _Example: "Show my expenses for last week"_

2. Request is sent to backend

3. LangChain processes the query using an OpenAI model

4. Model decides which tool to call:
   - Create expense  
   - Get expenses  
   - Aggregate data  

5. Backend executes tool logic

6. Results are streamed back using SSE

7. Frontend renders:
   - Data  
   - Charts  
   - Insights  

---
