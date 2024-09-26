

**🪄Revelio / Job Search Enhancer
==========================

**Description**
---------------

Revelio is a browser extension that reveals the number of applications in LinkedIn job postings.

**Features**
------------

* Displays the number of applications for a job posting on LinkedIn


**How it Works**
----------------

1. The extension listens for URL changes on LinkedIn job posting pages.
2. When a new job posting is detected, the extension sends a request to the background script to fetch the job details.
3. The background script extracts the job ID from the URL and fetches the job details using the LinkedIn API.
4. The extension inserts the number of applications into the job posting page.

**Technical Details**
--------------------

* Built using HTML, CSS, and JavaScript
* Uses the Chrome Extensions API to interact with the browser
* Utilizes the LinkedIn API to fetch job details

**Installation**
---------------

1. Clone the repository or download the extension package.
2. Go to the Chrome extensions page by typing `chrome://extensions/` in the address bar.
3. Enable developer mode.
4. Click "Load unpacked" and select the extension folder.
5. The extension should now be installed and functional.

**Contributing**
---------------

Contributions are welcome! If you'd like to report an issue or submit a pull request, please use the GitHub issue tracker.

**License**
-------

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

Please note that this is just a basic draft, and you may want to add or modify sections to better suit your project's needs. Additionally, you may want to include screenshots or other visual aids to showcase the extension's functionality.