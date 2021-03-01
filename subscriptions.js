const logger = require("./logger")("subscriptions");
const moment = require("moment");
const axios = require("axios");

const SUBSCRIPTIONS_ONLY = Boolean(process.env.SUBSCRIPTIONS_ONLY);
const PATREON_ACCESS_TOKEN = process.env.PATREON_ACCESS_TOKEN;

const PATREON_API = "https://www.patreon.com/api/oauth2/v2";

exports.getSubscription = (config) => {
  if (!SUBSCRIPTIONS_ONLY) return null;
  if (!config) {
    logger.warn(
      "Do not call hasSubscription method for guilds that have not fetched config."
    );
    return false;
  }
  if (!config.subscription) return null;
  return config.subscription;
};

exports.hasSubscription = (config) => {
  if (!SUBSCRIPTIONS_ONLY) return true;
  if (!config) {
    logger.warn(
      "Do not call hasSubscription method for guilds that have not fetched config."
    );
    return false;
  }
  if (!config.subscription) return false;
  return moment(config.subscription.expires || config.subscription).diff() > 0;
};

let campaigns;
exports.setSubscription = async (config, userId) => {
  if (!config) {
    logger.warn(
      "Do not call hasSubscription method for guilds that have not fetched config."
    );
    return null;
  }

  if (!PATREON_ACCESS_TOKEN) {
    logger.debug(`[${config.name}] Subscription validated.`);
    return {
      ...config,
      subscription: {
        owner: userId,
        expires: moment().add(1, "year").toDate(),
      },
    };
  }

  const patreon = axios.create({
    baseURL: PATREON_API,
    headers: {
      Authorization: `Bearer ${PATREON_ACCESS_TOKEN}`,
    },
    paramsSerializer: (params) =>
      Object.keys(params)
        .map((k) => `${encodeURI(k)}=${params[k]}`)
        .join("&"),
  });

  // Patreon subscription
  logger.debug("Fetching patreon pledges.");
  let pledges = [];
  let users = [];
  try {
    campaigns = campaigns || (await patreon.get("/campaigns")).data.data;
    for (let campaign of campaigns) {
      const campaignPledges = (
        await patreon.get(`/campaigns/${campaign.id}/members`, {
          params: {
            include: "user",
            ["fields[user]"]: "url,social_connections",
            ["fields[member]"]: "patron_status,next_charge_date",
          },
        })
      ).data;

      pledges = pledges.concat(campaignPledges.data);
      users = users.concat(
        campaignPledges.included.filter((i) => i.type === "user")
      );
    }
  } catch (e) {
    logger.error(`Failed to fetch pledge list [${e}]`);
    throw new Error("FETCH_FAIL");
  }

  // TODO: Users apply unique

  logger.debug(`${pledges.length} pledges found for ${users.length} users.`);
  for (let pledge of pledges) {
    const user = users.find((u) => u.id === pledge.relationships.user.data.id);
    if (!user) continue;
    const discordUser = user.attributes.social_connections.discord;
    if (!discordUser) continue;

    // Check if user has linked Discord account
    if (userId.toString() === discordUser.user_id) {
      // Check if the pledge is still active
      if (patron_status !== "active_patron") {
        throw new Error("PLEDGE_CANCELLED");
      }

      // Peform subscription
      const subscription = moment(pledge.attributes.next_charge_date);
      while (subscription.diff(moment(), "days") < 1) {
        subscription.add(1, "months");
      }

      logger.debug(
        `[${config.name}] Subscription validated for Patreon user ${
          user.attributes.url
        }. Subscription until ${subscription.toString()}`
      );
      return {
        ...config,
        subscription: {
          owner: userId,
          patreon: user.attributes.url,
          expires: subscription.toDate(),
        },
      };
    }
  }

  throw new Error("PATREON_DISCORD_NOT_FOUND");
};

exports.cancelSubscription = (config) => {
  if (!config) {
    logger.warn(
      "Do not call hasSubscription method for guilds that have not fetched config."
    );
    return null;
  }

  logger.debug(`[${config.name}] Subscription cancelled.`);
  config.subscription = null;
  return config;
};

exports.refresh = ({ client }) => {
  if (!SUBSCRIPTIONS_ONLY) return;

  const { getConfigByGuild } = require("./config");
};
