const firebaseConfig = {
    apiKey: "AIzaSyA3ur3Y8puScQ_XOV4l_vAtnezXhKayy7E",
    authDomain: "book-recs-7587d.firebaseapp.com",
    projectId: "book-recs-7587d",
    storageBucket: "book-recs-7587d.firebasestorage.app",
    messagingSenderId: "813213522208",
    appId: "1:813213522208:web:cb594f7f1586ff11365f45",
    measurementId: "G-Y423XZXJLP"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const booksTableBody = document.querySelector('#book-tbody');
const form = document.querySelector('form');
const authorInput = document.querySelector('#author');
const titleInput = document.querySelector('#title');

form.addEventListener('submit', addBook);

async function addBook(e) {
  e.preventDefault();
  
  const newBook = { 
    author: authorInput.value.trim(), 
    title: titleInput.value.trim() 
  };
  
  if (!newBook.author || !newBook.title) {
    alert('Please fill in both fields');
    return;
  }
  
  try {
    await db.collection('books').add(newBook);
    
    authorInput.value = '';
    titleInput.value = '';
    
    displayBooks();
    
    console.log('Book added successfully!');
  } catch(error) {
    console.error('Error adding book:', error);
    alert('Error adding book. Check console for details.');
  }
}

async function displayBooks() {
  while (booksTableBody.firstChild) {
    booksTableBody.removeChild(booksTableBody.firstChild);
  }
  
  try {
    const snapshot = await db.collection('books')
      .orderBy('author')
      .get();
    
    if (snapshot.empty) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.textContent = 'No books yet. Be the first to suggest one!';
      cell.setAttribute('colspan', '2');
      cell.style.textAlign = 'center';
      row.appendChild(cell);
      booksTableBody.appendChild(row);
      return;
    }
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const row = document.createElement('tr');
      
      const authorCell = document.createElement('td');
      authorCell.textContent = data.author;
      row.appendChild(authorCell);
      
      const titleCell = document.createElement('td');
      titleCell.textContent = data.title;
      row.appendChild(titleCell);
      
      booksTableBody.appendChild(row);
    });
    
    console.log('Books loaded successfully!');
  } catch(error) {
    console.error('Error loading books:', error);
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.textContent = 'Error loading books. Please refresh the page.';
    cell.setAttribute('colspan', '2');
    cell.style.color = 'red';
    row.appendChild(cell);
    booksTableBody.appendChild(row);
  }
}

displayBooks();
