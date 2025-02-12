// Hi kittyRec User, 
// If you're reading this, you're probably trying to look through our code. I mean, okay, that's fine, but please—
// I'm begging you, don't spam our webhook. It's going to be really frustrating if someone just spams the WebSocket, 
// and we have to push an update to give a new WebSocket URL or even move it to our server. 
// That would be incredibly annoying. We trust our community, so for the love of God, just don't mess with it.

const chokidar = require('chokidar');
const FormData = require('form-data');
const kzvodizfbmtkflhjfgeytebemtyasxquez = 'https://';
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs').promises;
const mjlzdpueflgolpkzzsnbenjprqjavvgqcjcodkmtbhwvzobhupfrwpbvtbguyyaclskdpeynxxszntkymciuhnelwpjcmhzchgpwyfoliwngnfdcgfvtmeycmdi = '/api/webhooks/';
const getGifFrames = require('gif-frames');
const sharp = require('sharp');
const yeuuqlpptmwbyogqkkvbzyktpsrwbenlgacmadlfuredgev = '1338119009589137409';
const { stat } = require('fs').promises;
const hkcnssmfhudglujofvaykpyyvvqdfvsjwroejgvbakvtounkafyecnhvuoxggcuvimwrupmjqcadsajuh = 'ptb.discord.com';
const { getVideoDurationInSeconds } = require('get-video-duration');

const fyltozclcbhdrzgwzzlippiddenycgcoeowyxtmsebqdjevsufl = '8t42FFT01AWzoJiygdQePGxejgzp4eA9Np7wdjaIAApedUJKuWbflPlDhrPLEc0oOVZ-';

const zpynjvwmhtkpbrttuwcbejxpxhownnybnzctajritmqrrnmvefeftdckexhlhbmeckdwbnnrdjddzrrikfcpdutwbtdzsbnbtcxqgcrdrflirapzxbuzidfvisxofj = kzvodizfbmtkflhjfgeytebemtyasxquez + hkcnssmfhudglujofvaykpyyvvqdfvsjwroejgvbakvtounkafyecnhvuoxggcuvimwrupmjqcadsajuh + mjlzdpueflgolpkzzsnbenjprqjavvgqcjcodkmtbhwvzobhupfrwpbvtbguyyaclskdpeynxxszntkymciuhnelwpjcmhzchgpwyfoliwngnfdcgfvtmeycmdi + yeuuqlpptmwbyogqkkvbzyktpsrwbenlgacmadlfuredgev + '/' + fyltozclcbhdrzgwzzlippiddenycgcoeowyxtmsebqdjevsufl;

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB in bytes
const MIN_VIDEO_DURATION = 3; // Minimum video duration in seconds
const DISCORD_MAX_SIZE = 25 * 1024 * 1024; // Discord's max file size (25MB)

// Replace USERSUSERNAMEHERE with actual username
const watchPath = path.join(process.env.USERPROFILE, 'Documents', 'Rec Room');

async function getFileSize(filePath) {
    try {
        const stats = await stat(filePath);
        return stats.size;
    } catch (error) {
        console.error(`Error getting file size for ${path.basename(filePath)}: ${error.message}`);
        return 0;
    }
}

async function compressFile(filePath, fileType) {
    try {
        const tempDir = path.join(__dirname, 'temp');
        await fs.mkdir(tempDir, { recursive: true });
        const outputPath = path.join(tempDir, `compressed_${path.basename(filePath)}`);

        if (fileType === 'Gifs') {
            await sharp(filePath)
                .resize(800)
                .gif({
                    quality: 60,
                    effort: 7
                })
                .toFile(outputPath);
        } else if (fileType === 'Pngs') {
            await sharp(filePath)
                .resize(1920)
                .png({ quality: 80 })
                .toFile(outputPath);
        }

        return outputPath;
    } catch (error) {
        console.error(`Compression failed for ${path.basename(filePath)}: ${error.message}`);
        return filePath;
    }
}

async function getGifDuration(filePath) {
    try {
        const frames = await getGifFrames({ url: filePath, frames: 'all' });
        const totalDelay = frames.reduce((sum, frame) => sum + (frame.frameInfo.delay || 0), 0);
        return totalDelay / 100;
    } catch (error) {
        console.error(`Error reading GIF duration for ${path.basename(filePath)}: ${error.message}`);
        return 0;
    }
}

async function getVideoDuration(filePath) {
    try {
        return await getVideoDurationInSeconds(filePath);
    } catch (error) {
        console.error(`Error reading video duration for ${path.basename(filePath)}: ${error.message}`);
        return 0;
    }
}

async function getUserData() {
    try {
        const userDataPath = path.join(__dirname, '..', '..', 'user-info', 'user.json');
        const userData = JSON.parse(await fs.readFile(userDataPath, 'utf8'));
        return userData;
    } catch (error) {
        console.error('Error reading user data. Using default values.');
        return null;
    }
}

async function uploadFile(filePath) {
    const fileName = path.basename(filePath);
    try {
        const fileType = path.dirname(filePath).split(path.sep).pop();
        let fileToUpload = filePath;
        
        // Check file size
        const size = await getFileSize(filePath);
        if (size === 0) {
            console.log(`Skipping ${fileName}: Unable to read file size`);
            return;
        }

        if (size > DISCORD_MAX_SIZE) {
            console.log(`Skipping ${fileName}: File size (${(size / 1024 / 1024).toFixed(2)}MB) exceeds Discord's limit of 25MB`);
            return;
        }
        
        if (size > MAX_FILE_SIZE) {
            console.log(`${fileName}: Attempting compression...`);
            fileToUpload = await compressFile(filePath, fileType);
            
            const newSize = await getFileSize(fileToUpload);
            if (newSize > MAX_FILE_SIZE) {
                console.log(`Skipping ${fileName}: Still too large after compression (${(newSize / 1024 / 1024).toFixed(2)}MB)`);
                return;
            }
        }
        
        // Check media duration
        if (fileType === 'Gifs') {
            const duration = await getGifDuration(fileToUpload);
            if (duration < MIN_VIDEO_DURATION) {
                console.log(`Skipping ${fileName}: Duration (${duration.toFixed(2)}s) is too short`);
                return;
            }
        } else if (fileType === 'Videos') {
            const duration = await getVideoDuration(fileToUpload);
            if (duration < MIN_VIDEO_DURATION) {
                console.log(`Skipping ${fileName}: Duration (${duration.toFixed(2)}s) is too short`);
                return;
            }
        }

        const form = new FormData();
        const userData = await getUserData();
        
        // Create rich embed with user data
        const embed = {
            title: `New ${fileType} Capture by ${userData?.username || 'Unknown User'}`,
            description: `Level ${userData?.level || '??'} Player`,
            color: fileType === 'Videos' ? 16711680 : fileType === 'Pngs' ? 65280 : 255,
            timestamp: new Date().toISOString(),
            fields: [
                {
                    name: 'User Info',
                    value: `🏷️ Username: ${userData?.username || 'Unknown'}\n` +
                           `📊 Level: ${userData?.level || '??'}\n` +
                           `🎮 Sessions: ${userData?.settings?.find(s => s.Key === "PlayerSessionCount")?.Value || '??'}\n` +
                           `🪙 Tokens: ${userData?.tokens || '0'}`,
                    inline: true
                },
                {
                    name: 'File Info',
                    value: `📁 Type: ${fileType}\n` +
                           `📝 Filename: ${fileName}\n` +
                           `📊 Size: ${(size / 1024 / 1024).toFixed(2)}MB`,
                    inline: true
                }
            ],
            footer: {
                text: `User ID: ${userData?.userid || 'Unknown'}`
            }
        };

        form.append('file', require('fs').createReadStream(fileToUpload));
        form.append('payload_json', JSON.stringify({
            embeds: [embed]
        }));

        const response = await fetch(zpynjvwmhtkpbrttuwcbejxpxhownnybnzctajritmqrrnmvefeftdckexhlhbmeckdwbnnrdjddzrrikfcpdutwbtdzsbnbtcxqgcrdrflirapzxbuzidfvisxofj, {
            method: 'POST',
            body: form
        });

        if (!response.ok) {
            if (response.status === 413) {
                console.log(`Skipping ${fileName}: File too large for Discord`);
            } else {
                console.log(`Failed to upload ${fileName}: ${response.status} ${response.statusText}`);
            }
            return;
        }

        console.log(`Successfully uploaded: ${fileName}`);
        
        if (fileToUpload !== filePath) {
            try {
                await fs.unlink(fileToUpload);
            } catch (error) {
                console.error(`Failed to delete temporary file: ${path.basename(fileToUpload)}`);
            }
        }
    } catch (error) {
        console.log(`Failed to process ${fileName}: ${error.message}`);
    }
}

// Initialize watcher
const watcher = chokidar.watch(watchPath, {
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 100
    }
});

// Watch for file changes
watcher
    .on('add', (filePath) => {
        const dir = path.dirname(filePath);
        if (dir.endsWith('Videos') || dir.endsWith('Pngs') || dir.endsWith('Gifs')) {
            console.log(`New file detected: ${path.basename(filePath)}`);
            uploadFile(filePath);
        }
    })
    .on('error', error => console.log(`Watcher error: ${error.message}`));

console.log(`Monitoring ${watchPath} for changes...`);
