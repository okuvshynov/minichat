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