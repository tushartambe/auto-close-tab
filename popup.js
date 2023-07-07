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
        console.log(event)
        if (event.target.classList.contains('delete-button')) {
            var pattern = event.target.dataset.pattern;
            removePattern(pattern);
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
        li.appendChild(input);

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