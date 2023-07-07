chrome.runtime.onInstalled.addListener(function () {
    console.log('Auto Close Tab extension installed.');
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.url) {
        var patterns = JSON.parse(localStorage.getItem('patterns')) || [];
        patterns.forEach(function (pattern) {
            if (new RegExp(pattern).test(changeInfo.url)) {
                console.log("MATCHED FOR", { changeInfo, tab });
                setTimeout(function () {
                    chrome.tabs.remove(tabId);
                }, 5000);
            }
        });
    }
});
