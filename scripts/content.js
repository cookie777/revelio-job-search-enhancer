
// Listen for messages from background.js
chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
    console.debug("Message received in content.js:", request);
    if (request.message != "urlChanged") {
        console.debug("Ignoring message as it is not urlChanged");
        return;
    }
    
    console.log('URL change detected in content.js:', request.url);
    try {
        const jobId = getJobIdFromUrl(request.url);
        const finalApplications = await fetchPostDetails(jobId);
        insertNumberOfApplications(Number(finalApplications));
    } catch (error) {
        console.error(error);
    }
});

function getJobIdFromUrl(urlString) {

    // check jobId in url for this url pattern
    // e.g, */jobs/view/id/*
    const regex = /\/view\/(\d+)(\/|\?|$)/;
    const match = urlString.match(regex);
    if (match) {
        const id = match[1]; // Extracted ID
        if (id) {
            console.debug('JobId found in URL as "/view/id":', id); 
            return id;
        }
    }

    // check jobId in url for this url pattern
    // e.g, */jobs/*currentJobId=*
    const url = new URL(urlString);
    const params = new URLSearchParams(url.search);
    const id = params.get('currentJobId'); 
    if (id) {
        console.debug('JobId found in URL as "currentJobId=":', id);
        return id;
    }

    // JobId not found
    return new Error(`JobId not found in URL: ${urlString}`);

}



function getCookieByKey(key) {
    const cookies = document.cookie
        .split('; ')
        .map(cookie => cookie.split('='))
        .reduce((acc, [k, v]) => {
            acc[k] = v ? v.replace(/"/g, '') : '';
            return acc;
        }, {});
    
    if (!cookies[key]) {
        const errorMessage = `Cookie ${key} not found`;
        console.error(errorMessage);
        return new Error(errorMessage);
    } else {
        console.debug(`Cookie ${key} found:`);
        return cookies[key];
    }
}

async function fetchPostDetails(jobId){
    const token = getCookieByKey("JSESSIONID");
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
        return new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    if (!data["applies"]) {
        return new Error(`No "applies" found in response: ${JSON.stringify(data)}`);
    } else {
        console.debug(`"applies" found in response: ${data["applies"]}`);
        return data["applies"]
    }
};

function insertNumberOfApplications(fetchedApplicants) {
    // Try to get existing applicants from the DOM
    const container = document.querySelector('.job-details-jobs-unified-top-card__primary-description-container');
    const existingApplicants = extractExistingApplicants(container);

    // Designate the number of applicants to display
    // Adopt whichever is the valid and larger number. 
    // This is because sometimes fetched one is smaller than existing(DOM) one. Probably aggregation process lag?
    const finalApplicants = Math.max(fetchedApplicants, existingApplicants)
    if (finalApplicants == null) {
        const errorMessage = "Both 'fetched' and 'existing' applicants not found";
        console.error(errorMessage);
        return new Error(errorMessage);
    }

    // Clean up existing elements. Otherwise, it'll make a duplicate element.
    const customClassName = 'custom-job-by-chrome-extension';
    console.log(container.nextElementSibling.classList)
    if (container.nextElementSibling.classList.contains(customClassName)) {
        container.nextElementSibling.remove(customClassName);
        console.debug("remove the class")
    }

    // Insert the new element
    const newElement = document.createElement('span');
    newElement.className = `${customClassName} tvm__text tvm__text--low-emphasis`;
    newElement.innerHTML = `<strong>👁️ ${finalApplicants} clicks </strong>`;
    container.insertAdjacentElement('afterend', newElement);
}

// Extract the number of existing applicants from the DOM
function extractExistingApplicants(container) {
    // Existing applicants in the DOM should be in this class
    const spans = container.querySelectorAll('.tvm__text.tvm__text--low-emphasis');

    if (spans.length > 0) {
        const match = spans[spans.length - 1].textContent.match(/(\d+)\s+applicants/);
        if (match) {
            return Number(match[1]);
        };
    }
    
    console.warn("Existing Applicants not found in the DOM");
    return null;
}
