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


const todos = document.querySelector('#book-tbody');
const form = document.querySelector('form');
const todoTitle = document.querySelector('#title');
const todoDesc = document.querySelector('#desc');


form.addEventListener('submit', addTodo);


async function addTodo(e) {
  e.preventDefault();
  
  const newBook = { 
    author: todoTitle.value.trim(), 
    title: todoDesc.value.trim() 
  };
  
  // Don't add empty books
  if (!newBook.author || !newBook.title) {
    alert('Please fill in both fields');
    return;
  }
  
  try {

    await db.collection('books').add(newBook);
    
    // Clear form
    todoTitle.value = '';
    todoDesc.value = '';
    
    // Refresh the list
    showTodos();
    
    console.log('Book added successfully!');
  } catch(error) {
    console.error('Error adding book:', error);
    alert('Error adding book. Check console for details.');
  }
}


async function showTodos() {
  // Clear current list
  while (todos.firstChild) {
    todos.removeChild(todos.firstChild);
  }
  
  try {

    const snapshot = await db.collection('books')
      .orderBy('author')
      .get();
    

    if (snapshot.empty) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.textContent = 'No Books yet. Be the first to suggest one!';
      cell.setAttribute('colspan', '2');
      cell.style.textAlign = 'center';
      row.appendChild(cell);
      todos.appendChild(row);
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
      
      todos.appendChild(row);
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
    todos.appendChild(row);
  }
}


showTodos();
