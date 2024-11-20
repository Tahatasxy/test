const siteList = document.getElementById('siteList');
const siteNameInput = document.getElementById('siteName');
const siteUrlInput = document.getElementById('siteUrl');
const addSiteBtn = document.getElementById('addSiteBtn');

// Load the stored sites on popup open
chrome.storage.sync.get(['favoriteSites'], function (data) {
  const favoriteSites = data.favoriteSites || [];
  displaySites(favoriteSites);
});

// Add a site
addSiteBtn.addEventListener('click', function () {
  const siteName = siteNameInput.value;
  const siteUrl = siteUrlInput.value;
  
  if (siteName && siteUrl) {
    chrome.storage.sync.get(['favoriteSites'], function (data) {
      const favoriteSites = data.favoriteSites || [];
      favoriteSites.push({ name: siteName, url: siteUrl });
      chrome.storage.sync.set({ favoriteSites }, function () {
        displaySites(favoriteSites);
        siteNameInput.value = '';
        siteUrlInput.value = '';
      });
    });
  }
});

// Delete a site
function deleteSite(siteUrl) {
  chrome.storage.sync.get(['favoriteSites'], function (data) {
    const favoriteSites = data.favoriteSites || [];
    const updatedSites = favoriteSites.filter(site => site.url !== siteUrl);
    chrome.storage.sync.set({ favoriteSites: updatedSites }, function () {
      displaySites(updatedSites);
    });
  });
}

// Edit a site
function editSite(siteUrl, newName, newUrl) {
  chrome.storage.sync.get(['favoriteSites'], function (data) {
    const favoriteSites = data.favoriteSites || [];
    const updatedSites = favoriteSites.map(site => 
      site.url === siteUrl ? { name: newName, url: newUrl } : site
    );
    chrome.storage.sync.set({ favoriteSites: updatedSites }, function () {
      displaySites(updatedSites);
    });
  });
}

// Display the sites with logos, edit and delete buttons
function displaySites(sites) {
  siteList.innerHTML = '';
  sites.forEach((site) => {
    const listItem = document.createElement('li');
    listItem.classList.add('siteItem');

    const logoImg = document.createElement('img');
    logoImg.classList.add('siteLogo');
    logoImg.src = `https://www.google.com/s2/favicons?domain=${site.url}`;
    logoImg.onerror = function() {
      logoImg.src = 'https://via.placeholder.com/24'; // fallback if no logo is found
    };

    const siteLink = document.createElement('a');
    siteLink.href = site.url;
    siteLink.target = '_blank';
    siteLink.textContent = site.name;

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('buttonContainer');

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('deleteBtn');
    deleteBtn.textContent = 'X';
    deleteBtn.addEventListener('click', function (event) {
      event.stopPropagation();  // Prevent the link click
      deleteSite(site.url);
    });

    const editBtn = document.createElement('button');
    editBtn.classList.add('editBtn');
    editBtn.textContent = 'E';
    editBtn.addEventListener('click', function (event) {
      event.stopPropagation();  // Prevent the link click
      const newName = prompt("Enter new name:", site.name);
      const newUrl = prompt("Enter new URL:", site.url);
      if (newName && newUrl) {
        editSite(site.url, newName, newUrl);
      }
    });

    buttonContainer.appendChild(editBtn);
    buttonContainer.appendChild(deleteBtn);
    listItem.appendChild(logoImg);
    listItem.appendChild(siteLink);
    listItem.appendChild(buttonContainer);
    siteList.appendChild(listItem);
  });
}
