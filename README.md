# 🤖 Auto-Procure: Autonomous Supply Chain Agent

> A Full-Stack AI Agent that autonomously monitors inventory levels, detects shortages, and drafts Purchase Orders for human approval.

![Project Status](https://img.shields.io/badge/Status-Active-success)
![AI Model](https://img.shields.io/badge/AI-GPT--4-blue)
![Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20FastAPI%20%7C%20Supabase-orange)

## 📖 Overview

**Auto-Procure** solves the "Blank Page Problem" in supply chain management. Instead of a human manually checking spreadsheets for low stock, an **Autonomous AI Agent** wakes up, scans the database, and proactively drafts orders when inventory hits a critical threshold.

The system features a **Human-in-the-Loop** workflow: the AI *proposes* the order with reasoning (e.g., "Stock is 5, minimum is 10"), but a human manager must click "Approve" on the dashboard to finalize it.

## 🏗️ Architecture

The system is built as a monorepo with a clear separation of concerns:



<img width="2316" height="1278" alt="mermaid-diagram-2026-02-06-211428" src="https://github.com/user-attachments/assets/1fd9a7c5-d3c4-4db1-bd9e-703290a205ab" />



### 1. The Brain (Backend)
* **Framework:** Python FastAPI
* **AI Orchestration:** CrewAI & LangChain
* **LLM:** OpenAI GPT-4
* **Database:** Supabase (PostgreSQL)

### 2. The Interface (Frontend)
* **Framework:** Next.js 15 (App Router)
* **Styling:** Tailwind CSS & Shadcn UI
* **State:** Server Actions & React Hooks

---

## ⚡ Key Features

* **Autonomous Monitoring:** The Agent connects directly to the SQL database to check real-time stock levels.
* **Intelligent Reasoning:** It doesn't just match numbers; it generates a natural language explanation for *why* an order is needed.
* **Human-in-the-Loop UI:** A dedicated "Approval Queue" in the dashboard allows managers to review AI drafts before execution.
* **Real-Time Updates:** The frontend refreshes instantly upon approval, providing immediate feedback (Optimistic UI).

---

## 🚀 Getting Started

### Prerequisites
* Node.js 18+
* Python 3.10+
* Supabase Account
* OpenAI API Key

### 1. Clone the Repository
```bash
git clone [https://github.com/yourusername/auto-procure.git](https://github.com/yourusername/auto-procure.git)
cd auto-procure
```

### 2. Backend Setup
Navigate to the backend folder and set up the Python environment.

```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```
Create a ```.env``` file in ```backend/``` with your keys:

```bash
OPENAI_API_KEY=sk-...
SUPABASE_URL=...
SUPABASE_KEY=...
```

Run the server:

```bash
python run.py
# Server starts at [http://127.0.0.1:8000](http://127.0.0.1:8000)
```

### 3. Frontend Setup
Open a new terminal and navigate to the frontend.

```bash
cd frontend
npm install
npm run dev
# Dashboard runs at http://localhost:3000
```

---

## ▶️ Usage / Demo

Once both servers are running, you can manually trigger the AI Agent to perform a supply chain check cycle.

**Option 1: Via Terminal (API)**
Open a new terminal and run:

```bash
# Windows (PowerShell)
curl.exe -X POST [http://127.0.0.1:8000/run-agent](http://127.0.0.1:8000/run-agent)

# Mac / Linux / Git Bash
curl -X POST [http://127.0.0.1:8000/run-agent](http://127.0.0.1:8000/run-agent)
```

**Option 2: Via Dashboard**

1. Navigate to ```http://localhost:3000```.

2. View the Live Inventory Feed.

3. If an order is needed, the "AI Drafted Orders" section will appear automatically.

4. Click "Approve" to finalize the order.

---

## 🧠 How the Agent Works

The Supply Chain Analyst agent follows a strict logic loop:

* **OBSERVE:** Calls the ```check_low_stock``` tool to scan the ```products``` table in Supabase.

* **REASON:** Identifies items where ```current_stock < min_threshold```.

* **ACT:** Groups items by vendor and calls the ```create_draft_order``` tool.

* **RECORD:** Writes a new row to the ```purchase_orders``` table with status ```pending_approval```.

**Example AI Output:**
***"I have detected low stock for RTX 3080 (Count: 2, Min: 10). I am creating a draft order for 8 units to restore healthy levels."***

---

## 📸 Screenshots

**The Dashboard** Interface Real-time inventory tracking with the AI Approval Queue active.

<img width="2534" height="1183" alt="Screenshot 2026-02-06 184406" src="https://github.com/user-attachments/assets/ec062421-5702-45d0-8990-267cbc9efcf4" />

---

## 🔮 Future Improvements

* **Email Notifications:** Send an alert to the manager when a draft is created.

* **Multi-Agent System:** Add a "Price Negotiator" agent to check competitor prices.

* **Historical Analysis:** Use vector search to predict seasonal trends.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

## 📝 License

This project is **MIT** licensed.
