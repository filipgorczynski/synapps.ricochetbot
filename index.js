'use strict';

require('dotenv').config();
const { WebClient } = require('@slack/web-api');
const channel = 'general';
const currentTime = new Date().toTimeString();

console.log('Getting started with Node Slack SDK');

const web = new WebClient(process.env.SLACK_API_TOKEN)

async function Main() {
    try {
        await web.chat.postMessage({
            channel: `#${channel}`,
            text: `The current time is ${currentTime}`,
        });
        console.log('Message posted!');
    } catch (error) {
        console.log(error);
    }
}

Main();