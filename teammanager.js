let teams = []; // Declare teams as a global variable
let maxTeams = 8;

document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        handleNewTeam();
    }
});

handleNewTeam = function() {
    addTeam();
    saveTeamsLocally();
}

window.addEventListener("load", function() {
    loadTeamsLocally();
});

function handleArrow(){
    if(teams.length == maxTeams){
        window.location.href='grafo.html'
    }
}

function confirmReset() {
    // Display a confirmation dialog
    var confirmation = confirm("Are you sure you want to reset everything?");
    
    // If the user confirms, perform the reset
    if (confirmation) {
        resetEverything();
    }
}

function resetEverything() {
    // Clear teams and maxTeams
    teams = [];
    maxTeams = 8;

    // Clear input and team list
    document.getElementById("teamName").value = "";
    document.getElementById("teamList").innerHTML = "";

    // Reset maxTeams dropdown
    document.getElementById("maxTeams").value = "8";

    // Save the reset state locally
    saveTeamsLocally();
}


function updateMaxTeams() {
    var maxTeamsSelect = document.getElementById("maxTeams");
    var selectedMaxTeams = parseInt(maxTeamsSelect.value);

    if (selectedMaxTeams >= teams.length) {
        maxTeams = selectedMaxTeams;
    } else {
        alert("You have more teams than the new max number of teams");

        // Delay setting the value to ensure it updates after the alert
        maxTeamsSelect.value = maxTeams;
    }
}

function addTeam() {
    const teamNameInput = document.getElementById("teamName");
    let teamName = teamNameInput.value.trim();
    teamName = teamName.replace(/[^\w\s]/gi, '');

    if (teamName !== "" && teams.length < maxTeams) {
        const teamList = document.getElementById("teamList");
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${teamName}</span>
            <button onclick="deleteTeam(this)">Delete</button>
        `;
        teamList.appendChild(li);
        teamNameInput.value = "";

        teams.push(teamName); // Add the new team to the global variable
    } else if (teams.length >= maxTeams) {
        alert("You have reached the maximum number of teams");
    }
}

function deleteTeam(button) {
    const li = button.parentNode;
    const ul = li.parentNode;
    ul.removeChild(li);

    saveTeamsLocally(); // Save teams after deleting a team
}

function saveTeamsLocally() {
    const teamList = document.getElementById("teamList");
    teams = [];

    teamList.querySelectorAll("li").forEach(function(li) {
        teams.push(li.querySelector("span").textContent);
    });

    localStorage.setItem("maxTeams", maxTeams);
    localStorage.setItem("teams", JSON.stringify(teams));
}

function loadTeamsLocally() {
    const teamList = document.getElementById("teamList");
    const storedTeams = localStorage.getItem("teams");

    if (storedTeams) {
        JSON.parse(storedTeams).forEach(function(teamName) {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${teamName}</span>
                <button onclick="deleteTeam(this)">Delete</button>
            `;
            teamList.appendChild(li);
        });

        teams = JSON.parse(storedTeams);

        const storedMaxTeams = localStorage.getItem("maxTeams");
        if (storedMaxTeams) {
            const maxTeamsSelect = document.getElementById("maxTeams");
            maxTeamsSelect.value = storedMaxTeams;
            maxTeams = parseInt(storedMaxTeams);
        }
    }
}

