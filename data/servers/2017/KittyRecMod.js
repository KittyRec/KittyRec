const chalk = require('chalk');
const axios = require('axios');
const fs = require('fs');
const { exec } = require('child_process');
const { userid } = require('../../user-info/user.json');

async function checkUserBanStatus() {
    try {
        const response = await axios.get('https://kittyrec.kittysec.com/api/check_user_ban', {
            headers: { 'User-ID': userid }
        });
        return response.status;
    } catch (error) {
        return error.response.status || 500; // If no response, assume server error
    }
}

async function restartRecroom() {
    try {
        const exePath = await findRecroomDirectory();
        if (!exePath) {
            console.error(chalk.red('Recroom_Release.exe directory not found.'));
            return;
        }
        const platform = process.platform;
        if (platform === 'win32') {
            exec('taskkill /F /IM Recroom_Release.exe', (error) => {
                if (error) {
                    console.error(chalk.red(`Error killing process: ${error.message}`));
                    return;
                }
                exec(`start "" "${exePath}"`, { shell: true });
            });
        } else if (platform === 'darwin') {
            exec('pkill -f Recroom_Release.exe', (error) => {
                if (error) {
                    console.error(chalk.red(`Error killing process: ${error.message}`));
                    return;
                }
                exec(`open "${exePath}"`);
            });
        } else if (platform === 'linux') {
            exec('pkill -f Recroom_Release.exe', (error) => {
                if (error) {
                    console.error(chalk.red(`Error killing process: ${error.message}`));
                    return;
                }
                exec(`"${exePath}"`);
            });
        } else {
            console.error(chalk.red('Unsupported platform for Recroom_Release.exe.'));
        }
    } catch (error) {
        console.error(chalk.red(error.message));
    }
}

function checkClientResetStatus() {
    try {
        const status = fs.readFileSync('has_user_client_reset.txt', 'utf8');
        return status.trim() === 'true';
    } catch (error) {
        console.error(chalk.red(`Error reading client reset status: ${error.message}`));
        return false;
    }
}

function logClientResetStatus(status) {
    try {
        fs.writeFileSync('has_user_client_reset.txt', status ? 'true' : 'false', 'utf8');
    } catch (error) {
        console.error(chalk.red(`Error writing client reset status: ${error.message}`));
    }
}

async function findRecroomDirectory() {
    return new Promise((resolve, reject) => {
        exec('wmic process where name="Recroom_Release.exe" get ExecutablePath', (error, stdout, stderr) => {
            if (error) {
                reject(new Error(`Error finding executable path: ${stderr.trim()}`));
                return;
            }
            console.log(`${chalk.magentaBright("[KR]")} WMIC output: ${stdout}`);
            const exePath = stdout.split('\n').find(line => line.trim().endsWith('Recroom_Release.exe'));
            if (!exePath) {
                reject(new Error('Executable path not found in command output.'));
                return;
            }
            resolve(exePath.trim());
        });
    });
}

async function checkAndHandleBanStatus() {
    const isBanned = await checkUserBanStatus();
    const clientReset = checkClientResetStatus();
    
    if (isBanned === 401 && !clientReset) {
        console.log(`${chalk.magentaBright("[KR]")} User is banned. Restarting the game.`);
        await restartRecroom();
        logClientResetStatus(true);
    } else if (isBanned !== 401) {
        // If user is not banned, set the reset status to false
        logClientResetStatus(false);
    }
}

// Check ban status every 5 seconds
setInterval(checkAndHandleBanStatus, 5000);

console.log(`${chalk.magentaBright("[KR]")} Ban checker started.`);
