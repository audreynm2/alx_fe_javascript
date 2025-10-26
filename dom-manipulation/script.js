// Base URL for mock server (JSONPlaceholder)
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts'; // Simulated API

// Load quotes from localStorage
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Be yourself; everyone else is already taken.", category: "Motivation" },
  { text: "Do what you can, with what you have, where you are.", category: "Action" }
];

// Display a random quote (filtered by category)
function showRandomQuote() {
  const selectedCategory = document.getElementById('categoryFilter')?.value || 'all';
  const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    document.getElementById('quoteDisplay').innerHTML = "No quotes available in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  document.getElementById('quoteDisplay').innerHTML = `${quote.text} — ${quote.category}`;

  // Save last viewed quote in sessionStorage
  sessionStorage.setItem('lastQuote', JSON.stringify(quote));
}

// Save quotes array to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
  populateCategories();
}

// Add a new quote
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (!text || !category) return alert('Both fields are required');

  quotes.push({ text, category });
  saveQuotes();
  showRandomQuote();

  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

// Create form dynamically
function createAddQuoteForm() {
  const container = document.createElement('div');

  const inputText = document.createElement('input');
  inputText.id = 'newQuoteText';
  inputText.type = 'text';
  inputText.placeholder = 'Enter a new quote';

  const inputCategory = document.createElement('input');
  inputCategory.id = 'newQuoteCategory';
  inputCategory.type = 'text';
  inputCategory.placeholder = 'Enter quote category';

  const addBtn = document.createElement('button');
  addBtn.id = 'addQuoteBtn';
  addBtn.textContent = 'Add Quote';
  addBtn.addEventListener('click', addQuote);

  container.appendChild(inputText);
  container.appendChild(inputCategory);
  container.appendChild(addBtn);

  document.body.appendChild(container);
}

// Populate category dropdown dynamically
function populateCategories() {
  let categorySelect = document.getElementById('categoryFilter');
  if (!categorySelect) {
    categorySelect = document.createElement('select');
    categorySelect.id = 'categoryFilter';
    categorySelect.addEventListener('change', filterQuotes);
    document.body.insertBefore(categorySelect, document.getElementById('quoteDisplay'));
  }

  categorySelect.innerHTML = '';

  const allOption = document.createElement('option');
  allOption.value = 'all';
  allOption.textContent = 'All Categories';
  categorySelect.appendChild(allOption);

  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  uniqueCategories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });

  // Restore last selected category from localStorage
  const lastCategory = localStorage.getItem('lastCategory') || 'all';
  categorySelect.value = lastCategory;
}

// Filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('lastCategory', selectedCategory);
  showRandomQuote();
}

// JSON Export
function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}

// JSON Import
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    showRandomQuote();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// -------------------- SERVER SYNC & CONFLICT RESOLUTION --------------------

// Fetch quotes from server and merge with local storage
async function fetchServerQuotes() {
  try {
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();

    // Simulated server format: [{id, title, body, userId}]
    const serverQuotes = serverData.map(item => ({
      text: item.title,
      category: item.body || 'General'
    }));

    // Conflict resolution: server takes precedence
    quotes = serverQuotes;
    saveQuotes();
    showRandomQuote();

    // Notify user of update
    alert('Quotes have been synced with the server.');
  } catch (error) {
    console.error('Failed to fetch server data:', error);
  }
}

// Periodically sync every 30 seconds
setInterval(fetchServerQuotes, 30000);

// -------------------- EVENT LISTENERS --------------------
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('importFile').addEventListener('change', importFromJsonFile);
document.getElementById('exportBtn').addEventListener('click', exportQuotes);

// -------------------- INITIALIZE --------------------
createAddQuoteForm();
populateCategories(
