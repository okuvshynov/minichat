import express from 'express';

const app = express();
app.use(express.json());
app.use(express.static('public'));

const args = process.argv.slice(2);
if (args.length < 3) {
  console.error('Usage: node server.js <api-base-url> <interface> <port>');
  console.error('Example: node server.js https://api.openai.com 127.0.0.1 3000');
  process.exit(1);
}

const [apiBaseUrl, interface_, port] = args;

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, apiKey } = req.body;
    
    const response = await fetch(`${apiBaseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
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
});