document.addEventListener('DOMContentLoaded', function () {
    var addButton = document.getElementById('addButton');
    var urlInput = document.getElementById('urlInput');
    var patternList = document.getElementById('patternList');

    addButton.addEventListener('click', function () {
        var pattern = urlInput.value;
        if (pattern) {
            storePattern(pattern);
            urlInput.value = '';
        }
    });

    patternList.addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-button')) {
            var pattern = event.target.dataset.pattern;
            removePattern(pattern);
        } else if (event.target.classList.contains('edit-button')) {
            var pattern = event.target.dataset.pattern;
            var li = event.target.parentElement;
            editPattern(pattern, li);
        }
    });

    loadPatterns();

    function storePattern(pattern) {
        var patterns = JSON.parse(localStorage.getItem('patterns')) || [];
        patterns.push(pattern);
        localStorage.setItem('patterns', JSON.stringify(patterns));
        refreshPatternList();
    }

    function removePattern(pattern) {
        var patterns = JSON.parse(localStorage.getItem('patterns')) || [];
        var index = patterns.indexOf(pattern);
        if (index > -1) {
            patterns.splice(index, 1);
            localStorage.setItem('patterns', JSON.stringify(patterns));
            refreshPatternList();
        }
    }

    function editPattern(pattern, li) {
        var input = li.querySelector('.pattern-input');
        input.disabled = false;
        input.focus();
        input.addEventListener('blur', function () {
            var updatedPattern = input.value;
            var patterns = JSON.parse(localStorage.getItem('patterns')) || [];
            var index = patterns.indexOf(pattern);
            if (index > -1) {
                patterns[index] = updatedPattern;
                localStorage.setItem('patterns', JSON.stringify(patterns));
            }
            input.disabled = true;
        });
    }

    function loadPatterns() {
        var patterns = JSON.parse(localStorage.getItem('patterns')) || [];
        patterns.forEach(function (pattern) {
            addPatternToList(pattern);
        });
    }

    function addPatternToList(pattern) {
        var li = document.createElement('li');
        li.className = 'collection-item';
        var input = document.createElement('input');
        input.type = 'text';
        input.value = pattern;
        input.className = 'pattern-input';
        input.disabled = true;
        li.appendChild(input);

        var editButton = document.createElement('button');
        editButton.className = 'btn-small edit-button';
        editButton.textContent = 'Edit';
        editButton.dataset.pattern = pattern;
        li.appendChild(editButton);
        
        var deleteButton = document.createElement('button');
        deleteButton.className = 'btn-small red delete-button';
        deleteButton.textContent = 'Delete';
        deleteButton.dataset.pattern = pattern;
        li.appendChild(deleteButton);

        patternList.appendChild(li);
    }

    function refreshPatternList() {
        patternList.innerHTML = '';
        loadPatterns();
    }
});
