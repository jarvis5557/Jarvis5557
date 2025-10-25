const fs = require("fs-extra");
const axios = require("axios");
const moment = require("moment-timezone");

module.exports.config = {
    name: "info",
    version: "1.2.7",
    hasPermssion: 0,
    credits: "Shaon Ahmed",
    description: "🥰আসসালামু আলাইকুম 🥰",
    commandCategory: "For users",
    hide: true,
    usages: "",
    cooldowns: 5,
};

module.exports.run = async function({ api, event, args, Users, Threads }) {
    const { threadID } = event;

    // Bot & Prefix info
    const config = require(global.client.configPath);
    const PREFIX = config.PREFIX;
    const namebot = config.BOTNAME;
    const threadSetting = (await Threads.getData(String(threadID))).data || {};
    const prefix = threadSetting.PREFIX || PREFIX;

    // Bot uptime
    const time = process.uptime();
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    // Admins list
    const listAdmin = global.config.ADMINBOT || config.ADMINBOT || [];
    let i = 1;
    const msg = [];
    for (const idAdmin of listAdmin) {
        if (parseInt(idAdmin)) {
            const name = await Users.getNameUser(idAdmin);
            msg.push(`${i++}/ ${name} - ${idAdmin}`);
        }
    }

    // Image links
    const link = [
        "https://i.postimg.cc/QdgH08j6/Messenger-creation-C2-A39-DCF-A8-E7-4-FC7-8715-2559476-FEEF4.gif",
        "https://i.imgur.com/WXQIgMz.jpeg"
    ];
    const imageUrl = link[Math.floor(Math.random() * link.length)];
    const imagePath = __dirname + "/cache/kensu.jpg";

    // Download image using axios
    const writer = fs.createWriteStream(imagePath);
    const response = await axios({
        url: imageUrl,
        method: "GET",
        responseType: "stream"
    });
    response.data.pipe(writer);

    writer.on("finish", () => {
        // Message body
        const body = `
🍀----আসসালামু আলাইকুম----🍀

┏━━•❅•••❈•••❈•••❅•━━┓
「 ${namebot} 」
┗━━•❅•••❈•••❈•••❅•━━┛

↓↓ ROBOT SYSTEM INFO ↓↓
» Prefix system: ${PREFIX}
» Prefix box: ${prefix}
» Total Modules: ${global.client.commands.size}
» Ping: ${Date.now() - event.timestamp}ms

↓↓ ROBOT OWNER INFO ↓↓
NAME :> 𝐀𝐛𝐮 𝐁𝐚𝐤𝐫 𝐒𝐢𝐝𝐝𝐢k
Owner ID link: ☞ https://www.facebook.com/md.abu.bakar.siddik.554219
WhatsApp: ☞ 01709426558

Robot active time: ${hours}h ${minutes}m ${seconds}s

» Total Users: ${global.data.allUserID.length}
» Total Groups: ${global.data.allThreadID.length}

Thanks for using 𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️
        `;
        api.sendMessage({ body, attachment: fs.createReadStream(imagePath) }, threadID, () => fs.unlinkSync(imagePath));
    });

    writer.on("error", (err) => console.error("Image download failed:", err));
};
