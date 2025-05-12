function addTodo() {
    var todoInput = document.getElementById('todoInput');
    var itemText = todoInput.value;

    if (itemText.trim() === '') {
        alert('Please enter a todo item.');
        return;
    }

    var ul = document.getElementById('items_data');
    var li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';

    var textSpan = document.createElement('span');
    textSpan.textContent = itemText;

    var buttonsDiv = document.createElement('div');

    var editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'btn btn-warning btn-sm mr-2';
    editButton.onclick = function() {
        editTodoItem(li, textSpan);
    };

    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'btn btn-danger btn-sm';
    deleteButton.onclick = function() {
        deleteTodoItem(li);
    };

    buttonsDiv.appendChild(editButton);
    buttonsDiv.appendChild(deleteButton);

    li.appendChild(textSpan);
    li.appendChild(buttonsDiv);
    ul.appendChild(li);

    todoInput.value = ''; // Clear the input field
}

function deleteTodoItem(item) {
    var ul = document.getElementById('items_data');
    ul.removeChild(item);
}

function editTodoItem(item, textSpan) {
    var currentText = textSpan.textContent;
    var inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.className = 'form-control';
    inputField.value = currentText;

    var saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.className = 'btn btn-success btn-sm ml-2';
    saveButton.onclick = function() {
        saveTodoItem(item, textSpan, inputField, saveButton, item.querySelector('.btn-warning')); // pass original edit button
    };

    // Temporarily remove the original text and edit/delete buttons
    textSpan.style.display = 'none';
    var buttonsDiv = item.querySelector('div');
    var originalEditButton = buttonsDiv.querySelector('.btn-warning'); // Get the original edit button
    buttonsDiv.style.display = 'none';


    // Add input field and save button
    item.insertBefore(inputField, buttonsDiv); // Insert input before the buttons div
    item.insertBefore(saveButton, buttonsDiv); // Insert save button before the buttons div
}

function saveTodoItem(item, textSpan, inputField, saveButton, editButton) {
    var newText = inputField.value;
    if (newText.trim() === '') {
        alert('Todo item cannot be empty.');
        return;
    }
    textSpan.textContent = newText;

    // Restore original display
    textSpan.style.display = '';
    var buttonsDiv = item.querySelector('div');
    buttonsDiv.style.display = '';


    // Remove input field and save button
    item.removeChild(inputField);
    item.removeChild(saveButton);
}

function deleteAllTodos() {
    var ul = document.getElementById('items_data');
    ul.innerHTML = ''; // Remove all child elements
}