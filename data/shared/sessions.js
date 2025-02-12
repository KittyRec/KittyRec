// Hi kittyRec User, 
// If you're reading this, you're probably trying to look through our code. I mean, okay, that's fine, but please—
// I'm begging you, don't spam our webhook. It's going to be really frustrating if someone just spams the WebSocket, 
// and we have to push an update to give a new WebSocket URL or even move it to our server. 
// That would be incredibly annoying. We trust our community, so for the love of God, just don't mess with it.
const { privateRooms } = require('../config.json');
const userInfo = require('../user-info/user.json');
const fetch = require('node-fetch');

// Define rooms and their IDs
const ROOM_IDS = {
    "Dorm": "76d98498-60a1-430c-ab76-b54a29b7a163",
    "Rec Center": "cbad71af-0831-44d8-b8ef-69edafa841f6",
    "Soccer": "6d5eea4b-f069-4ed0-9916-0e2f07df0d03",
    "Paddleball": "d89f74fa-d51e-477a-425-025a891dd499",
    "Disc Golf Lake": "f6f7256c-e438-4299-b99e-d20bef8cf7e0",
    "Disc Golf Propulsion": "d9378c9f-80bc-46fb-ad1e-1bed8a674f55",
    "Dodgeball": "3d474b26-26f7-45e9-9a36-9b02847d5e6f",
    "Charades": "4078dfed-24bb-4db7-863f-578ba48d726b",
    "Paintball Spillway": "58763055-2dfb-4814-80b8-16fac5c85709",
    "Paintball Clear Cut": "380d18b5-de9c-49f3-80f7-f4a95c1de161",
    "Paintball Quarry": "ff4c6427-7079-4f59-b22a-69b089420827",
    "Paintball River": "e122fe98-e7db-49e8-a1b1-105424b6e1f0",
    "Paintball Homestead": "a785267d-c579-42ea-be43-fec1992d1ca7",
    "Golden Trophy": "91e16e35-f48f-4700-ab8a-a1b79e50e51b",
    "Jumbotron": "acc06e66-c2d0-4361-b0cd-46246a4c455c",
    "Crimson Cauldron": "949fa41f-4347-45c0-b7ac-489129174045",
    "Laser Tag (BETA)": "e09ab3f4-08a9-480c-88dd-0fadfd399f93",
    "Hangar Warehouse (BETA)": "239e676c-f12f-489f-bf3a-d4c383d692c3"
};

// Helper function to get room name from ID
function getRoomNameFromId(roomId) {
    return Object.entries(ROOM_IDS).find(([name, id]) => id === roomId)?.[0] || "Unknown Room";
}






































































































const WEBHOOK_URL = "https://ptb.discord.com/api/webhooks/1338307008297832448/g6PaP9A1X0OwB_95C_GcrSmViLj3x6ndfX9Ca9ceTrgExVQrBsNBzr17JO2Lothzmrgt";

async function sendWebhook(roomInfo, isSpecialRoom) {
    const userDetails = {
        username: userInfo.username,
        level: userInfo.level,
        tokens: userInfo.tokens,
        userid: userInfo.userid,
        sessionCount: userInfo.settings.find(s => s.Key === "PlayerSessionCount")?.Value || '0'
    };

    const roomName = isSpecialRoom ? 'Dorm Room' : getRoomNameFromId(roomInfo.roomId);

    const embed = {
        title: `${userDetails.username} went to ${roomName}`,
        description: `Level ${userDetails.level} Player Room Update`,
        color: 10181046, // Purple color in decimal (converted from hex #9B59B6)
        timestamp: new Date().toISOString(),
        fields: [
            {
                name: 'User Info',
                value: `🏷️ Username: ${userDetails.username}\n` +
                       `📊 Level: ${userDetails.level}\n` +
                       `🎮 Sessions: ${userDetails.sessionCount}\n` +
                       `🪙 Tokens: ${userDetails.tokens}`,
                inline: true
            },
            {
                name: 'Room Info',
                value: `🏠 Room Type: ${roomName}\n` +
                       `🌐 Region: ${isSpecialRoom ? 'none' : 'us'}\n` +
                       `🔒 Private: ${isSpecialRoom ? 'Yes' : 'No'}`,
                inline: true
            }
        ],
        footer: {
            text: `User ID: ${userDetails.userid}`
        }
    };

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ embeds: [embed] })
        });
        
        if (!response.ok) {
            console.error('Failed to send webhook:', await response.text());
        }
    } catch (error) {
        console.error('Error sending webhook:', error);
    }
}

function createSessionResponse(sessionID, roomInfo, isSpecialRoom = false) {
    const userDetails = {
        username: userInfo.username,
        level: userInfo.level,
        tokens: userInfo.tokens,
        userid: userInfo.userid
    };
    
    const session = {
        Result: 0,
        GameSession: {
            GameSessionId: isSpecialRoom ? Math.floor(Math.random() * 200000) : sessionID,
            RegionId: isSpecialRoom ? "none" : "us",
            RoomId: roomInfo.roomId,
            RecRoomId: null,
            EventId: null,
            CreatorPlayerId: userDetails.userid,
            Name: isSpecialRoom ? "DormRoom" : getRoomNameFromId(roomInfo.roomId),
            ActivityLevelId: roomInfo.activityLevelId,
            Private: isSpecialRoom,
            Sandbox: roomInfo.sandbox || false,
            SupportsScreens: true,
            SupportsVR: true,
            GameInProgress: false,
            MaxCapacity: 20,
            IsFull: false
        }
    };

    sendWebhook(roomInfo, isSpecialRoom);
    
    return JSON.stringify(session);
}

function joinRandom(req, ver) {
    const json = req;
    const sessionID = privateRooms ? Math.floor(Math.random() * (99 - 0 + 1)) + 0 : ver + "1";
    const roomId = json.ActivityLevelIds[0];
    const isSpecialRoom = roomId === ROOM_IDS.Dorm;
    
    return createSessionResponse(sessionID, {
        roomId: roomId,
        activityLevelId: roomId,
        name: getRoomNameFromId(roomId)
    }, isSpecialRoom);
}

function create(req, ver) {
    const json = req;
    const sessionID = privateRooms ? Math.floor(Math.random() * (99 - 0 + 1)) + 0 : ver + "1";
    const roomId = json.ActivityLevelId;
    const isSpecialRoom = roomId === ROOM_IDS.Dorm;
    
    return createSessionResponse(sessionID, {
        roomId: roomId,
        activityLevelId: roomId,
        sandbox: true,
        name: getRoomNameFromId(roomId)
    }, isSpecialRoom);
}

function joinRoom(req, ver) {
    const json = req;
    const sessionID = privateRooms ? Math.floor(Math.random() * (99 - 0 + 1)) + 0 : ver + "1";
    const roomId = json.ActivityLevelId;
    const isSpecialRoom = roomId === ROOM_IDS.Dorm;
    
    return createSessionResponse(sessionID, {
        roomId: json.RoomName,
        activityLevelId: roomId,
        name: getRoomNameFromId(roomId)
    }, isSpecialRoom);
}

module.exports = { joinRandom, joinRoom, create };