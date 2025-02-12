const psNode = require('ps-node');
const fs = require('fs');
const axios = require('axios');

const onlineActiveFile = './onlineandactive.json';
const userInfoFile = '../../user-info/user.json';
const updateApiUrl = 'https://kittyrec.kittysec.com/update_user_level';
const maxLevel = 30;

// Function to read JSON files
function readJsonFile(filePath) {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        return JSON.parse(data);
    }
    return null;
}

// Function to write JSON data
function writeJsonFile(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Function to detect if Recroom_Release.exe is running
async function isRecroomRunning() {
    return new Promise((resolve, reject) => {
        psNode.lookup({ command: 'Recroom_Release.exe' }, (err, resultList) => {
            if (err) {
                console.error('Error fetching processes:', err);
                return reject(false);
            }
            // If resultList has items, Recroom is running
            resolve(resultList.length > 0);
        });
    });
}

// Function to update the user level in user.json and send the request
async function updateUserLevel() {
    const userData = readJsonFile(userInfoFile);

    if (!userData) {
        console.log("User data not found.");
        return;
    }

    const currentLevel = userData.level;

    if (currentLevel < maxLevel) {
        userData.level += 1; // Increment the level

        // Write the updated user data to the user.json file
        writeJsonFile(userInfoFile, userData);

        try {
            // Send the update request to the server
            await axios.post(updateApiUrl, null, {
                params: {
                    userid: userData.userid,
                    level: userData.level,
                },
            });

            console.log(`User level updated to ${userData.level}`);
        } catch (error) {
            console.error("Error updating user level:", error);
        }
    } else {
        console.log("User level is already at the maximum.");
    }
}

// Function to track the Recroom process and log activity
async function trackRecroom() {
    let activeTime = 0;

    // Check if Recroom is running and update time
    const interval = setInterval(async () => {
        const isRunning = await isRecroomRunning();

        if (isRunning) {
            activeTime += 1; // Increment time by 1 minute

            // Log the time in onlineandactive.json
            const activeData = readJsonFile(onlineActiveFile) || {};
            const currentTime = Date.now();
            activeData[currentTime] = activeTime;
            writeJsonFile(onlineActiveFile, activeData);

            console.log(`Recroom has been running for ${activeTime} minutes`);

            // If an hour has passed, update the user level and reset the timer
            if (activeTime >= 60) {
                await updateUserLevel();
                activeTime = 0; // Reset the timer after an hour
            }
        } else {
            console.log("Recroom is not running.");
        }
    }, 60000); // Check every minute
}

// Start tracking Recroom process
trackRecroom();
