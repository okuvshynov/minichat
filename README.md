# minichat

Minimal web UI for OpenAI-like API chat completion.

## Usage

Start the server with required arguments:

```bash
node server.js <api-base-url> <interface> <port> [api-key]
```

### Examples

With API key as CLI argument:
```bash
node server.js https://api.openai.com 127.0.0.1 3000 sk-your-api-key-here
```

With API key as environment variable:
```bash
MINICHAT_API_KEY=sk-your-api-key-here node server.js https://api.openai.com 127.0.0.1 3000
```

Without server-side API key (user enters key in UI):
```bash
node server.js https://api.openai.com 127.0.0.1 3000
```

## API Key Configuration

The API key can be provided in three ways (in order of precedence):

1. **CLI argument**: Pass as the 4th command line argument
2. **Environment variable**: Set `MINICHAT_API_KEY` environment variable
3. **UI input**: Enter in the web interface (shown only when no server-side key is configured)

When an API key is configured server-side (via CLI or environment variable), the API key input field will be hidden from the UI.

## Mobile Compatibility

This application is optimized for mobile devices, including very old devices:

### Supported Devices
- **iPhone 3G/3GS** (iOS 3.x/4.x Safari) - Full compatibility
- **Early Android devices** - Compatible with early WebKit browsers
- **Modern mobile browsers** - Enhanced experience

### Mobile Optimizations
- **Touch-friendly interface**: Optimized for small screens (320px width)
- **Single-row input layout**: Textarea and Send button fit on one row
- **Compact message display**: Names and messages on same line to save space
- **Auto-scroll functionality**: Automatically scrolls to new messages
- **Manual scrolling**: Full bidirectional scrolling support on old iOS Safari
- **Space-efficient header**: Header auto-hides when API key is server-configured

### Troubleshooting

**iPhone 3G Safari Issues:**
- If scrolling doesn't work, the app includes custom touch handlers for old iOS Safari
- If input layout breaks, the app uses absolute positioning for reliable single-row layout
- JavaScript is compatible with ES3/ES5 (no modern features that break old browsers)

**General Mobile Issues:**
- Ensure the device can handle WebSocket/Server-Sent Events for streaming
- Very old browsers may have slower response rendering but full functionality is maintained