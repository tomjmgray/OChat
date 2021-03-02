const db = require('./models');

const realmsArray = [
    {
        name: 'Ashkandi',
        type: 'PvE',
        location: 'Eastern'
    },
    {
        name: 'Atiesh',
        type: 'PvE',
        location: 'Pacific'
    },
    {
        name: 'Azuresong',
        type: 'PvE',
        location: 'Pacific'
    },
    {
        name: 'Mankrik',
        type: 'PvE',
        location: 'Eastern'
    },
    {
        name: 'Myzrael',
        type: 'PvE',
        location: 'Pacific'
    },
    {
        name: 'Old Blanchy',
        type: 'PvE',
        location: 'Pacific'
    },
    {
        name: 'Pagle',
        type: 'PvE',
        location: 'Eastern'
    },
    {
        name: 'Westfall',
        type: 'PvE',
        location: 'Eastern'
    },
    {
        name: 'Windseeker',
        type: 'PvE',
        location: 'Eastern'
    },
    {
        name: 'Mirage Raceway',
        type: 'PvE',
        location: 'UK'
    },
    {
        name: 'Nethergarde Keep',
        type: 'PvE',
        location: 'UK'
    },
    {
        name: 'Pyrewood Village',
        type: 'PvE',
        location: 'UK'
    },
    {
        name: 'Auberdine',
        type: 'PvE',
        location: 'France'
    },
    {
        name: 'Everlook',
        type: 'PvE',
        location: 'Germany'
    },
    {
        name: 'Razorfen',
        type: 'PvE',
        location: 'Germany'
    },
    {
        name: 'Lakeshire',
        type: 'PvE',
        location: 'Germany'
    },
    {
        name: 'Chromie',
        type: 'PvE',
        location: 'Russia'
    },
    {
        name: 'Remulos',
        type: 'PvE',
        location: 'Australia'
    },
    {
        name: 'Shimmering Flats',
        type: 'PvE',
        location: 'Korea'
    },
    {
        name: 'Maraudon',
        type: 'PvE',
        location: 'Taiwan'
    },
    {
        name: 'Anathema',
        type: 'PvP',
        location: 'Pacific'
    },
    {
        name: 'Bigglesworth',
        type: 'PvP',
        location: 'Pacific'
    },
    {
        name: 'Benediction',
        type: 'PvP',
        location: 'Eastern'
    },
    {
        name: 'Blaumeux',
        type: 'PvP',
        location: 'Pacific'
    },
    {
        name: 'Faerlina',
        type: 'PvP',
        location: 'Eastern'
    },
    {
        name: 'Fairbanks',
        type: 'PvP',
        location: 'Pacific'
    },
    {
        name: 'Herod',
        type: 'PvP',
        location: 'Eastern'
    },
    {
        name: 'Incendius',
        type: 'PvP',
        location: 'Eastern'
    },
    {
        name: 'Kirtonos',
        type: 'PvP',
        location: 'Eastern'
    },
    {
        name: 'Kurinaxx',
        type: 'PvP',
        location: 'Pacific'
    },
    {
        name: 'Kromcrush',
        type: 'PvP',
        location: 'Eastern'
    },
    {
        name: 'Loatheb',
        type: 'PvP',
        location: 'Mexico'
    },
    {
        name: 'Netherwind',
        type: 'PvP',
        location: 'Eastern'
    },
    {
        name: 'Rattlegor',
        type: 'PvP',
        location: 'Pacific'
    },
    {
        name: 'Skeram',
        type: 'PvP',
        location: 'Eastern'
    },
    {
        name: 'Smolderweb',
        type: 'PvP',
        location: 'Pacific'
    },
    {
        name: 'Stalagg',
        type: 'PvP',
        location: 'Eastern'
    },
    {
        name: 'Sulfuras',
        type: 'PvP',
        location: 'Eastern'
    },
    {
        name: 'Thalnos',
        type: 'PvP',
        location: 'Eastern'
    },
    {
        name: 'Thunderfury',
        type: 'PvP',
        location: 'Pacific'
    },
    {
        name: 'Whitemane',
        type: 'PvP',
        location: 'Pacific'
    },
    {
        name: 'Ashbringer',
        type: 'PvP',
        location: 'UK'
    },
    {
        name: 'Bloodfang',
        type: 'PvP',
        location: 'UK'
    },
    {
        name: 'Dreadmist',
        type: 'PvP',
        location: 'UK'
    },
    {
        name: 'Firemaw',
        type: 'PvP',
        location: 'UK'
    },
    {
        name: 'Flamelash',
        type: 'PvP',
        location: 'UK'
    },
    {
        name: 'Gandling',
        type: 'PvP',
        location: 'UK'
    },
    {
        name: 'Gehennas',
        type: 'PvP',
        location: 'UK'
    },
    {
        name: 'Golemagg',
        type: 'PvP',
        location: 'UK'
    },
    {
        name: 'Judgement',
        type: 'PvP',
        location: 'UK'
    },
    {
        name: 'Mograine',
        type: 'PvP',
        location: 'UK'
    },
    {
        name: 'Noggenfogger',
        type: 'PvP',
        location: 'UK'
    },
    {
        name: 'Razorgore',
        type: 'PvP',
        location: 'UK'
    },
    {
        name: 'Shazzrah',
        type: 'PvP',
        location: 'UK'
    },
    {
        name: 'Skullflame',
        type: 'PvP',
        location: 'UK'
    },
    {
        name: 'Stonespine',
        type: 'PvP',
        location: 'UK'
    },
    {
        name: 'Ten Storms',
        type: 'PvP',
        location: 'UK'
    },
    {
        name: 'Amnennar',
        type: 'PvP',
        location: 'France'
    },
    {
        name: 'Sulfuron',
        type: 'PvP',
        location: 'France'
    },
    {
        name: 'Finkle',
        type: 'PvP',
        location: 'France'
    },
    {
        name: 'Lucifron',
        type: 'PvP',
        location: 'Germany'
    },
    {
        name: 'Venoxis',
        type: 'PvP',
        location: 'Germany'
    },
    {
        name: 'Patchwerk',
        type: 'PvP',
        location: 'Germany'
    },
    {
        name: 'Dragons Call',
        type: 'PvP',
        location: 'Germany'
    },
    {
        name: 'Transcendence',
        type: 'PvP',
        location: 'Germany'
    },
    {
        name: 'Harbinger of Doom',
        type: 'PvP',
        location: 'Russia'
    },
    {
        name: 'Flamegor',
        type: 'PvP',
        location: 'Russia'
    },
    {
        name: 'Wyrmthalak',
        type: 'PvP',
        location: 'Russia'
    },
    {
        name: 'Rhokdelar',
        type: 'PvP',
        location: 'Russia'
    },
    {
        name: 'Arugal',
        type: 'PvP',
        location: 'Australia'
    },
    {
        name: 'Felstriker',
        type: 'PvP',
        location: 'Australia'
    },
    {
        name: 'Yojamba',
        type: 'PvP',
        location: 'Australia'
    },
    {
        name: 'Hillsbrad',
        type: 'PvP',
        location: 'Korea'
    },
    {
        name: 'Iceblood',
        type: 'PvP',
        location: 'Korea'
    },
    {
        name: 'Lokholar',
        type: 'PvP',
        location: 'Korea'
    },
    {
        name: 'Ragnaros',
        type: 'PvP',
        location: 'Korea'
    },
    {
        name: 'Ivus',
        type: 'PvP',
        location: 'Taiwan'
    },
    {
        name: 'Bloodsail Buccaneers',
        type: 'RP',
        location: 'Eastern'
    }, 
    {
        name: 'Deviate Delight',
        type: 'RP-PvP',
        location: 'Eastern'
    }, 
    {
        name: 'Grobbulus',
        type: 'RP-PvP',
        location: 'Pacific'
    }, 
    {
        name: 'Hydraxian Waterlords',
        type: 'RP',
        location: 'UK'
    }, 
    {
        name: 'Zandalar Tribe',
        type: 'RP-PvP',
        location: 'UK'
    }
]

function seedRealms(arr) {
    for (let i = 0; i < arr.length; i++) {
        db.Realms.create(arr[i], (err, createdRealm) => {
            console.log(createdRealm);
        })
    }
}

seedRealms(realmsArray);