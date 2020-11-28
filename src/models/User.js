const mongoose = require('mongoose');

const userModel = mongoose.Schema({
    userID: String,
    econ: {
        wallet: {
            balance: {
                type: Number,
                default: 500
            },
            gems: {
                type: Number,
                default: 0
            }
        },
        bank: {
            balance: {
                type: Number,
                default: 0
            },
            gems: {
                type: Number,
                default: 0
            }
        }
    },
    work: {
        job: {
            type: String,
            default: "None"
        },
        raiseLevel: {
            type: Number,
            default: 0
        },
        sick: {
            type: Boolean,
            default: false
        }
    },
    crime: {
        skills: {
            lockPicking: {
                type: Number,
                default: 0
            },
            lockBypass: {
                type: Number,
                default: 0
            },
            socialEngineering: {
                type: Number,
                default: 0
            },
            pickpocketing: {
                type: Number,
                default: 0
            }
        },
        darknet: {
            exploits: {
                keyboard: {
                    type: Number,
                    default: 0
                },
                database: {
                    type: Number,
                    default: 0
                }
            }
        }
    },
    cooldowns: {
        work: {
            type: Date,
            default: 0
        },
        apply: {
            type: Date,
            default: 0
        },
        crime: {
            type: Date,
            default: 0
        },
        pay: {
            type: Date,
            default: 0
        },
        flip: {
            type: Date,
            default: 0
        }
    },
    collections: {
        paintings: {
            monalisa: {
                type: Number,
                default: 0
            },
            starrynight: {
                type: Number,
                default: 0
            },
            scream: {
                type: Number,
                default: 0
            },
        },
        cars: {
            rollsRoyceSweptail: {
                type: Number,
                default: 0
            },
            mcLarenP1: {
                type: Number,
                default: 0
            },
            bugattiVeyron: {
                type: Number,
                default: 0
            },
            teslaModel3: {
                type: Number,
                default: 0
            },
        }
    },
    stats: {
        econ: {
            totalEarnedWallet: {
                type: Number,
                default: 0
            },
            totalEarnedGems: {
                type: Number,
                default: 0
            }
        },
        work: {
            workCount: {
                type: Number,
                default: 0
            },
            workCountRaise: {
                type: Number,
                default: 0
            },
            workStreak: {
                type: Number,
                default: 0
            },
            lastWork: {
                type: Date,
                default: 0
            }
        },
        townhall: {
            depositAmount: {
                type: Number,
                default: 0
            }
        },
        crime: {
            skillCounts: {
                lockPicking: {
                    type: Number,
                    default: 0
                },
                lockBypass: {
                    type: Number,
                    default: 0
                },
                socialEngineering: {
                    type: Number,
                    default: 0
                },
                pickpocketing: {
                    type: Number,
                    default: 0
                }
            }
        }
    }
});
module.exports = mongoose.model("userModel", userModel);