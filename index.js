'use strict';

require('dotenv').config();
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const { WebClient, LogLevel } = require('@slack/web-api');
const { App } = require('@slack/bolt');

const channel = 'general';
const fileName = "./laolmieuzij61.png";

const client = new WebClient(process.env.SLACK_API_TOKEN, {
    logLevel: LogLevel.DEBUG,
});


async function Main() {
    try {
        // let stream = fs.createReadStream(fileName);
        // stream.on("error", err => reject(err));
        // stream.on("data", chunk => hash.update(chunk));
        // stream.on("end", () => resolve(hash.digest("hex")));

        const uploadResult = await client.files.upload({
            channels: channel,
            initial_comment: "Today\'s puzzle :smile:",
            file: fs.createReadStream(fileName),
        });
        console.log(uploadResult);
        const params = {
            icon_emoji: ':robot_face:'
        }
        // await web.chat.postMessage({
        //     channel: `#${channel}`,
        //     type: 'mrkdwn',
        //     text: 'Today\'s puzzle: https://i.imgur.com/aBumn1S.jpeg',
        //     params
        // });
        // console.log('Message posted!');
    } catch (error) {
        console.log(error);
    }
}

const app = new App({
    token: process.env.SLACK_API_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: false,
});

async function MainSocket() {
    await app.start();
    console.log('⚡ Bolt app started');
};

app.command('/ricochet', async ({ event, command, ack, respond }) => {
    try {
        console.log('🔥 Let\'s call it');
        // await ack();
        await respond(`${command.text}`);
    } catch (error) {
        console.error(error);
    }
});



MainSocket();
// Main();