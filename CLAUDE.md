# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a minimal web UI for OpenAI-like API chat completion. The application consists of a Node.js Express server that proxies chat requests to any OpenAI-compatible API and serves a simple HTML/CSS/JavaScript frontend.

## Running the Application

Start the server with required command line arguments:
```bash
node server.js <api-base-url> <interface> <port> [api-key]
```

Examples:
```bash
# With CLI API key
node server.js https://api.openai.com 127.0.0.1 3000 sk-your-key

# With environment variable
MINICHAT_API_KEY=sk-your-key node server.js https://api.openai.com 127.0.0.1 3000

# Without server-side key (user enters in UI)
node server.js https://api.openai.com 127.0.0.1 3000
```

Or use the npm script:
```bash
npm start
```

## Architecture

- **server.js**: Express server that handles API proxying and static file serving
  - `/api/chat` endpoint accepts POST requests with `{messages, apiKey}` 
  - Streams responses from the configured API base URL using Server-Sent Events
  - Serves static files from the `public/` directory

- **public/index.html**: Single-page application with embedded CSS and JavaScript
  - Handles chat UI, message display, and streaming response rendering
  - Manages conversation state in browser memory
  - Uses fetch API to communicate with the server's `/api/chat` endpoint

## Key Implementation Details

- The server acts as a proxy, forwarding chat requests to any OpenAI-compatible API
- Streaming is implemented using Server-Sent Events from server to client
- API keys can be configured server-side (CLI arg or `MINICHAT_API_KEY` env var) or client-side
- When server-side API key is configured, the UI API key input is hidden
- The `/api/config` endpoint tells the frontend whether a server-side API key is configured
- The frontend maintains conversation history in memory (cleared on page refresh)
- Uses ES modules (`"type": "module"` in package.json)