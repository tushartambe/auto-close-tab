document.addEventListener('DOMContentLoaded', function () {
    var addButton = document.getElementById('addButton');
    var urlInput = document.getElementById('urlInput');
    var timeoutInput = document.getElementById('timeoutInput');
    var patternList = document.getElementById('patternList');
    var editMode = false;
    var patternToEdit = null;

    addButton.addEventListener('click', function () {
        var pattern = urlInput.value;
        var timeout = parseInt(timeoutInput.value) || 10; // Parse timeout value, default to 10 seconds if invalid
        if (pattern && timeout >= 10) { // Check if timeout is greater than or equal to 10
            if (editMode) {
                updatePattern(pattern, timeout);
                exitEditMode();
            } else {
                storePattern(pattern, timeout);
            }
            urlInput.value = '';
            timeoutInput.value = '';
        } else {
            alert('Timeout value should be 10 seconds or greater.');
        }
    });

    patternList.addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-button')) {
            var pattern = event.target.dataset.pattern;
            removePattern(pattern);
        } else if (event.target.classList.contains('edit-button')) {
            var pattern = event.target.dataset.pattern;
            var li = event.target.parentElement;
            enterEditMode(pattern, li);
        } else if (event.target.classList.contains('update-button')) {
            var pattern = event.target.dataset.pattern;
            var li = event.target.parentElement;
            var input = li.querySelector('.pattern-input');
            var timeoutInput = li.querySelector('.timeout-input');
            var patternValue = input.value;
            var timeoutValue = parseInt(timeoutInput.value) || 10; // Parse timeout value, default to 10 seconds if invalid
            if (patternValue && timeoutValue >= 10) { // Check if timeout is greater than or equal to 10
                updatePattern(pattern, patternValue, timeoutValue);
                exitEditMode();
            } else {
                alert('Timeout value should be 10 seconds or greater.');
            }
        }
    });

    function enterEditMode(pattern, li) {
        exitEditMode(); // Exit any previous edit mode first
        editMode = true;
        patternToEdit = pattern;

        var input = li.querySelector('.pattern-input');
        var timeoutInput = li.querySelector('.timeout-input');
        var editButton = li.querySelector('.edit-button');
        var deleteButton = li.querySelector('.delete-button');

        input.disabled = false;
        timeoutInput.disabled = false;
        editButton.style.display = 'none'; // Hide the edit button
        deleteButton.style.display = 'none';

        var updateButton = document.createElement('button');
        updateButton.className = 'btn-small update-button';
        updateButton.textContent = 'Update';
        updateButton.dataset.pattern = pattern;
        li.appendChild(updateButton);
    }

    function exitEditMode() {
        editMode = false;
        patternToEdit = null;

        var updateButton = patternList.querySelector('.update-button');
        if (updateButton) {
            var li = updateButton.parentElement;
            li.removeChild(updateButton);
        }

        var input = patternList.querySelector('.pattern-input');
        var timeoutInput = patternList.querySelector('.timeout-input');
        var editButton = patternList.querySelector('.edit-button');
        var deleteButton = patternList.querySelector('.delete-button');

        if (input) {
            input.disabled = true;
        }
        if (timeoutInput) {
            timeoutInput.disabled = true;
        }
        if (editButton) {
            editButton.style.display = 'inline'; // Show the edit button
        }
        if (deleteButton) {
            deleteButton.style.display = 'inline';
        }
    }

    function updatePattern(pattern, patternValue, timeoutValue) {
        var patterns = JSON.parse(localStorage.getItem('patterns')) || [];
        var index = patterns.findIndex(function (patternObj) {
            return patternObj.pattern === patternToEdit;
        });
        if (index > -1) {
            patterns[index].pattern = patternValue;
            patterns[index].timeout = timeoutValue;
            localStorage.setItem('patterns', JSON.stringify(patterns));
            refreshPatternList();
        }
    }

    function storePattern(pattern, timeout) {
        var patterns = JSON.parse(localStorage.getItem('patterns')) || [];
        var patternObj = {
            pattern: pattern,
            timeout: timeout
        };
        patterns.push(patternObj);
        localStorage.setItem('patterns', JSON.stringify(patterns));
        refreshPatternList();
    }

    function removePattern(pattern) {
        var patterns = JSON.parse(localStorage.getItem('patterns')) || [];
        var index = patterns.findIndex(function (patternObj) {
            return patternObj.pattern === pattern;
        });
        if (index > -1) {
            patterns.splice(index, 1);
            localStorage.setItem('patterns', JSON.stringify(patterns));
            refreshPatternList();
        }
    }

    function loadPatterns() {
        var patterns = JSON.parse(localStorage.getItem('patterns')) || [];
        patterns.forEach(function (patternObj) {
            addPatternToList(patternObj.pattern, patternObj.timeout);
        });
    }

    function addPatternToList(pattern, timeout) {
        var li = document.createElement('li');
        li.className = 'collection-item';
        var input = document.createElement('input');
        input.type = 'text';
        input.value = pattern;
        input.className = 'pattern-input';
        input.disabled = true;
        li.appendChild(input);

        var timeoutInput = document.createElement('input');
        timeoutInput.type = 'number';
        timeoutInput.value = timeout;
        timeoutInput.min = 10; // Set the minimum value to 10
        timeoutInput.className = 'timeout-input';
        timeoutInput.disabled = true;
        li.appendChild(timeoutInput);

        var deleteButton = document.createElement('button');
        deleteButton.className = 'btn-small red delete-button';
        deleteButton.textContent = 'Delete';
        deleteButton.dataset.pattern = pattern;
        li.appendChild(deleteButton);

        var editButton = document.createElement('button');
        editButton.className = 'btn-small edit-button';
        editButton.textContent = 'Edit';
        editButton.dataset.pattern = pattern;
        li.appendChild(editButton);

        patternList.appendChild(li);
    }

    function refreshPatternList() {
        patternList.innerHTML = '';
        loadPatterns();
    }

    loadPatterns();
});
