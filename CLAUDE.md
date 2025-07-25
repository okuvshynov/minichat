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
  - Uses XMLHttpRequest to communicate with the server's `/api/chat` endpoint (for old browser compatibility)

## Key Implementation Details

- The server acts as a proxy, forwarding chat requests to any OpenAI-compatible API
- Streaming is implemented using Server-Sent Events from server to client
- API keys can be configured server-side (CLI arg or `MINICHAT_API_KEY` env var) or client-side
- When server-side API key is configured, the UI API key input is hidden and header auto-hides
- The `/api/config` endpoint tells the frontend whether a server-side API key is configured
- The frontend maintains conversation history in memory (cleared on page refresh)
- Uses ES modules (`"type": "module"` in package.json)

## Mobile Compatibility and Old Browser Support

This application has been extensively optimized for very old mobile devices, particularly iPhone 3G with Safari:

### JavaScript Compatibility
- **No modern ES6+ features**: Uses `var`, traditional functions, and XMLHttpRequest instead of fetch/async/await
- **Manual scrolling implementation**: Custom touch event handlers for old iOS Safari scrolling issues
- **Cross-browser event handling**: Feature detection and fallbacks for classList, textContent, etc.
- **Streaming response handling**: Compatible with old XMLHttpRequest implementations

### CSS Layout Optimizations
- **Absolute positioning**: Avoids flexbox for maximum old browser compatibility
- **Hardware acceleration**: Uses `-webkit-transform: translateZ(0)` for smooth scrolling
- **Touch-optimized**: Implements `-webkit-overflow-scrolling: touch` with fallbacks
- **Compact design**: Optimized for 320px screen width (iPhone 3G)

### Layout Features
- **Single-row input**: Textarea and Send button use absolute positioning for reliable layout
- **Inline messages**: Role and content display on same line to save vertical space  
- **Auto-hiding header**: When server-side API key is configured, header disappears for maximum chat space
- **Touch scrolling**: Custom implementation handles bidirectional scrolling on old iOS Safari

### Supported Devices
- **iPhone 3G/3GS**: Full compatibility with iOS 3.x/4.x Safari
- **Early Android**: Compatible with early WebKit implementations
- **Modern browsers**: Enhanced experience while maintaining backward compatibility