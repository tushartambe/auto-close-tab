chrome.runtime.onInstalled.addListener(function () {
    console.log('Auto Close Tab extension installed.');
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.url) {
        var patterns = JSON.parse(localStorage.getItem('patterns')) || [];
        patterns.forEach(function (patternObj) {
            if (new RegExp(patternObj.pattern).test(changeInfo.url)) {
                console.log("MATCHED FOR", { changeInfo, tab });
                setTimeout(function () {
                    chrome.tabs.remove(tabId);
                }, patternObj.timeout * 1000); // Convert timeout value to milliseconds
            }
        });
    }
});
