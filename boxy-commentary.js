// Boxy Commentary Widget - Standalone Version
(function() {
  // Configuration
  const CONFIG = {
    pollInterval: 1000, // 1 second
    widgetPosition: {
      bottom: '20px',
      right: '20px',
      width: '300px',
      zIndex: '10000'
    },
    styles: `
      .boxy-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 300px;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        background: #1a1a2e;
        color: #f8f9fa;
        border: 1px solid #2a2a3a;
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
    `,
    fallbackComments: [
      'The tension is rising in the arena!',
      'What an exciting match we\'re seeing!',
      'The crowd is going wild!',
      'This is turning out to be an incredible tournament!',
      'The competition is heating up!',
      'We\'re seeing some amazing talent tonight!',
      'The energy in the room is electric!',
      'This is what championship boxing is all about!',
      'The fighters are giving it their all!',
      'What a display of skill and determination!'
    ]
  };

  // State
  let isInitialized = false;
  let shadowRoot = null;
  let pollInterval = null;
  let lastState = null;

  // Main initialization function
  function initBoxyCommentary(config = {}) {
    if (isInitialized) {
      console.warn('Boxy is already initialized');
      return;
    }

    // Merge config
    Object.assign(CONFIG, config);
    
    // Update styles with any custom positions
    if (config.widgetPosition) {
      const style = CONFIG.styles
        .replace(/bottom: \d+px/, `bottom: ${config.widgetPosition.bottom || '20px'}`)
        .replace(/right: \d+px/, `right: ${config.widgetPosition.right || '20px'}`)
        .replace(/width: \d+px/, `width: ${config.widgetPosition.width || '300px'}`)
        .replace(/z-index: \d+/, `z-index: ${config.widgetPosition.zIndex || '10000'}`);
      
      CONFIG.styles = style;
    }

    try {
      // Create shadow DOM
      const container = document.createElement('div');
      container.id = 'boxy-commentary-container';
      document.body.appendChild(container);
      shadowRoot = container.attachShadow({ mode: 'open' });

      // Add styles
      const style = document.createElement('style');
      style.textContent = CONFIG.styles;
      shadowRoot.appendChild(style);

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
      shadowRoot.appendChild(widget);

      // Set up polling
      startPolling();

      isInitialized = true;
      console.log('Boxy Commentary initialized successfully');
    } catch (error) {
      console.error('Error initializing Boxy:', error);
    }
  }

  // Start polling for state changes
  function startPolling() {
    if (pollInterval) clearInterval(pollInterval);
    
    pollInterval = setInterval(() => {
      if (window.tournamentState) {
        const currentState = JSON.stringify(window.tournamentState);
        
        if (currentState !== lastState) {
          lastState = currentState;
          updateCommentary(window.tournamentState);
        }
      }
    }, CONFIG.pollInterval);
  }

  // Update the commentary based on tournament state
  function updateCommentary(state) {
    if (!shadowRoot) return;
    
    try {
      const content = shadowRoot.querySelector('.boxy-content');
      if (!content) return;

      // Generate commentary
      const commentary = generateCommentary(state);
      
      // Update UI
      content.innerHTML = `<p>${commentary}</p>`;
      
      // Log to console
      console.log('[Boxy] New commentary:', commentary);
    } catch (error) {
      console.error('[Boxy] Error updating commentary:', error);
    }
  }

  // Generate commentary based on state
  function generateCommentary(state) {
    try {
      // If we have a winner
      if (state.winner) {
        return `And the winner is... ${state.winner}! What an amazing victory! 🏆`;
      }

      // If we have rounds and matches
      if (state.rounds && state.rounds.length > 0) {
        const currentRound = state.rounds.findIndex(round => 
          round.some(match => !match.winner)
        ) + 1 || state.rounds.length;

        const totalRounds = Math.ceil(Math.log2(state.players?.length || 1)) + 1;
        
        // Get the most recent match with a winner
        const lastMatch = state.rounds.flat().reverse().find(match => match.winner);
        if (lastMatch) {
          return `In round ${currentRound} of ${totalRounds}, ${lastMatch.winner} advances to the next round!`;
        }
        
        return `Round ${currentRound} is underway! The competition is fierce! 🥊`;
      }

      // If we have players but no rounds yet
      if (state.players?.length > 0) {
        return `The tournament is about to begin with ${state.players.length} competitors!`;
      }

      // Fallback
      return CONFIG.fallbackComments[
        Math.floor(Math.random() * CONFIG.fallbackComments.length)
      ];
    } catch (error) {
      console.error('[Boxy] Error generating commentary:', error);
      return "An exciting match is happening right now!";
    }
  }

  // Make the widget draggable
  function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = element.querySelector('.boxy-header');
    
    if (header) {
      header.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // Get the mouse cursor position at startup
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // Call a function whenever the cursor moves
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // Calculate the new cursor position
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // Set the element's new position
      element.style.top = (element.offsetTop - pos2) + "px";
      element.style.left = (element.offsetLeft - pos1) + "px";
      element.style.right = 'auto';
      element.style.bottom = 'auto';
    }

    function closeDragElement() {
      // Stop moving when mouse button is released
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

    // Expose the init function globally
  window.BoxyCommentary = {
    init: initBoxyCommentary
  };

  // Auto-initialize if data-boxy attribute is present
  document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('[data-boxy]')) {
      initBoxyCommentary();
    }
  });

  // For backward compatibility
  window.initBoxyCommentary = initBoxyCommentary;
})();
