const router = require('express').Router();
const sequelize = require('../config/connection');
const {Character, User, Perk, Dlc, CharacterPerk} = require('../models/');
const {perkLookup, getAvailablePerks} = require('../utilities/data-manipulation');

router.get('/', (req, res) => {
    //res.render('dashboard');
    Character.findAll({
        where: {
            user_id: req.session.user_id
        },
        attributes: [
            'id',
            'name'
        ]
    })
        .then(dbCharacterData => {
            const characters = dbCharacterData.map(character => character.get({plain: true}));
            res.render('dashboard', {characters, loggedIn: true});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//display a single character on character-view.handlebars
router.get('/character/:id', (req, res) => {
    Character.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'name',
            'level',
            'description',
            'strength',
            'perception',
            'endurance',
            'charisma',
            'intelligence',
            'agility',
            'luck'
        ],
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: CharacterPerk,
                as: 'character_perks'
            }
        ],
        order:[
            [
                CharacterPerk, 'level_taken'
            ]
        ]
    })
        .then(dbCharacterData => {
            if (!dbCharacterData) {
                res.status(404).json({message: 'No character found with this id'});
                return;
            }

            const character = dbCharacterData.get({plain: true});
            //let availablePerkArray;
            //console.log(character);
            //console.log(character.id);
            //console.log(character.character_perks[0].perk_id);

            //call perkLookup and send the character_perks[] array. This will convert the perk_ids into
            //the perk name and perk effect and send them back. Once back we can paste them into
            //the character_perks array for display on the character page.

            //console.log(character.character_perks);

            getAvailablePerks(character).then(perks_list => {
                //const perks = dbPerkListData.get({plain: true});
                //console.log("AvailablePerkArray");
                //console.log(perks);
                //let test = perks.get({plain: true});
                //character.available_perks = test;
                character.available_perks = perks_list;
                //console.log("Character Data:");
                //console.log(character);

                perkLookup(character.character_perks).then(perkArray => {
                    //console.log("Logging perkArray in home function");
                    //console.log(perkArray);
                    //console.log("Logging original character_perks arrray");
                    //console.log(character.character_perks);
                    //console.log(character);
                    //let availablePerksArray = getAvailablePerks(character);
                    //console.log("Available Perks Array: ");
                    //console.log(availablePerksArray);
                    //console.log(character);
                    res.render('character-view', {character, loggedIn: req.session.loggedIn});
                });

                //console.log(availablePerkArray);
            });

            //console.log(perks);


            
            /*
            getAvailablePerks(character).then(availablePerkArray => {
                console.log("AvailablePerkArray");
                console.log(availablePerkArray);
            });*/

            //console.log(availablePerkArray);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/new', (req, res) => {
    //console.log("Inside /character/new route");
    res.render('new-character', {loggedIn: req.session.loggedIn});
});

router.get('/edit/:id', (req, res) => {
    Character.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'name',
            'level',
            'description',
            'strength',
            'perception',
            'endurance',
            'charisma',
            'intelligence',
            'agility',
            'luck'
        ],
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: CharacterPerk,
                as: 'character_perks'
            }
        ],
        order:[
            [
                CharacterPerk, 'level_taken'
            ]
        ]
    })
        .then(dbCharacterData => {
            if (!dbCharacterData) {
                res.status(404).json({message: 'No character found with this id'});
                return;
            }

            const character = dbCharacterData.get({plain: true});
            //let availablePerkArray;
            //console.log(character);
            //console.log(character.id);
            //console.log(character.character_perks[0].perk_id);

            //call perkLookup and send the character_perks[] array. This will convert the perk_ids into
            //the perk name and perk effect and send them back. Once back we can paste them into
            //the character_perks array for display on the character page.

            //console.log(character.character_perks);

            getAvailablePerks(character).then(perks_list => {
                //const perks = dbPerkListData.get({plain: true});
                //console.log("AvailablePerkArray");
                //console.log(perks);
                //let test = perks.get({plain: true});
                //character.available_perks = test;
                character.available_perks = perks_list;
                //console.log("Character Data:");
                //console.log(character);

                perkLookup(character.character_perks).then(perkArray => {
                    //console.log("Logging perkArray in home function");
                    //console.log(perkArray);
                    //console.log("Logging original character_perks arrray");
                    //console.log(character.character_perks);
                    //console.log(character);
                    //let availablePerksArray = getAvailablePerks(character);
                    //console.log("Available Perks Array: ");
                    //console.log(availablePerksArray);
                    //console.log(character);
                    res.render('character-edit', {character, loggedIn: req.session.loggedIn});
                });

                //console.log(availablePerkArray);
            });

            //console.log(perks);


            
            /*
            getAvailablePerks(character).then(availablePerkArray => {
                console.log("AvailablePerkArray");
                console.log(availablePerkArray);
            });*/

            //console.log(availablePerkArray);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
})

module.exports = router;