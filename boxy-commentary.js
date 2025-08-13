// Boxy Commentary Widget - Standalone Version
(function() {
  'use strict';

  // Default configuration
  const DEFAULT_CONFIG = {
    pollInterval: 1000,
    widgetPosition: {
      bottom: '20px',
      right: '20px',
      width: '300px',
      zIndex: '10000'
    },
    fallbackComments: [
      'The tension is rising in the arena!',
      'What an exciting match we\'re seeing!',
      'The crowd is going wild!',
      'This is turning out to be an incredible tournament!',
      'The competition is heating up!'
    ]
  };

  // State
  let isInitialized = false;
  let shadowRoot = null;
  let pollInterval = null;
  let lastState = null;
  let currentConfig = Object.assign({}, DEFAULT_CONFIG);

  // Generate CSS string from config
  function getStyles(config) {
    const pos = config.widgetPosition;
    return `
      /* Container styles */
      #boxy-commentary-container {
        position: fixed !important;
        bottom: 0 !important;
        right: 0 !important;
        z-index: 10000 !important;
        width: auto !important;
        height: auto !important;
      }
      
      /* Widget styles */
      .boxy-container {
        position: relative !important;
        display: block !important;
        width: ${pos.width} !important;
        min-width: 300px !important;
        min-height: 100px !important;
        margin: 20px !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif !important;
        border-radius: 12px !important;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
        background: #1a1a2e !important;
        color: #f8f9fa !important;
        border: 2px solid #4a6fa5 !important;
        padding: 15px !important;
        box-sizing: border-box !important;
        overflow: visible !important;
      }
      
      /* Header styles */
      .boxy-header {
        margin: -15px -15px 15px -15px !important;
        padding: 10px 15px !important;
        background: #4a6fa5 !important;
        color: white !important;
        border-radius: 10px 10px 0 0 !important;
      }
      
      .boxy-header h3 {
        margin: 0 !important;
        padding: 0 !important;
        font-size: 16px !important;
        font-weight: 600 !important;
      }
      
      /* Content styles */
      .boxy-content {
        min-height: 50px !important;
      }
      
      .boxy-content p {
        margin: 0 !important;
        padding: 0 !important;
      }
      .boxy-header {
        background: #4a6fa5;
        color: white;
        padding: 12px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: move;
      }
      .boxy-header h3 {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
      }
      .boxy-content {
        padding: 16px;
        font-size: 0.9rem;
        line-height: 1.5;
        max-height: 200px;
        overflow-y: auto;
      }
      .boxy-content::-webkit-scrollbar {
        width: 6px;
      }
      .boxy-content::-webkit-scrollbar-track {
        background: #1a1a2e;
      }
      .boxy-content::-webkit-scrollbar-thumb {
        background-color: #4a6fa5;
        border-radius: 3px;
      }
    `;
  }

  // Deep merge configs
  function mergeConfig(userConfig) {
    const config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    
    if (userConfig) {
      if (userConfig.widgetPosition) {
        Object.assign(config.widgetPosition, userConfig.widgetPosition);
      }
      if (userConfig.pollInterval) {
        config.pollInterval = userConfig.pollInterval;
      }
      if (userConfig.fallbackComments) {
        config.fallbackComments = userConfig.fallbackComments;
      }
    }
    
    return config;
  }

  // Main initialization
  function initBoxyCommentary(userConfig) {
    if (isInitialized) {
      console.warn('Boxy is already initialized');
      return;
    }

    try {
      currentConfig = mergeConfig(userConfig);
      
      // Create shadow DOM container
      const container = document.createElement('div');
      container.id = 'boxy-commentary-container';
      // Make sure the container is in the document flow
      container.style.position = 'fixed';
      container.style.bottom = '0';
      container.style.right = '0';
      container.style.zIndex = '10000';
      document.body.appendChild(container);
      
      // Attach shadow root
      shadowRoot = container.attachShadow({ mode: 'open' });

      // Create widget structure
      const widget = document.createElement('div');
      widget.className = 'boxy-container';
      widget.innerHTML = `
        <div class="boxy-header">
          <h3>🎙️ Boxy Commentary</h3>
        </div>
        <div class="boxy-content">
          <p>Welcome to the tournament! 🥊</p>
        </div>
      `;
      
      // Add styles
      const style = document.createElement('style');
      style.textContent = getStyles(currentConfig);
      
      // Append styles and widget to shadow root
      shadowRoot.appendChild(style);
      shadowRoot.appendChild(widget);

      // Force a reflow to ensure styles are applied
      widget.offsetHeight;
      
      // Log debug info
      console.log('Boxy Commentary initialized successfully');
      console.log('Widget dimensions:', {
        width: widget.offsetWidth,
        height: widget.offsetHeight,
        position: window.getComputedStyle(widget).position,
        display: window.getComputedStyle(widget).display
      });
      
      // Set up polling
      startPolling(currentConfig.pollInterval);
      isInitialized = true;
    } catch (error) {
      console.error('Error initializing Boxy:', error);
    }
  }

  // Poll for state changes
  function startPolling(interval) {
    if (pollInterval) {
      clearInterval(pollInterval);
    }
    
    pollInterval = setInterval(function() {
      if (window.tournamentState) {
        const currentState = JSON.stringify(window.tournamentState);
        if (currentState !== lastState) {
          lastState = currentState;
          updateCommentary(window.tournamentState);
        }
      }
    }, interval);
  }

  // Update the commentary
  function updateCommentary(state) {
    if (!shadowRoot) return;
    
    try {
      const content = shadowRoot.querySelector('.boxy-content');
      if (!content) return;

      const commentary = generateCommentary(state);
      content.innerHTML = `<p>${commentary}</p>`;
    } catch (error) {
      console.error('[Boxy] Error updating commentary:', error);
    }
  }

  // Generate commentary
  function generateCommentary(state) {
    try {
      if (!state) return 'Waiting for tournament data...';
      if (state.winner) return `And the winner is... ${state.winner}! 🏆`;
      
      if (state.rounds && state.rounds.length > 0) {
        const currentRound = state.rounds.findIndex(round => 
          round.some(match => !match.winner)
        ) + 1 || state.rounds.length;

        const lastMatch = state.rounds.flat().reverse().find(match => match.winner);
        if (lastMatch) {
          return `${lastMatch.winner} advances to the next round!`;
        }
        
        return `Round ${currentRound} is underway!`;
      }

      if (state.players?.length > 0) {
        return `The tournament is about to begin with ${state.players.length} competitors!`;
      }

      const randomIndex = Math.floor(Math.random() * currentConfig.fallbackComments.length);
      return currentConfig.fallbackComments[randomIndex];
    } catch (error) {
      console.error('[Boxy] Error generating commentary:', error);
      return 'An exciting match is happening now!';
    }
  }

  // Auto-initialize if data-boxy attribute is present
  function autoInit() {
    if (document.querySelector('[data-boxy]')) {
      initBoxyCommentary();
    }
  }

  // Expose to global scope
  const BoxyCommentary = { init: initBoxyCommentary };
  
  // For browser environment
  if (typeof window !== 'undefined') {
    window.BoxyCommentary = BoxyCommentary;
    
    // Auto-initialize if data-boxy attribute is present
    const init = function() {
      if (document.querySelector('[data-boxy]')) {
        initBoxyCommentary();
      }
    };
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      // If document is already loaded
      setTimeout(init, 0);
    }
  }
  
  // For CommonJS/Node.js environment
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = BoxyCommentary;
  }
})();
