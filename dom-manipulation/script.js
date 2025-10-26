const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts'; // Mock API

// -------------------- FETCH QUOTES FROM SERVER --------------------
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();
    return serverData.map(item => ({
      text: item.title,
      category: item.body || 'General'
    }));
  } catch (error) {
    console.error('Error fetching server quotes:', error);
    return [];
  }
}

// -------------------- SYNC LOCAL QUOTES WITH SERVER --------------------
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();

  if (serverQuotes.length > 0) {
    // Conflict resolution: server data takes precedence
    quotes = serverQuotes;

    // Directly update localStorage (ALX requirement)
    localStorage.setItem('quotes', JSON.stringify(quotes));

    // Update DOM
    showRandomQuote();

    // Notify user with ALX-required text
    displaySyncNotification('Quotes synced with server!');
  }
}

// -------------------- POST NEW QUOTE TO SERVER --------------------
async function postQuoteToServer(quote) {
  try {
    await fetch(SERVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: quote.text,
        body: quote.category,
        userId: 1
      })
    });
    console.log('Quote posted to server:', quote);
  } catch (error) {
    console.error('Failed to post quote to server:', error);
  }
}

// -------------------- SYNC NOTIFICATION --------------------
function displaySyncNotification(message) {
  let notification = document.getElementById('syncNotification');
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'syncNotification';
    notification.style.position = 'fixed';
    notification.style.top = '10px';
    notification.style.right = '10px';
    notification.style.backgroundColor = '#d4edda';
    notification.style.color = '#155724';
    notification.style.padding = '10px';
    notification.style.border = '1px solid #c3e6cb';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';
    document.body.appendChild(notification);
  }
  notification.textContent = message;
  setTimeout(() => notification.remove(), 4000);
}

// -------------------- ADD QUOTE FUNCTION --------------------
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (!text || !category) return alert('Both fields are required');

  const newQuote = { text, category };
  quotes.push(newQuote);

  // Save directly to localStorage
  localStorage.setItem('quotes', JSON.stringify(quotes));

  showRandomQuote();

  // Post new quote to server
  postQuoteToServer(newQuote);

  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

// -------------------- PERIODIC SYNC (setInterval) --------------------
setInterval(syncQuotes, 30000); // every 30 seconds

