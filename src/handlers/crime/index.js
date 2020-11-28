const { DarkNetItems } = require("../../models/DarkNetMarket");
const { JobList } = require("../../models/Jobs");
const { CrimeUtils } = require("../../utils/crimeUtils");
const { DarkItems } = require("../../utils/items/darkitems");
const { UserUtils } = require("../../utils/user");
const { CoinUtils } = require("../../utils/wallet/coins");
const { MoneyUtils } = require("../../utils/wallet/money");
const { CooldownHandlers } = require("../cooldown");

module.exports.CrimeHandlers = {
    crime: async function (client, msg, args) {
        const cooldown = await CooldownHandlers.get("crime", msg.author);
        if (cooldown.response) {
            msg.channel.createMessage(cooldown.embed);
            return;
        }
        var userProfile = await UserUtils.get(msg.author.id);
        const jobList = Object.keys(JobList.pay);
        var jobIndex = jobList.indexOf(userProfile.work.job);

        if(jobIndex < 6 || userProfile.stats.townhall.depositAmount < 2500000) {
            msg.channel.createMessage({
                embed: {
                    title: `Whoops!`,
                    description: `You can't access crimes unless you have the job ${JobList.formatName[jobList[6]]}+ and have deposited $2,500,000 to the town hall.`,
                    color: 16729344
                }
            });
            return;
        }

        msg.channel.createMessage({
            embed: {
                title: `Hey!`,
                description: `How would you like to break in? Type one of the following: \`picking\`, \`bypass\`, \`social\`, or \`pickpocket\`.`,
                color: 16729344
            }
        });

        var types = ['picking', 'bypass', 'social', 'pickpocket'];

        let responses = await msg.channel.awaitMessages(m => 
            m.author.id == msg.author.id && types.includes(m.content), 
            { time: 30000, maxMatches: 1});
        
        if(responses.length) {
            var type;

            switch (responses[0].content) {
                case "picking":
                    type = "lockPicking";
                    break;
                case "bypass":
                    type = "lockBypass";
                    break;
                case "social":
                    type = "socialEngineering";
                    break;
                case "pickpocket":
                    type = "pickpocketing";
                    break;
            }

            var crimeLevel = userProfile.stats.crime.skillCounts[type];
            var chance = (Math.random() * 100) + Math.floor((crimeLevel + 1) * 0.5);

            console.log(Math.floor((userProfile.econ.wallet.balance / 100) * 2.5));
            
            if (chance < 50) {
                msg.channel.createMessage({
                    embed: {
                        title: `Whoops!`,
                        description: `You were caught trying to break in! You were fined ${MoneyUtils.format(Math.floor((userProfile.econ.wallet.balance / 100) * 2.5))}`,
                        color: 16729344
                    }
                });
                CoinUtils.del(msg.author.id, Math.floor((userProfile.econ.wallet.balance / 100) * 2.5))
                return;
            } else if (chance < 53) {
                msg.channel.createMessage({
                    embed: {
                        title: `Nice work.`,
                        description: `You successfully broke into the building and got ${MoneyUtils.format(Math.floor(((userProfile.econ.wallet.balance / 100) * 1.5) * (crimeLevel + 1)))}!`,
                        color: 65280
                    }
                });
                CoinUtils.add(msg.author.id, Math.floor(((userProfile.econ.wallet.balance / 100) * 1.5) * (crimeLevel + 1)));
                return;
            } else {
                msg.channel.createMessage({
                    embed: {
                        title: `Amazing work!`,
                        description: `You successfully broke into the building and got ${MoneyUtils.format(Math.floor(((userProfile.econ.wallet.balance / 100) * 2) * (crimeLevel + 1)))}!
You also leveled up your ${responses[0].content} skill to ${userProfile.crime.skills[type] + 1}.`,
                        color: 65280
                    }
                });
                CrimeUtils.levelup(msg.author.id, type);
                CoinUtils.add(msg.author.id, Math.floor(((userProfile.econ.wallet.balance / 100) * 1) * (crimeLevel + 1)));
                return;
            }
        } else {
            return;
        }
    },
    darknet: async function (client, msg, args) {

        var userProfile = await UserUtils.get(msg.author.id);
        const jobList = Object.keys(JobList.pay);
        var jobIndex = jobList.indexOf(userProfile.work.job);

        if(jobIndex < 10 || userProfile.stats.townhall.depositAmount < 5000000) {
            msg.channel.createMessage({
                embed: {
                    title: `Whoops!`,
                    description: `You can't access the darknet unless you have the job ${JobList.formatName[jobList[11]]}+ and have deposited $5,000,000 to the town hall.`,
                    color: 16729344
                }
            });
            return;
        }

        var subCommand = args[0];

        switch(subCommand) {
            case "buy":
                this.buy(client, msg, args);
                break;
            default:
                this.darknetMenu(client, msg, args, userProfile);
                break;
        }

        
    },
    darknetMenu: async function (client, msg, args, profile) {
        var exploitList = ``;

        for (item in DarkNetItems.items) {
            const itemType = DarkNetItems.type[item].toLowerCase();
            switch(itemType) {
                case "exploits":
                    exploitList += `${DarkNetItems.emojis[item]} ${DarkNetItems.nameFormat[item]} **-** ${MoneyUtils.format(DarkNetItems.items[item])}\n`
                    break;
            }
        }

        msg.channel.createMessage({embed: {
            author: {
                name: `Dark Web Marketplace`
            },
            fields: [
                {
                    name: `Exploits`,
                    value: exploitList
                }
            ]
        }});
    },
    buy: async function (client, msg, args) {

        let chosenItem = args[1];
        var chosenAmount = args[2];

        if(!chosenItem || !Object.keys(DarkNetItems.items).includes(chosenItem)) {
            msg.channel.createMessage({
                embed: {
                    title: `Whoops!`,
                    description: `Please supply a valid item to purchase!`,
                    color: 16729344
                }
            });
            return;
        }
        if(!chosenAmount) {
            chosenAmount = 1;
        }
        if(isNaN(chosenAmount)) {
            msg.channel.createMessage({
                embed: {
                    title: `Whoops!`,
                    description: `Please supply a valid amount of items!`,
                    color: 16729344
                }
            });
            return;
        }

        var coinBalance = await CoinUtils.get(msg.author.id);
        var itemPrice = DarkNetItems.items[chosenItem] * chosenAmount;

        if(coinBalance < itemPrice) {
            msg.channel.createMessage({
                embed: {
                    title: `Whoops!`,
                    description: `You don't have enough money to purchase this!`,
                    color: 16729344
                }
            });
            return;
        }

        msg.channel.createMessage({
            embed: {
                title: `Congrats!`,
                description: `You just purchased ${chosenAmount}x ${DarkNetItems.nameFormat[chosenItem]}!`,
                color: 65280
            }
        });
        await CoinUtils.del(msg.author.id, itemPrice);
        DarkItems.add(msg.author.id, "keyboard", 1);
        return;
    }
}