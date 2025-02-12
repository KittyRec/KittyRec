const fs = require("fs");
const crypto = require("crypto");

async function setPFP(req) {
    var bufferHeader = 0;
    const userInfoDir = './user-info';
    const profileImagePath = `${userInfoDir}/ProfileImage.png`;
    const oldPFPsDir = `${userInfoDir}/OldPFPs`;

    // Ensure the OldPFPs directory exists
    if (!fs.existsSync(oldPFPsDir)) {
        fs.mkdirSync(oldPFPsDir);
    }

    // If ProfileImage.png already exists, move it to OldPFPs
    if (fs.existsSync(profileImagePath)) {
        const hash = crypto.randomBytes(8).toString('hex');
        const oldImagePath = `${oldPFPsDir}/ProfileImage_${hash}.png`;
        fs.renameSync(profileImagePath, oldImagePath);
    }

    var f = fs.createWriteStream(profileImagePath);

    req.on('data', (chunk) => {
        // We only want to remove the header data one time
        if (bufferHeader == 0) {
            const slicedBuffer = Buffer.alloc(chunk.length - 141);
            chunk.copy(slicedBuffer, 0, 141);
            f.write(slicedBuffer);
            bufferHeader = 1;
        } else {
            f.write(chunk);
        }
    });

    req.on('end', () => {
        f.end();
        console.log("PFP HAS BEEN CHANGED! Restart the game to push the changes.");
    });
}

async function setName(req) {
    let data = await require("./decode-request.js").decodeRequest(req);
    data = data.slice(5);

    let json = JSON.parse(fs.readFileSync("./user-info/user.json"));
    json.username = decodeURIComponent(data);
    json = JSON.stringify(json);
    fs.writeFileSync("./user-info/user.json", json);
}

module.exports = { setPFP, setName };
