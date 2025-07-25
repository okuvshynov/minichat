import express from 'express';

const app = express();
app.use(express.json());
app.use(express.static('public'));

const args = process.argv.slice(2);
if (args.length < 3) {
  console.error('Usage: node server.js <api-base-url> <interface> <port> [api-key]');
  console.error('Example: node server.js https://api.openai.com 127.0.0.1 3000');
  console.error('API key can also be set via MINICHAT_API_KEY environment variable');
  process.exit(1);
}

const [apiBaseUrl, interface_, port, cliApiKey] = args;
const serverApiKey = cliApiKey || process.env.MINICHAT_API_KEY;

// Endpoint to check if API key is configured server-side
app.get('/api/config', (req, res) => {
  res.json({ hasApiKey: !!serverApiKey });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, apiKey } = req.body;
    const finalApiKey = serverApiKey || apiKey;
    
    if (!finalApiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }
    
    const response = await fetch(`${apiBaseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${finalApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        if (line.trim() === '') continue;
        
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          
          if (data === '[DONE]') {
            res.write('data: [DONE]\n\n');
            continue;
          }
          
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content || '';
            
            if (content) {
              res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
          } catch (e) {
            console.error('Error parsing JSON:', e, 'Data:', data);
          }
        }
      }
    }
    
    res.end();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(parseInt(port), interface_, () => {
  console.log(`Server running at http://${interface_}:${port}`);
  console.log(`API Base URL: ${apiBaseUrl}`);
  if (serverApiKey) {
    console.log('API key configured server-side');
  } else {
    console.log('API key will be required from client');
  }
});