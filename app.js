
function createAndDisplayTodoItem(key, itemText) {
    var ul = document.getElementById('items_data');
    var li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.setAttribute('data-key', key); // Store Firebase key on the element

    var textSpan = document.createElement('span');
    textSpan.textContent = itemText;

    var buttonsDiv = document.createElement('div');

    var editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'btn btn-warning btn-sm mr-2';
    editButton.onclick = function() {
        // Pass the li element, textSpan, and the key to editTodoItem
        editTodoItem(li, textSpan, key);
    };

    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'btn btn-danger btn-sm';
    deleteButton.onclick = function() {
        // Pass the key to deleteTodoItem
        deleteTodoItem(key);
    };

    buttonsDiv.appendChild(editButton);
    buttonsDiv.appendChild(deleteButton);

    li.appendChild(textSpan);
    li.appendChild(buttonsDiv);
    ul.appendChild(li);
}

function addTodo() {
    var todoInput = document.getElementById('todoInput');
    var itemText = todoInput.value;

    if (itemText.trim() === '') {
        alert('Please enter a todo item.');
        return;
    }

    database.ref('todos').push({ text: itemText })
        .then(function() {
            todoInput.value = ''; // Clear the input field
        })
        .catch(function(error) {
            console.error("Error adding item to Firebase: ", error);
            alert("Failed to add item. Please try again.");
        });
}

function deleteTodoItem(key) {
    database.ref('todos/' + key).remove()
        .catch(function(error) {
            console.error("Error removing item from Firebase: ", error);
            alert("Failed to delete item. Please try again.");
        });
}


function editTodoItem(itemElement, textSpan, key) { // itemElement is the li
    var currentText = textSpan.textContent;
    var inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.className = 'form-control';
    inputField.value = currentText;

    var saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.className = 'btn btn-success btn-sm ml-2';
    saveButton.onclick = function() {
        
        saveTodoItem(itemElement, textSpan, inputField, saveButton, key);
    };

    
    textSpan.style.display = 'none';
    var buttonsDiv = itemElement.querySelector('div'); // The div holding edit/delete buttons
    buttonsDiv.style.display = 'none';

    
    itemElement.insertBefore(inputField, buttonsDiv);
    itemElement.insertBefore(saveButton, buttonsDiv); 
}


function saveTodoItem(itemElement, textSpan, inputField, saveButtonElement, key) {
    var newText = inputField.value;
    if (newText.trim() === '') {
        alert('Todo item cannot be empty.');
        return;
    }

    
    database.ref('todos/' + key).update({ text: newText })
        .then(function() {
            textSpan.textContent = newText;
            textSpan.style.display = '';
            var buttonsDiv = itemElement.querySelector('div');
            buttonsDiv.style.display = '';

            if (inputField.parentNode === itemElement) {
                itemElement.removeChild(inputField);
            }
            if (saveButtonElement.parentNode === itemElement) {
                itemElement.removeChild(saveButtonElement);
            }
        })
        .catch(function(error) {
            console.error("Error updating item in Firebase: ", error);
            alert("Failed to save item. Please try again.");
            textSpan.style.display = '';
            var buttonsDiv = itemElement.querySelector('div');
            buttonsDiv.style.display = '';
            if (inputField.parentNode === itemElement) {
                itemElement.removeChild(inputField);
            }
            if (saveButtonElement.parentNode === itemElement) {
                itemElement.removeChild(saveButtonElement);
            }
        });
}

function deleteAllTodos() {
    
    database.ref('todos').remove()
        .catch(function(error) {
            console.error("Error deleting all items from Firebase: ", error);
            alert("Failed to delete all items. Please try again.");
        });
}


window.onload = function() {

    var todosRef = database.ref('todos');
    var ul = document.getElementById('items_data');

    
    todosRef.on('child_added', function(snapshot) {
        // Check if element already exists to prevent duplication
        if (!document.querySelector("li[data-key='" + snapshot.key + "']")) {
            createAndDisplayTodoItem(snapshot.key, snapshot.val().text);
        }
    });

    // When an item is removed
    todosRef.on('child_removed', function(snapshot) {
        var itemElement = document.querySelector("li[data-key='" + snapshot.key + "']");
        if (itemElement) {
            ul.removeChild(itemElement);
        }
    });

    // When an item is changed
    todosRef.on('child_changed', function(snapshot) {
        var key = snapshot.key;
        var newText = snapshot.val().text;
        var itemElement = document.querySelector("li[data-key='" + key + "']");
        if (itemElement) {
            var textSpan = itemElement.querySelector('span'); // First span is assumed to be the text
            if (textSpan) {
                textSpan.textContent = newText;
            }
            var inputField = itemElement.querySelector('input.form-control');
            var saveButton = itemElement.querySelector('button.btn-success');
            var buttonsDiv = itemElement.querySelector('div'); // Div containing edit/delete

            if (inputField && textSpan && buttonsDiv) { // If it was in edit mode
                textSpan.style.display = '';
                buttonsDiv.style.display = '';
                if (inputField.parentNode === itemElement) {
                    itemElement.removeChild(inputField);
                }
                if (saveButton && saveButton.parentNode === itemElement) {
                    itemElement.removeChild(saveButton);
                }
            }
        }
    });
};