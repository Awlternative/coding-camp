const STORAGE_KEY = 'BOOKSHELF_APPS';

let books = [];
let editedBookId = null;

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData() {
  const parsed = JSON.stringify(books);
  localStorage.setItem(STORAGE_KEY, parsed);
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) books = data;

  document.dispatchEvent(new Event('ondataloaded'));
}

function updateDataToStorage() {
  if (isStorageExist()) saveData();
}

function composeBookObject(title, author, year, isComplete) {
  return {
    id: +new Date(),
    title,
    author,
    year: parseInt(year),
    isComplete,
  };
}

function findBook(bookId) {
  for (const book of books) {
    if (book.id === bookId) return book;
  }
  return null;
}

function findBookIndex(bookId) {
  let index = 0;
  for (const book of books) {
    if (book.id === bookId) return index;
    index++;
  }
  return -1;
}

function makeBook(bookObject) {
  const { id, title, author, year, isComplete } = bookObject;

  const textTitle = document.createElement('h3');
  textTitle.innerText = title;
  textTitle.setAttribute('data-testid', 'bookItemTitle');

  const textAuthor = document.createElement('p');
  textAuthor.innerText = `Penulis: ${author}`;
  textAuthor.setAttribute('data-testid', 'bookItemAuthor');

  const textYear = document.createElement('p');
  textYear.innerText = `Tahun: ${year}`;
  textYear.setAttribute('data-testid', 'bookItemYear');

  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement('div');
  container.classList.add('item', 'shadow');
  container.append(textContainer);
  container.setAttribute('data-bookid', id);
  container.setAttribute('data-testid', 'bookItem');

  if (isComplete) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
    undoButton.innerText = 'Belum dibaca';
    undoButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
    undoButton.addEventListener('click', function () {
      undoBookFromCompleted(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.innerText = 'Hapus';
    trashButton.setAttribute('data-testid', 'bookItemDeleteButton');
    trashButton.addEventListener('click', function () {
      removeBookFromCompleted(id);
    });

    const editButton = document.createElement('button');
    editButton.classList.add('edit-button');
    editButton.innerText = 'Edit';
    editButton.setAttribute('data-testid', 'bookItemEditButton');
    editButton.addEventListener('click', function () {
      showEditModal(id);
    });

    container.append(undoButton, trashButton, editButton);
  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');
    checkButton.innerText = 'Selesai dibaca';
    checkButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
    checkButton.addEventListener('click', function () {
      addBookToCompleted(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.innerText = 'Hapus';
    trashButton.setAttribute('data-testid', 'bookItemDeleteButton');
    trashButton.addEventListener('click', function () {
      removeBookFromCompleted(id);
    });

    const editButton = document.createElement('button');
    editButton.classList.add('edit-button');
    editButton.innerText = 'Edit';
    editButton.setAttribute('data-testid', 'bookItemEditButton');
    editButton.addEventListener('click', function () {
      showEditModal(id);
    });

    container.append(checkButton, trashButton, editButton);
  }

  return container;
}

function addBook() {
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');

  const bookTitle = document.getElementById('bookFormTitle').value;
  const bookAuthor = document.getElementById('bookFormAuthor').value;
  const bookYear = document.getElementById('bookFormYear').value;
  const bookIsComplete = document.getElementById('bookFormIsComplete').checked;

  if (editedBookId === null) {
    const bookObject = composeBookObject(bookTitle, bookAuthor, bookYear, bookIsComplete);
    books.push(bookObject);

    const bookElement = makeBook(bookObject);
    if (bookIsComplete) {
      completeBookList.append(bookElement);
    } else {
      incompleteBookList.append(bookElement);
    }

    document.getElementById('bookForm').reset();
    showSuccessModal('Buku berhasil ditambahkan!');
  } else {
    const bookTarget = findBook(editedBookId);
    bookTarget.title = bookTitle;
    bookTarget.author = bookAuthor;
    bookTarget.year = parseInt(bookYear);
    bookTarget.isComplete = bookIsComplete;

    editedBookId = null;
    document.getElementById('bookFormSubmit').innerText = 'Masukkan Buku ke rak';
    showSuccessModal('Buku berhasil diperbarui!');
  }

  updateDataToStorage();
  document.dispatchEvent(new Event('ondataloaded'));
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event('ondataloaded'));
  updateDataToStorage();
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event('ondataloaded'));
  updateDataToStorage();
  showSuccessModal('Buku berhasil dihapus!');
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event('ondataloaded'));
  updateDataToStorage();
}

function showEditModal(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  document.getElementById('editBookFormTitle').value = bookTarget.title;
  document.getElementById('editBookFormAuthor').value = bookTarget.author;
  document.getElementById('editBookFormYear').value = bookTarget.year;
  document.getElementById('editBookFormIsComplete').checked = bookTarget.isComplete;

  editedBookId = bookId;
  document.getElementById('editModal').style.display = 'block';
}

function hideEditModal() {
  document.getElementById('editModal').style.display = 'none';
}

function saveEditBook() {
  const bookTitle = document.getElementById('editBookFormTitle').value;
  const bookAuthor = document.getElementById('editBookFormAuthor').value;
  const bookYear = document.getElementById('editBookFormYear').value;
  const bookIsComplete = document.getElementById('editBookFormIsComplete').checked;

  const bookTarget = findBook(editedBookId);
  bookTarget.title = bookTitle;
  bookTarget.author = bookAuthor;
  bookTarget.year = parseInt(bookYear); 
  bookTarget.isComplete = bookIsComplete;

  editedBookId = null;
  hideEditModal();
  updateDataToStorage();
  document.dispatchEvent(new Event('ondataloaded'));
  showSuccessModal('Buku berhasil diperbarui!');
}

function searchBook() {
  const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase();
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');

  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  for (const book of books) {
    if (book.title.toLowerCase().includes(searchTitle)) {
      const bookElement = makeBook(book);
      if (book.isComplete) {
        completeBookList.append(bookElement);
      } else {
        incompleteBookList.append(bookElement);
      }
    }
  }
}

function showSuccessModal(message) {
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.style.display = 'block';
  modal.style.background = 'rgba(0,0,0,0)';
  modal.innerHTML = `
    <div class="modal-content" data-testid="successModalContent">
      <span class="close-button" id="closeSuccessModal" data-testid="closeSuccessModalButton">&times;</span>
      <p>${message}</p>
    </div>
  `;
  document.body.appendChild(modal);

  const closeModalButton = document.getElementById('closeSuccessModal');
  closeModalButton.addEventListener('click', function () {
    modal.remove();
  });
  
  modal.addEventListener('click', function (){
    modal.remove();
  });

  setTimeout(function () {
    modal.remove();
  }, 5000);
}

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('bookForm');
  const searchForm = document.getElementById('searchBook');
  const editForm = document.getElementById('editBookForm');
  const closeModalButton = document.getElementById('closeModal');

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    searchBook();
  });

  editForm.addEventListener('submit', function (event) {
    event.preventDefault();
    saveEditBook();
  });

  closeModalButton.addEventListener('click', function () {
    hideEditModal();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener('ondataloaded', function () {
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');

  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  for (const book of books) {
    const bookElement = makeBook(book);
    if (book.isComplete) {
      completeBookList.append(bookElement);
    } else {
      incompleteBookList.append(bookElement);
    }
  }
});