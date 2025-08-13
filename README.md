# Boxy Commentary Widget

A lightweight, embeddable commentary widget that provides AI-powered commentary for tournament applications.

## Features

- 🎙️ Real-time tournament commentary
- 🤖 AI-powered insights (with OpenAI API key)
- 🎨 Customizable appearance
- 🚫 No external dependencies
- 🔌 Easy to integrate

## Installation

### Via CDN
```html
<script src="https://cdn.jsdelivr.net/gh/YOUR_USERNAME/boxy-commentary@main/boxy-commentary.js"></script>
<script>
  BoxyCommentary.init({
    // Optional configuration
    openaiApiKey: 'your-api-key-here', // Optional: For AI-powered commentary
    widgetPosition: {
      bottom: '20px',
      right: '20px',
      width: '300px'
    }
  });
</script>
```

## Usage

1. Include the script in your HTML
2. Initialize the widget with `BoxyCommentary.init()`
3. The widget will automatically detect `window.tournamentState` updates

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `openaiApiKey` | string | `null` | Your OpenAI API key for AI commentary |
| `pollInterval` | number | `1000` | How often to check for state updates (ms) |
| `widgetPosition` | object | `{ bottom: '20px', right: '20px', width: '300px' }` | Position and size of the widget |

## Development

1. Clone the repository
2. Run a local server:
   ```bash
   npm install
   npm start
   ```
3. Open `http://localhost:3000` to test

## License

MIT
