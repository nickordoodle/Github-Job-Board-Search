// init globals
var mainContentContainer = document.getElementById("main-container");
var descriptionTextInput = document.getElementById("description-search");
var locationTextInput = document.getElementById("location-search");
// declare buttons to be initialized in initAllButtons()
var filterFullTimeBtn;
var filterPartTimeBtn;
var findJobsBtn;
// init current job data, holds all jobs from the last axios api call
var currentJobData = [];

// init buttons
initAllButtons();



// Gets triggered when Find Jobs button is clicked
// Takes in the values of description and location
// Creates visual job cards and updates the current working data
function showJobs(desc, location) {
    // Build and structure query
    let axiosQuery = buildAxiosGithubJobsQuery(desc, location);
    // API Call and update UI
    axiosGithubAPICallAndCreateCards(axiosQuery)
}

// Handles most of the grunt work
// Makes an Axios call based on the given axiosQuery parameter
function axiosGithubAPICallAndCreateCards(axiosQuery) {
    return axios.get(axiosQuery).then(function (res) {
        let jobsFromAxiosResponse = res.data;
        // Clear all data since we just received new data
        currentJobData = [];
        // Clears the main container of all content
        removeAllChildNodes(mainContentContainer);
        // Create a visual card for each job, also push the job object itself
        // to currentJobData
        jobsFromAxiosResponse.map(job => {
            createJobCard(mainContentContainer, job.company_logo, job.title, job.description, job.how_to_apply);
            currentJobData.push(job);
        });
    }).catch(err => console.log(err));
}

// Creates a new data container list based on the filter
function changeJobData(filterType) {
    let updatedJobDataContainer = [];
    updatedJobDataContainer = currentJobData.filter(job => {
        let isJobValid = (job.type === filterType);
        return isJobValid;
    });
    return updatedJobDataContainer;
}

// Clears current content and inserts new content
// The parameter newData is an expected list of jobs
// that is not currently being shown.Creates a job card
// for each job in the newData list
function refreshContent(newData) {
    removeAllChildNodes(mainContentContainer);
    newData.map(job => {
        createJobCard(mainContentContainer, job.company_logo, job.title, job.description, job.how_to_apply);
    });
}

// Clears all children of the passed in HTML container/parent. 
// So if div X is passed in with 3 "p" children, it will remove
// all of those p tags
function removeAllChildNodes(parentNode) {
    parentNode.innerHTML = '';
}

// Validates user input
// Checks that at least one of the parameters,
// description or location has a value
function isJobInputValid(desc, loc) {
    if (desc.length < 1 && loc.length < 1) {
        return false;
    }
    return true;
}

// Given expected values/parameters from the data received 
// from github jobs api, this will create the visual
// card elements and children to be appended
// to the main container
function createJobCard(containerParent, companyImgSrc, jobTitle, jobDesc, jobHowToApply) {

    let outsideContainer = document.createElement("div");
    outsideContainer.className = "col-xs-1-12 content-item";

    let cardContainer = document.createElement("div");
    cardContainer.className = "card";
    cardContainer.style.boxShadow = "8px 8px 3px grey";


    let cardBody = document.createElement("div");
    cardBody.className = "card-body";


    let jobCompanyImg = document.createElement("img");
    jobCompanyImg.src = companyImgSrc;

    let jobTitleH3 = document.createElement("h3");
    jobTitleH3.className = "card-title";
    jobTitleH3.textContent = jobTitle;

    let jobDescP = document.createElement("p");
    jobDescP.innerHTML = jobDesc.substring(0, 100) + "...";

    let jobHowToApplyP = document.createElement("p");
    jobHowToApplyP.innerHTML = jobHowToApply;

    let jobFullDescriptionBtn = document.createElement("button");
    jobFullDescriptionBtn.innerHTML = "Details";
    jobFullDescriptionBtn.addEventListener("click", () => {
        let fullDesc = jobDesc;
        jobDescP.innerHTML = fullDesc;
    });
    jobFullDescriptionBtn.className = "btn btn-primary";

    outsideContainer.appendChild(cardContainer);
    cardContainer.appendChild(cardBody);

    cardBody.appendChild(jobCompanyImg);
    cardBody.appendChild(jobTitleH3);
    cardBody.appendChild(jobDescP);
    cardBody.appendChild(jobHowToApplyP);
    cardBody.appendChild(jobFullDescriptionBtn);

    containerParent.appendChild(outsideContainer);
}

// Initializes all buttons to include find jobs and filter buttons
// Sets the appropriate event listeners to each button based on
// their intended purpose
function initAllButtons() {
    filterFullTimeBtn = document.getElementById("filter-full-time-btn");
    filterFullTimeBtn.addEventListener("click", () => {
        let updatedJobData = [...changeJobData("Full Time")];
        refreshContent(updatedJobData);
    });

    filterPartTimeBtn = document.getElementById("filter-part-time-btn");
    filterPartTimeBtn.addEventListener("click", () => {
        let updatedJobData = [...changeJobData("Part Time")];
        refreshContent(updatedJobData);
    });

    findJobsBtn = document.getElementById("find-jobs-btn");
    findJobsBtn.addEventListener("click", () => {
        let descQuery = descriptionTextInput.value;
        let locQuery = locationTextInput.value;
        if (isJobInputValid(descQuery, locQuery)) {
            showJobs(descQuery, locQuery);
        } else {
            alert("Please enter a value for description, location or both.")
        }
    });
}

// Builds and concats all values for a proper
// axios api query call to github jobs
function buildAxiosGithubJobsQuery(desc, location) {
    let baseQuery = "https://jobs.github.com/positions.json?";
    let description = "description=" + desc;
    let concatter = "&";
    let loc = "location=" + location;
    let finalQuery = baseQuery + description + concatter + loc;
    return finalQuery;
}