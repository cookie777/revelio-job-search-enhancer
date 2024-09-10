// Detect URL changes
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status !== 'complete') {
    return;
  }

  let url;
  // url change
  if (changeInfo.url) {
    url = changeInfo.url;
  // first visit, or page reload
  } else if (tab.url) {
    url = tab.url;
  } else {
    return;
  }

  // Send a message to the content script on the same tab
  chrome.tabs.sendMessage(tabId, {
    message: 'urlChanged',
    url: url,
    // Debug purpose
    // tabId: tabId,
    // changeInfo: changeInfo,
    // tab: tab
  });
});