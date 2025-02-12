const RPC = require('discord-rpc');
const chalk = require("chalk")
const clientId = '1335422454004449383';  // Your app's Discord client ID
const client = new RPC.Client({ transport: 'ipc' });

client.on('ready', () => {
   
    
    // Set up the presence
    client.setActivity({
        details: 'A Better RecRoom',  // Main activity text
        state: 'A 2017 RecRoom Server',  // Sub status
        startTimestamp: new Date(),  // Activity start timestamp
        largeImageKey: 'kittyrec_logo',  // Large image (upload this in the Discord Developer Portal)
        largeImageText: 'KittyRec',  // Tooltip text for large image
        smallImageKey: 'recording',  // Small image (upload this in the Discord Developer Portal)
        smallImageText: 'Recording',  // Tooltip text for small image
        buttons: [
            {
                label: 'Visit KittyRec Website',  // Button label
                url: 'https://kittyrec.kittysec.com/'  // Replace with your actual invite or app link
            }
        ]
    });

    
});

// Connect the client
client.login({ clientId }).catch(console.error);
console.clear();


