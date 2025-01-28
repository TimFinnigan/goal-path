const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "goals.json");

function loadGoals() {
    if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
    return [];
}

function saveGoals(goals) {
    fs.writeFileSync(filePath, JSON.stringify(goals, null, 2));
}

// Load existing goals
document.addEventListener("DOMContentLoaded", () => {
    const timeline = document.querySelector(".timeline");
    const goals = loadGoals();

    goals.forEach(goal => {
        const goalDiv = document.createElement("div");
        goalDiv.className = "goal";
        goalDiv.textContent = `🟢 ${goal}`;
        timeline.appendChild(goalDiv);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            const newGoal = prompt("Enter your new goal:");
            if (newGoal) {
                goals.unshift(newGoal);
                saveGoals(goals);

                const goalDiv = document.createElement("div");
                goalDiv.className = "goal";
                goalDiv.textContent = `🟢 ${newGoal}`;
                timeline.prepend(goalDiv);
            }
        }
    });
});
