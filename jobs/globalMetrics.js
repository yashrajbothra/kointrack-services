const { youtubeService } = require('../services');
const { connectDB, disConnectDB } = require('../db/db');
const { Channel } = require('../db/models');
const Logger = require('../utils/logger');

const fetchChannelData = async () => {
  try {
    Logger.info('Channels update Cron started!');
    await connectDB();
    const channels = await Channel.find({ isActive: true });

    const channelMetaPromises = channels.map(
      (channel) => youtubeService.getChannelById(channel.channelId),
    );

    const channelMetaData = await Promise.all(channelMetaPromises);

    const channelPromises = [];
    for (let i = 0; i < channels.length; i++) {
      channels[i].metadata = channelMetaData[i][0];
      channelPromises.push(channels[i].save());
    }

    await Promise.all(channelPromises);

    await disConnectDB();
    Logger.info(`${channels.length} channels updated successfully!`);
  } catch (err) {
    await disConnectDB();
    Logger.error(err);
  }
};

// run this script for every 24 hrs
setInterval(fetchChannelData, 86400000);
