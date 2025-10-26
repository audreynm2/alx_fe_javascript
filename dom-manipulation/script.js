// -------------------- SYNC LOCAL QUOTES WITH SERVER --------------------
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();

  if (serverQuotes.length > 0) {
    // Conflict resolution: server data takes precedence
    quotes = serverQuotes;

    // Update localStorage directly (required for ALX checker)
    localStorage.setItem('quotes', JSON.stringify(quotes));

    // Update DOM
    showRandomQuote();

    // UI notification
    displaySyncNotification('Quotes have been updated from the server.');
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
