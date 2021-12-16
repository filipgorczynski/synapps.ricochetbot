'use strict';

require('dotenv').config();
const fs = require('fs');
const { WebClient, LogLevel } = require('@slack/web-api');
const channel = 'general';
const web = new WebClient(process.env.SLACK_API_TOKEN, {
    // LogLevel can be imported and used to make debugging simpler
    logLevel: LogLevel.DEBUG
  });
const fileName = "./laolmieuzij61.png";


async function Main() {
    try {
        const uploadResult = await web.files.upload({
            channels: channel,
            initial_comment: "Today\'s puzzle :smile:",
            file: fs.createReadStream(fileName)
        });
        console.log(uploadResult);
        // await web.chat.postMessage({
        //     channel: `#${channel}`,
        //     type: 'mrkdwn',
        //     text: 'Today\'s puzzle: https://i.imgur.com/aBumn1S.jpeg',
        // });
        // console.log('Message posted!');
    } catch (error) {
        console.log(error);
    }
}

Main();