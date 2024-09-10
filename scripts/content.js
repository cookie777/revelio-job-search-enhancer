
console.log("✅");

// Listen for messages from background.js
chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
    console.log("content listener 🔥")
    if (request.message === 'urlChanged') {
        console.log('URL change detected in content.js:', request.url);
        const jobId = parseJobId(request.url);
        const clickCounts = await fetchPostDetails(jobId);
        insertNumberOfApplications(clickCounts);
    }
});

function parseJobId(urlString) {
    // check jobId in url for this url pattern
    // */jobs/view/id/*
    const regex = /\/view\/(\d+)(\/|\?|$)/;
    const match = urlString.match(regex);
    if (match) {
        const id = match[1]; // Extracted ID
        if (id != null) {
            console.log('ID found in URL as "/view/id":', id); 
            return id;
        }
    }

    // check jobId in url for this url pattern
    // */jobs/*currentJobId=*
    const url = new URL(urlString);
    const params = new URLSearchParams(url.search);
    const id = params.get('currentJobId'); 
    console.log('ID found in URL as "currentJobId=":', id); 
    return id;
}



function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift().replace(/"/g, '');
};
async function fetchPostDetails(jobId){
    try {
        const token = getCookie("JSESSIONID");
        console.log(token);
        const response = await fetch(`https://www.linkedin.com/voyager/api/jobs/jobPostings/${jobId}`, {
            "headers": {
                "csrf-token": `${token}`,
              },
              "body": null,
              "method": "GET",
              "mode": "cors",
              "credentials": "include"}
        )

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
      
        const data = await response.json();
        console.log('Response body as JSON:', data);  // Output the JSON response body
        console.log("data.applies", data["applies"]);
        return data["applies"]
    } catch (error) {
      // Catch and handle the error
        console.error('Error fetching data:', error);
    }
  } 
;

function insertNumberOfApplications(clickCounts) {
    if (clickCounts == null) { return; }

    const customClassName = 'custom-job-info-by-chrome-extension';
    const container = document.querySelector('.job-details-jobs-unified-top-card__primary-description-container');
    console.log(container.nextElementSibling.classList)
    if (container.nextElementSibling.classList.contains(customClassName)) {
        container.nextElementSibling.remove(customClassName);
        console.log("remove the class")
    }

    const newElement = document.createElement('span');
    newElement.className = `${customClassName} tvm__text tvm__text--low-emphasis`;
    newElement.innerHTML = `<strong>👁️ ${clickCounts} applies </strong>`;
    container.insertAdjacentElement('afterend', newElement);
}

/*
TODO
hi
- transiton to /jobs/ not working
- error handling
- tripple called
- switch
lo
- refactor
- compare to real one

*/