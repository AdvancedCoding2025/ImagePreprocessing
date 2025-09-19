const books = [
  { title: "1984", author: "George Orwell", issued: false },
  { title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", issued: false },
  { title: "To Kill a Mockingbird", author: "Harper Lee", issued: false },
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald", issued: false },
  { title: "Pride and Prejudice", author: "Jane Austen", issued: false },
  { title: "The Lord of the Rings", author: "J.R.R. Tolkien", issued: false },
  { title: "The Catcher in the Rye", author: "J.D. Salinger", issued: false },
  { title: "Moby Dick", author: "Herman Melville", issued: false },
  { title: "Wuthering Heights", author: "Emily Bronte", issued: false },
  { title: "Brave New World", author: "Aldous Huxley", issued: false },
  { title: "The Hobbit", author: "J.R.R. Tolkien", issued: false },
  { title: "Fahrenheit 451", author: "Ray Bradbury", issued: false },
  { title: "Don Quixote", author: "Miguel de Cervantes Saavedra", issued: false },
  { title: "Emma", author: "Jane Austen", issued: false },
  { title: "The Divine Comedy", author: "Dante Alighieri", issued: false },
  { title: "Dracula", author: "Bram Stoker", issued: false },
  { title: "Anne Frank: The Diary of a Young Girl", author: "Anne Frank", issued: false },
  { title: "LoveStar", author: "Andri Snaer Magnason", issued: false }
];

function displayBooks(bookArr = books) {
  const grid = document.getElementById('book-grid');
  grid.innerHTML = '';
  bookArr.forEach((book, idx) => {
    grid.innerHTML += `
      <div class="book-card">
        <div>
          <div class="book-title">${book.title}</div>
          <div class="book-author">by ${book.author}</div>
        </div>
        <div class="status-row">
          <span class="book-status ${book.issued ? 'issued' : ''}">
            ${book.issued ? "Issued" : "Available"}
          </span>
          <button onclick="issueReturnBook(${idx})">
            ${book.issued ? "Return" : "Issue"}
          </button>
        </div>
      </div>
    `;
  });
}
displayBooks();

function searchBook() {
  const query = document.getElementById('search').value.toLowerCase().trim();
  if (!query) {
    displayBooks();
    return;
  }
  const filtered = books.filter(
    b => b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query)
  );
  displayBooks(filtered);
}

function addBook(e) {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const author = document.getElementById('author').value.trim();
  if (!title || !author) return;
  books.push({ title, author, issued: false });
  displayBooks();
  e.target.reset();
}

function issueReturnBook(idx) {
  books[idx].issued = !books[idx].issued;
  displayBooks();
}
