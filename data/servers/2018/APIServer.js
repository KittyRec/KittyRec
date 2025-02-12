const chalk = require('chalk') // colored text
const express = require('express') //express.js - the web server
const morgan = require('morgan') //for webserver output
const bodyParser = require("body-parser")
const app = express()
const fs = require("fs")
const path = require("path")
app.use(morgan(`${chalk.green("[API]")} :method ":url" :status - :response-time ms`))
app.use(bodyParser.json()); // support json encoded bodies
app.use(express.urlencoded({ extended: true })); // support encoded bodies
const request = require('request')
const token = fs.readFileSync('./user-info/token.txt', 'utf8');
const avataritemsss = fs.readFileSync('./user-info/avataritems.txt', 'utf8');
const { id, username } = require('../../user-info/user.json')
const { ports } = require("../../config.json")
const multer = require("multer");

const axios = require('axios')

// Path to the JSON file
const filePath = path.resolve(__dirname, '../../user-info/user.json');

// Read the JSON file
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  try {
    // Parse JSON data
    const userData = JSON.parse(data);

    // Get the 'userid' field from the JSON and save it as 'skubbusy'
    const skubbusy = userData.userid;

    // Now you can use the 'skubbusy' variable for further processing
    
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
});



let port;

function start(serveport = ports.API_2018){
    try {
        port = serveport
        serve()
    } catch(e) {
        console.error(e)
    }
}

function serve() {
    /*
        GET REQUESTS
    */
    app.get('/', (req, res) => {
        res.send("[]")
    })


     
    app.get('/api/versioncheck/v3?v=20180712_EA', (req, res) => {
        res.send("{\"ValidVersion\":true}")
    })  

    app.get('/api/versioncheck/*', (req, res) => {
        res.send("{\"ValidVersion\":true}")
    }) 
    app.get('/api/presence/v2/setscreenmode/*', (req, res) => {
        res.send("[]")
    })   
    app.get('/api/presence/v2/setscreenmode', (req, res) => {
        res.send('[{"InScreenMode":true}]');
    })

    app.post('/api/presence/v2/setscreenmode', (req, res) => {
        res.send('[{"InScreenMode":true}]');
    })
    app.get('/api/playersubscriptions/v1/my', (req, res) => {
        res.send("[]")
    })   
    app.post('/api/playersubscriptions/v1/my', (req, res) => {
        res.send("[]")
    })   

    app.get('/api/platformlogin/v1/getcachedlogins/*', (req, res) => {
        res.send("[]")
    }) 

    app.get('/api/platformlogin/v1/logincached/*', (req, res) => {
        res.send("[]")
    })    
    
    app.get('/api/PlayerReporting/v1/moderationBlockDetails/*', (req, res) => {
        res.send("[]")
    })   

    app.get('/api/presence/v2/setscreenmode/*', (req, res) => {
        res.send("[]")
    })   
    app.get('/api/avatar/v2/gifts/generate"', (req, res) => {
      const xp_amount = 1000;  // Assuming you want to define xp_amount
      const response = {
          "Id": 2,
          "AvatarItemDesc": "274cb9b2-2f59-47ea-9a8d-a5b656d148c6",
          "Xp": xp_amount
      };
      res.json(response);  // Properly return the JSON object
  });
  
  app.post('/api/avatar/v2/gifts/generate"', (req, res) => {
    const xp_amount = 1000;  // Assuming you want to define xp_amount
    const response = {
        "Id": 2,
        "AvatarItemDesc": "274cb9b2-2f59-47ea-9a8d-a5b656d148c6",
        "Xp": xp_amount
    };
    res.json(response);  // Properly return the JSON object
});


    


    // Endpoint for removing a friend
    app.get('/api/relationships/v2/removefriend', (req, res) => {
        const id = req.query.id;
        const options = {
        method: 'PATCH',
        url: `https://5513c47b-5650-452c-a1b6-790312fc7ed9-00-38qm0sv2bez6a.janeway.replit.dev/api/relationships/v2/unfriend/${id}`,
        headers: {
            Authorization: token,
        },
        };
        request(options, (error, response) => {
        if (error) throw new Error(error);
        res.send(response.body);
        })
    })
    
    // Endpoint for sending a friend request
    app.get('/api/relationships/v2/sendfriendrequest', (req, res) => {
        const id = req.query.id;
        const options = {
        method: 'PATCH',
        url: `https://5513c47b-5650-452c-a1b6-790312fc7ed9-00-38qm0sv2bez6a.janeway.replit.dev/api/relationships/v2/sendfriendrequest/${id}`,
        headers: {
            Authorization: token,
            favorite: 1,
        },
        };
        request(options, (error, response) => {
        if (error) throw new Error(error);
        res.send(response.body);
        })
    })
    
    // Endpoint for unfavorite
    app.get('/api/relationships/v1/unfavorite', (req, res) => {
        const id = req.query.id;
        const options = {
        method: 'PATCH',
        url: `https://5513c47b-5650-452c-a1b6-790312fc7ed9-00-38qm0sv2bez6a.janeway.replit.dev/api/relationships/v2/unfavorite/${id}`,
        headers: {
            Authorization: token,
        },
        };
        request(options, (error, response) => {
        if (error) throw new Error(error);
        res.send(response.body);
        })
    })
    
    // Endpoint for favorite
    app.get('/api/relationships/v1/favorite', (req, res) => {
        const id = req.query.id;
        const options = {
        method: 'PATCH',
        url: `https://5513c47b-5650-452c-a1b6-790312fc7ed9-00-38qm0sv2bez6a.janeway.replit.dev/api/relationships/v2/favorite/${id}`,
        headers: {
            Authorization: token,
        },
        };
        request(options, (error, response) => {
        if (error) throw new Error(error);
        res.send(response.body);
        })
    })









    app.get('/api/players/v2/search', (req, res) => {
        // Get the player name from the query parameter
        const playerName = req.query.name;
      
        // Make a request to the API endpoint
        const requestOptions = {
          method: 'GET',
          url: `https://5513c47b-5650-452c-a1b6-790312fc7ed9-00-38qm0sv2bez6a.janeway.replit.dev/api/players/v2/search/name/${playerName}`,
        };
      
        request(requestOptions, (error, response, body) => {
          if (error) {
            console.error(error);
          } else {
            // Handle the response here
            res.send(body);
          }
        })
    })      

    app.get('/api/images/v1/profile/*', async (req, res) => {
        res.sendFile(path.resolve(`${__dirname}/../../user-info/ProfileImage.png`))
    })
      


    app.get('/api/players/v1/*', (req, res) => {
        res.send(require("../../shared/getorcreate.js").GetOrCreate())
    })



    app.get('/api/avatar/v3/items', (req, res) => {
        res.send(avataritemsss)
    })

    app.get('/api/presence/v2/setscreenmode/*', (req, res) => {
        res.send("[]")
    })   

const { id, username } = require('../../user-info/user.json');

app.get('/api/avatar/v2/gifts', async (req, res) => {
  const xp_amount = 1000;  // Assuming you want to define xp_amount
  const response = {
      "Id": 2,
      "AvatarItemDesc": "274cb9b2-2f59-47ea-9a8d-a5b656d148c6",
      "Xp": xp_amount
  };
  res.json(response);  // Properly return the JSON object
});

    app.get('/api/activities/charades/v1/words', (req, res) => {
        res.send(require("../../shared/charades.js").generateCharades())
    })

    app.get('/api/config/v2', (req, res) => {
        res.send(require('../../shared/config.js').config())
    })


        
    app.get('/api/avatar/v2', (req, res) => {
        res.send(JSON.stringify(require("../../shared/avatar.js").loadAvatar(2017)))
    })

    app.get('/api/settings/v2', (req, res) => {
        res.send(JSON.stringify(require("../../shared/settings.js").loadSettings()))
    })

    app.get('/api/PlayerReporting/v1/moderationBlockDetails', (req, res) => {
        res.send(JSON.stringify({"ReportCategory":0,"Duration":0,"GameSessionId":0,"Message":""}))
    })

    app.get('/api/config/v1/amplitude', (req, res) => {
        res.send(JSON.stringify({AmplitudeKey: "ba134c25c82d2743a62c166c75a14df0"}))
    })

    app.get('/api/gameconfigs/v1/all', (req, res) => {
        res.send(JSON.stringify([
            {"Key": "Gift.MaxDaily","Value": "100","StartTime": null,"EndTime": null},
            {"Key": "Gift.Falloff","Value": "1","StartTime": null,"EndTime": null},
            {"Key": "Gift.DropChance","Value": "100","StartTime": null,"EndTime": null},
            {"Key": "UseHeartbeatfWebSocket","Value": "0","StartTime": null,"EndTime": null},
            {"Key": "Screens.ForceVerification","Value": "1","StartTime": null,"EndTime": null},
            {"Key": "forceRegistration","Value": "0","StartTime": null,"EndTime": null},
            {"Key": "Door.Creative.Query","Value": "#puzzle","StartTime": null,"EndTime": null},
            {"Key": "Door.Creative.Title","Value": "PUZZLE","StartTime": null,"EndTime": null},
            {"Key": "Door.Featured.Query","Value": "#featured","StartTime": null,"EndTime": null},
            {"Key": "Door.Featured.Title","Value": "Featured","StartTime": null,"EndTime": null},
            {"Key": "Door.Quests.Query","Value": "#quest","StartTime": null,"EndTime": null},
            {"Key": "Door.Quests.Title","Value": "QUESTS","StartTime": null,"EndTime": null},
            {"Key": "Door.Shooters.Query","Value": "#pvp #rro","StartTime": null,"EndTime": null},
            {"Key": "Door.Shooters.Title","Value": "PVP","StartTime": null,"EndTime": null},
            {"Key": "Door.Sports.Query","Value": "#sport","StartTime": null,"EndTime": null},
            {"Key": "Door.Sports.Title","Value": "SPORTS & PVP","StartTime": null,"EndTime": null}]
        ))
})

    app.get('/api/relationships/v2/get', (req, res) => {
        res.send("[]")
    })

    app.get('/api/messages/v2/get', (req, res) => {
      res.send([
        {
          "Id": 1,
          "FromPlayerId": 2,
          "SentTime": "2022-07-29T05:29:02+00:00",
          "Type": 100,
          "Data": "Hello, welcome to KittyRec! A shit server for brahman and her friends to have esex on.",
          "RoomId": 0,
          "PlayerEventId": 0
        }
      ]);
  });
  app.get('//api/chat/v2/myChats?*', (req, res) => {
    res.send([
      {
        "Id": 48326,
        "FromPlayerId": 1,
        "SentTime": "2021-07-29T05:29:02+00:00",
        "Type": 100,
        "Data": "Hello, welcome to KittyRec! A shit server for brahman and her friends to have esex on.",
        "RoomId": 0,
        "PlayerEventId": 0
      }
    ]);
});

    app.get('/api/checklist/v1/current', (req, res) => {
        res.send("[]")
    })

    app.get('/api/equipment/v1/getUnlocked', (req, res) => {
        res.send(require("../../shared/equipment.js").getequipment())
    })

    app.get('/api/events/v*/list', (req, res) => {
        res.send("[]")
    })

    app.get('/api/avatar/v*/saved', (req, res) => {
        res.send("[]")
    })

    app.get('/api/consumables/v1/getUnlocked', (req, res) => {
        res.send(JSON.stringify([
            {"Id":1,"ConsumableItemDesc":"7OZ5AE3uuUyqa0P","CreatedAt":"2022-02-18T23:29:59.9035571-05:00","Count":99,"UnlockedLevel":1,"IsActive":false},
            {"Id":2,"ConsumableItemDesc":"_jnjYGBcyEWY5Ub4OezXcA","CreatedAt":"2022-02-18T23:29:59.909138-05:00","Count":99,"UnlockedLevel":1,"IsActive":false},
            {"Id":3,"ConsumableItemDesc":"5hIAZ9wg5EyG1cILf4FS2A","CreatedAt":"2022-02-18T23:29:59.909138-05:00","Count":99,"UnlockedLevel":1,"IsActive":false},//Cheese Pizza
            {"Id":4,"ConsumableItemDesc":"wUCIKdJSvEmiQHYMyx4X4w","CreatedAt":"2022-02-18T23:29:59.909138-05:00","Count":99,"UnlockedLevel":1,"IsActive":false},//Supreme Pizza
            {"Id":5,"ConsumableItemDesc":"JfnVXFmilU6ysv-VbTAe3A","CreatedAt":"2022-02-18T23:29:59.909138-05:00","Count":99,"UnlockedLevel":1,"IsActive":false},//Rootbeer
            {"Id":6,"ConsumableItemDesc":"InQ25wQMGkG_bvuD5rf2Ag","CreatedAt":"2022-02-18T23:29:59.909138-05:00","Count":99,"UnlockedLevel":1,"IsActive":false},
            {"Id":7,"ConsumableItemDesc":"mMCGPgK3tki5S_15q2Z81A","CreatedAt":"2022-02-18T23:29:59.909138-05:00","Count":99,"UnlockedLevel":1,"IsActive":false},
            {"Id":8,"ConsumableItemDesc":"ZuvkidodzkuOfGLDnTOFyg","CreatedAt":"2022-02-18T23:29:59.909138-05:00","Count":99,"UnlockedLevel":1,"IsActive":false},
            {"Id":9,"ConsumableItemDesc":"VQSgL2pTLkWx4B3kwYG7UA","CreatedAt":"2022-02-18T23:29:59.909138-05:00","Count":99,"UnlockedLevel":1,"IsActive":false},
            {"Id":10,"ConsumableItemDesc":"Tpxqe_lycUelySRHM8B0Vw","CreatedAt":"2022-02-18T23:29:59.909138-05:00","Count":99,"UnlockedLevel":1,"IsActive":false},
            {"Id":11,"ConsumableItemDesc":"-hy0qD-iUk-v4NHxNzanmg","CreatedAt":"2022-02-18T23:29:59.909138-05:00","Count":99,"UnlockedLevel":1,"IsActive":false}
        ]));
    });

    app.get('/api/storefronts/v3/balance/*', (req, res) => {
      // Handle the GET request for "/api/storefronts/v3/balance/1"
      // You can return data or an empty array as per your requirement
      res.send("[]");
  });







    app.get('/api/storefronts/v3/giftdropstore/1', (req, res) => {
      res.send(JSON.stringify([
        {
          "StorefrontType":1,
          "NextUpdate":"2021-05-06T20:25:32.5889204+10:00",
          "StoreItems": [
            {
              "PurchasableItemId":69,
              "Type":0,
              "IsFeatured":false,
              "Prices": [
                {
                  "CurrencyType":1,
                  "Price": 0
                }
              ],
              "GiftDrops": [
                {
                  "GiftDropId":69,
                  "FriendlyName":"Laser Tag Alpha Shirt",
                  "Tooltip":"",
                  "AvatarItemDesc":"d0a9262f-5504-46a7-bb10-7507503db58e,c0ff7719-c56a-4934-831b-506ad0f51cca,3259238f-4a9e-4e06-99de-6e7324fa0894,e38294cf-6279-4863-9aea-1a19aeaf8476",
                  "ConsumableItemDesc":"",
                  "EquipmentPrefabName":"",
                  "EquipmentModificationGuid":"",
                  "Rarity":50,
                  "IsQuery":false,
                  "Unique":false,
                  "Level":1,
                  "Context":100000
                }
              ]
            },
            {
              "PurchasableItemId":77,
              "Type":0,
              "IsFeatured":false,
              "Prices": [
                {
                  "CurrencyType":1,
                  "Price":0
                }
              ],
              "GiftDrops": [
                {
                  "GiftDropId":77,
                  "FriendlyName":"Alpaca Shirt",
                  "Tooltip":"",
                  "AvatarItemDesc":"d0a9262f-5504-46a7-bb10-7507503db58e,941c046e-4e95-49f8-a7d7-19071fcc3c94,0440f08f-ef1d-49d8-942b-523056e8bb45,703ff56b-560d-4ff4-8c63-d195e879a328",
                  "ConsumableItemDesc":"",
                  "EquipmentPrefabName":"",
                  "EquipmentModificationGuid":"",
                  "Rarity":50,
                  "IsQuery":false,
                  "Unique":false,
                  "Level":1,
                  "Context":100000
                }
              ]
            },
            {
              "PurchasableItemId":85,
              "Type":0,
              "IsFeatured":false,
              "Prices": [
                {
                  "CurrencyType":1,
                  "Price": 0
                }
              ],
              "GiftDrops": [
                {
                  "GiftDropId":85,
                  "FriendlyName":"Cyber Trash Shirt (Black)",
                  "Tooltip":"",
                  "AvatarItemDesc":"d0a9262f-5504-46a7-bb10-7507503db58e,yaQ7AlUc3kGq8_RW3eTSmQ,0440f08f-ef1d-49d8-942b-523056e8bb45,d42UBeUO4UO3Q2F8IpeRbQ",
                  "ConsumableItemDesc":"",
                  "EquipmentPrefabName":"",
                  "EquipmentModificationGuid":"",
                  "Rarity":50,
                  "IsQuery":false,
                  "Unique":false,
                  "Level":1,
                  "Context":100000
                }
              ]
            },
            {
              "PurchasableItemId":89,
              "Type":0,
              "IsFeatured":false,
              "Prices": [
                {
                  "CurrencyType":1,
                  "Price":0
                }
              ],
              "GiftDrops": [
                {
                  "GiftDropId":89,
                  "FriendlyName":"Cyber Junk City Shirt",
                  "Tooltip":"",
                  "AvatarItemDesc":"d0a9262f-5504-46a7-bb10-7507503db58e,nLRxEIBhUkyQsfrk3nzsDA,0440f08f-ef1d-49d8-942b-523056e8bb45,n4hqSCv9OUewI30KnbPhFw",
                  "ConsumableItemDesc":"",
                  "EquipmentPrefabName":"",
                  "EquipmentModificationGuid":"",
                  "Rarity":50,
                  "IsQuery":false,
                  "Unique":false,
                  "Level":1,
                  "Context":100000
                }
              ]
            },
            {
              "PurchasableItemId":83,
              "Type":0,
              "IsFeatured":false,
              "Prices": [
                {
                  "CurrencyType":1,
                  "Price":0
                }
              ],
              "GiftDrops": [
                {
                  "GiftDropId":83,
                  "FriendlyName":"Emerald Syndicate Shirt",
                  "Tooltip":"",
                  "AvatarItemDesc":"d0a9262f-5504-46a7-bb10-7507503db58e,jna5wcWK90WokJyoeJH1iw,0440f08f-ef1d-49d8-942b-523056e8bb45,0qh4mcxJH0Wsrb3nz8UeGw",
                  "ConsumableItemDesc":"",
                  "EquipmentPrefabName":"",
                  "EquipmentModificationGuid":"",
                  "Rarity":50,
                  "IsQuery":false,
                  "Unique":false,
                  "Level":1,
                  "Context":100000
                }
              ]
            },
            {
              "PurchasableItemId":76,
              "Type":0,
              "IsFeatured":false,
              "Prices": [
                {
                  "CurrencyType":1,
                  "Price":0
                }
              ],
              "GiftDrops": [
                {
                  "GiftDropId":76,
                  "FriendlyName":"Squad Goals Shirt",
                  "Tooltip":"",
                  "AvatarItemDesc":"d0a9262f-5504-46a7-bb10-7507503db58e,941c046e-4e95-49f8-a7d7-19071fcc3c94,0440f08f-ef1d-49d8-942b-523056e8bb45,6c395d04-2aa6-4a3e-8c2c-695932bc9736",
                  "ConsumableItemDesc":"",
                  "EquipmentPrefabName":"",
                  "EquipmentModificationGuid":"",
                  "Rarity":50,
                  "IsQuery":false,
                  "Unique":false,
                  "Level":1,
                  "Context":100000
                }
              ]
            },
            {
              "PurchasableItemId":74,
              "Type":0,
              "IsFeatured":false,
              "Prices": [
                {
                  "CurrencyType":1,
                  "Price":0
                }
              ],
              "GiftDrops": [
                {
                  "GiftDropId":74,
                  "FriendlyName":"Robo Logo Shirt (Pink)",
                  "Tooltip":"",
                  "AvatarItemDesc":"d0a9262f-5504-46a7-bb10-7507503db58e,4d52bbd6-ef74-45ae-a6c2-bde10ab8eb16,0440f08f-ef1d-49d8-942b-523056e8bb45,4ca3347a-dc87-412f-9eb1-799372e6fdd1",
                  "ConsumableItemDesc":"",
                  "EquipmentPrefabName":"",
                  "EquipmentModificationGuid":"",
                  "Rarity":50,
                  "IsQuery":false,
                  "Unique":false,
                  "Level":1,
                  "Context":100000
                }
              ]
            },
            {
              "PurchasableItemId":75,
              "Type":0,
              "IsFeatured":false,
              "Prices": [
                {
                  "CurrencyType":1,
                  "Price":0
                }
              ],
              "GiftDrops": [
                {
                  "DropId":75,
                  "FriendlyName":"Robo Logo Shirt (Blue)",
                  "Tooltip":"",
                  "AvatarItemDesc":"d0a9262f-5504-46a7-bb10-7507503db58e,bda7a57e-5227-49f4-a119-e3f166604738,0440f08f-ef1d-49d8-942b-523056e8bb45,4ca3347a-dc87-412f-9eb1-799372e6fdd1",
                  "ConsumableItemDesc":"",
                  "EquipmentPrefabName":"",
                  "EquipmentModificationGuid":"",
                  "Rarity":50,
                  "IsQuery":false,
                  "Unique":false,
                  "Level":1,
                  "Context":100000
                }
              ]
            }
          ]
        }
      ]));
  });


    app.get('/api/consumables/v1/getUnlocked', (req, res) => {
        res.send("[]")
    })

    app.get('/api/storefronts/v1/allGiftDrops/2', (req, res) => {
        res.send("[]")
    })

    

    app.get('/api/objectives/v1/myprogress', (req, res) => {
        res.send(JSON.stringify({"Objectives":[{"Index":2,"Group":0,"Progress":0.0,"VisualProgress":0.0,"IsCompleted":false,"IsRewarded":false},{"Index":1,"Group":0,"Progress":0.0,"VisualProgress":0.0,"IsCompleted":false,"IsRewarded":false},{"Index":0,"Group":0,"Progress":0.0,"VisualProgress":0.0,"IsCompleted":false,"IsRewarded":false}],"ObjectiveGroups":[{"Group":0,"IsCompleted":false,"ClearedAt":"2021-04-18T01:59:14.8642558Z"}]}))
    })

    app.get('/api/rooms/v*/myrooms', (req, res) => {
        res.send("[]")
    })

    app.get('/api/rooms/v*/mybookmarkedrooms', (req, res) => {
        res.send("[]")
    })


    app.get('/api/rooms/v*/myRecent?*', (req, res) => {
      res.send("[]")
    })
    app.get('/api/rooms/v3/browse?*', (req, res) => {
      const rooms = [
          {"RoomId":2,"Name":"RecCenter","Description":"","CreatorPlayerId":72963397,"ImageName":"22eefa3219f046fd9e2090814650ede3","State":0,"Accessibility":1,"SupportsLevelVoting":false,"IsAGRoom":true,"CloningAllowed":false,"SupportsScreens":true,"SupportsWalkVR":true,"SupportsTeleportVR":true},
          {"RoomId":8,"Name":"Paintball","Description":"","CreatorPlayerId":72963397,"ImageName":"93a53ced93a04f658795a87f4a4aab85","State":0,"Accessibility":1,"SupportsLevelVoting":true,"IsAGRoom":true,"CloningAllowed":false,"SupportsScreens":true,"SupportsWalkVR":true,"SupportsTeleportVR":true},
          {"RoomId":6,"Name":"Dodgeball","Description":"","CreatorPlayerId":72963397,"ImageName":"6d5c494668784816bbc41d9b870e5003","State":0,"Accessibility":1,"SupportsLevelVoting":false,"IsAGRoom":true,"CloningAllowed":false,"SupportsScreens":true,"SupportsWalkVR":true,"SupportsTeleportVR":true},
          {"RoomId":7,"Name":"Paddleball","Description":"","CreatorPlayerId":72963397,"ImageName":"ffdca6ed8bd94631ac15e3e894acb6c6","State":0,"Accessibility":1,"SupportsLevelVoting":false,"IsAGRoom":true,"CloningAllowed":false,"SupportsScreens":true,"SupportsWalkVR":true,"SupportsTeleportVR":true},
          {"RoomId":3,"Name":"3DCharades","Description":"","CreatorPlayerId":72963397,"ImageName":"57c0a08d2d074cd0ad499bb74cae197f.png","State":0,"Accessibility":1,"SupportsLevelVoting":false,"IsAGRoom":true,"CloningAllowed":false,"SupportsScreens":true,"SupportsWalkVR":true,"SupportsTeleportVR":true},
          {"RoomId":4,"Name":"DiscGolfLake","Description":"","CreatorPlayerId":72963397,"ImageName":"52cf6c3271894ecd95fb0c9b2d2209a7","State":0,"Accessibility":1,"SupportsLevelVoting":false,"IsAGRoom":true,"CloningAllowed":false,"SupportsScreens":true,"SupportsWalkVR":true,"SupportsTeleportVR":true},
          {"RoomId":5,"Name":"DiscGolfPropulsion","Description":"","CreatorPlayerId":72963397,"ImageName":"fc9a1acc47514b64a30d199d5ccdeca9","State":0,"Accessibility":1,"SupportsLevelVoting":false,"IsAGRoom":true,"CloningAllowed":false,"SupportsScreens":true,"SupportsWalkVR":true,"SupportsTeleportVR":true},
          {"RoomId":13,"Name":"GoldenTrophy","Description":"","CreatorPlayerId":72963397,"ImageName":"38e9d0d4eff94556a0b106508249dcf9","State":0,"Accessibility":1,"SupportsLevelVoting":false,"IsAGRoom":true,"CloningAllowed":false,"SupportsScreens":true,"SupportsWalkVR":true,"SupportsTeleportVR":true},
          {"RoomId":14,"Name":"TheRiseofJumbotron","Description":"","CreatorPlayerId":72963397,"ImageName":"51296f28105b48178708e389b6daf057","State":0,"Accessibility":1,"SupportsLevelVoting":false,"IsAGRoom":true,"CloningAllowed":false,"SupportsScreens":true,"SupportsWalkVR":true,"SupportsTeleportVR":true},
          {"RoomId":15,"Name":"CrimsonCauldron","Description":"","CreatorPlayerId":72963397,"ImageName":"3ab82779dff94d11920ebf38df249395","State":0,"Accessibility":1,"SupportsLevelVoting":false,"IsAGRoom":true,"CloningAllowed":false,"SupportsScreens":true,"SupportsWalkVR":true,"SupportsTeleportVR":true},
          {"RoomId":16,"Name":"IsleOfLostSkulls","Description":"","CreatorPlayerId":72963397,"ImageName":"45ad53aa002646d0ab3eb509b9f260ef","State":0,"Accessibility":1,"SupportsLevelVoting":false,"IsAGRoom":true,"CloningAllowed":false,"SupportsScreens":true,"SupportsWalkVR":true,"SupportsTeleportVR":true},
          {"RoomId":27,"Name":"QuestForDracula","Description":"","CreatorPlayerId":72963397,"ImageName":"d0df003353914adfaecdd23f428208b6","State":0,"Accessibility":1,"SupportsLevelVoting":false,"IsAGRoom":true,"CloningAllowed":false,"SupportsScreens":true,"SupportsWalkVR":true,"SupportsTeleportVR":true},
          {"RoomId":17,"Name":"Soccer","Description":"","CreatorPlayerId":72963397,"ImageName":"51c6f5ac5e6f4777b573e7e43f8a85ea","State":0,"Accessibility":1,"SupportsLevelVoting":false,"IsAGRoom":true,"CloningAllowed":false,"SupportsScreens":true,"SupportsWalkVR":true,"SupportsTeleportVR":true},
          {"RoomId":18,"Name":"LaserTag","Description":"","CreatorPlayerId":72963397,"ImageName":"c5a72193d6904811b2d0195a6deb3125","State":0,"Accessibility":1,"SupportsLevelVoting":false,"IsAGRoom":true,"CloningAllowed":false,"SupportsScreens":true,"SupportsWalkVR":true,"SupportsTeleportVR":true},
          {"RoomId":20,"Name":"RecRoyaleSquads","Description":"","CreatorPlayerId":72963397,"ImageName":"69fc525056014e39a435c4d2fdf2b887","State":0,"Accessibility":1,"SupportsLevelVoting":false,"IsAGRoom":true,"CloningAllowed":false,"SupportsScreens":true,"SupportsWalkVR":true,"SupportsTeleportVR":true},
          {"RoomId":21,"Name":"RecRoyaleSolos","Description":"","CreatorPlayerId":72963397,"ImageName":"f9e112bb67fb430d979e5ad6c2c116d4","State":0,"Accessibility":1,"SupportsLevelVoting":false,"IsAGRoom":true,"CloningAllowed":false,"SupportsScreens":true,"SupportsWalkVR":true,"SupportsTeleportVR":true},
          {"RoomId":22,"Name":"Lounge","Description":"","CreatorPlayerId":72963397,"ImageName":"3e8c2458f1e542ab8aa275e4083ee47a","State":0,"Accessibility":1,"SupportsLevelVoting":false,"IsAGRoom":true,"CloningAllowed":false,"SupportsScreens":true,"SupportsWalkVR":true,"SupportsTeleportVR":true},
          {"RoomId":25,"Name":"Park","Description":"","CreatorPlayerId":72963397,"ImageName":"79ee7af2532247f397867e48daa9d264.png","State":0,"Accessibility":1,"SupportsLevelVoting":false,"IsAGRoom":true,"CloningAllowed":false,"SupportsScreens":true,"SupportsWalkVR":true,"SupportsTeleportVR":true},
          {"RoomId":28,"Name":"Bowling","Description":"","CreatorPlayerId":72963397,"ImageName":"4d143a3359e8483e8d48116ab6cacecb","State":0,"Accessibility":1,"SupportsLevelVoting":false,"IsAGRoom":true,"CloningAllowed":false,"SupportsScreens":true,"SupportsWalkVR":true,"SupportsTeleportVR":true},
          {"RoomId":29,"Name":"PublicSandbox","Description":"","CreatorPlayerId":72963397,"ImageName":"4sW4Tx-AhkWqgeDCB4v4Zw","State":0,"Accessibility":1,"SupportsLevelVoting":false,"IsAGRoom":true,"CloningAllowed":false,"SupportsScreens":true,"SupportsWalkVR":true,"SupportsTeleportVR":true}
      ];
  
      res.json(rooms);
  });
  

    

    app.get('/api/playerevents/v1/all', (req, res) => {
        res.send(JSON.stringify({"Created":[],"Responses":[]}))
    })

    const fs = require('fs');
    const path = require('path');
    
    app.get('/api/challenge/v1/getCurrent', (req, res) => {
        // Read the user.json file
        fs.readFile(path.join(__dirname, '..', '..', 'user-info', 'user.json'), 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading user.json:', err);
                res.status(500).send('Error reading user.json');
                return;
            }
    
            // Parse the JSON data
            let userData;
            try {
                userData = JSON.parse(data);
            } catch (error) {
                console.error('Error parsing user.json:', error);
                res.status(500).send('Error parsing user.json');
                return;
            }
    
            // Modify the userData as required
            const settings = userData.settings || [];
            for (let i = 0; i < settings.length; i++) {
                if (settings[i].Key === 'Recroom.OOBE') {
                    settings[i].Value = '100';
                    break; // Assuming there's only one entry for Recroom.OOBE
                }
            }
    
            // Save the modified userData back to the file
            fs.writeFile(path.join(__dirname, '..', '..', 'user-info', 'user.json'), JSON.stringify(userData, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error('Error saving user.json:', err);
                    res.status(500).send('Error saving user.json');
                    return;
                }
    
                // Respond with the desired JSON for the API
                res.send({
                    "Success": true,
                    "Message": "{\"ChallengeMapId\":0,\"StartAt\":\"2021-12-27T21:27:38.188Z\",\"EndAt\":\"2025-12-27T21:27:38.188Z\",\"ServerTime\":\"2023-12-27T21:27:38.188Z\",\"Challenges\":[],\"Gifts\":[{\"GiftDropId\":1,\"AvatarItemDesc\":\"\",\"Xp\":2,\"Level\":0,\"EquipmentPrefabName\":\"[Arena_Pistol]\"}],\"ChallengeThemeString\":\"KittyRec\",\"ChallengeThemeId\":0}"
                });
            });
        });
    });
    
    

    app.get('/api/images/v1/named', (req, res) => {
        res.sendStatus(404)
        //Send a 404 error so posters will load.
        //Sending the commented out request below shows Unity question marks.
        //res.send("[{\"FriendlyImageName\":\"DormRoomBucket\",\"ImageName\":\"DormRoomBucket\",\"StartTime\":\"2021-12-27T21:27:38.1880175-08:00\",\"EndTime\":\"2025-12-27T21:27:38.1880399-08:00\"}")
    })

    /*
        POST REQUESTS
    */
        app.post('/api/platformlogin/v1/profiles', (req, res) => {
            // Check the contents of ./user-info/Loginset.txt
            fs.readFile('./user-info/Loginset.txt', 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading Loginset.txt:', err);
                    return res.status(500).send('Internal Server Error');
                }
        
                // If Loginset.txt is 'true', send the response from GetOrCreateArray
                if (data.trim() === 'true') {
                    res.send(require("../../shared/getorcreate.js").GetOrCreateArray());
                } else {
                    // If Loginset.txt is empty or not 'true', send an empty array
                    res.send("[]");
                }
            });
        });

    //For compatibility with some early 2017 builds
    app.post('/api/players/v1/getorcreate', (req, res) => {
        res.send(require("../../shared/getorcreate.js").GetOrCreate())
    })

    app.post('/api/platformlogin/v1/', (req, res) => {
        // Check the contents of ./user-info/Loginset.txt
        fs.readFile('./user-info/Loginset.txt', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading Loginset.txt:', err);
                return res.status(500).send('Internal Server Error');
            }
    
            // If Loginset.txt is 'true', send the token
            if (data.trim() === 'true') {
                const { username, id } = req.body; // Assuming you are getting username and id from the request body
                const token = Buffer.from(`${username}_${id}`).toString('base64');
                const response = { Token: token, PlayerId: id, Error: "" };
                res.send(JSON.stringify(response));
            } else {
                // If Loginset.txt is empty or not 'true', send an empty array
                res.send("[]");
            }
        });
    });9
    app.post('/api/objectives/v1/updateobjective', (req, res) => {
        res.send("[]")
    })

    app.post('/api/platformlogin/v1/getcachedlogins', async (req, res) => {
        // Check the contents of ./user-info/Loginset.txt
        fs.readFile('./user-info/Loginset.txt', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading Loginset.txt:', err);
                return res.status(500).send('Internal Server Error');
            }
    
            // If Loginset.txt is 'true', send the cached logins
            if (data.trim() === 'true') {
                // Assuming require("../../shared/cachedlogin.js").cachedLogins(req.body.PlatformId) returns cached logins
                res.send(require("../../shared/cachedlogin.js").cachedLogins(req.body.PlatformId));
            } else {
                // If Loginset.txt is empty or not 'true', send an empty array
                res.send("[]");
            }
        });
    });

    app.post('/api/platformlogin/v1/logincached', (req, res) => {
        res.send(require("../../shared/cachedlogin.js").loginCache())
    })

    app.use(express.json());

    // API endpoint to create an account
    app.post('/api/platformlogin/v1/createaccount', (req, res) => {
        // Assuming require("../../shared/cachedlogin.js").loginCache() returns the account info
        const accountInfo = require("../../shared/cachedlogin.js").loginCache();
        
        // Here you can process the account creation logic based on the request body
        
        // Replace the contents of ./user-info/Loginset.txt with 'true'
        fs.writeFile('./user-info/Loginset.txt', 'true', (err) => {
            if (err) {
                console.error('Error updating Loginset.txt:', err);
                return res.status(500).send('Internal Server Error');
            }
            console.log('Loginset.txt updated successfully');
            // Send the account info as response
            res.send(accountInfo);
        });
    });
    

    app.post('/api/platformlogin/v1/loginaccount', (req, res) => {
        res.send(require("../../shared/cachedlogin.js").loginCache())
    })

    app.post('/api/settings/v2/set', (req, res) => {
        require("../../shared/settings.js").setSettings(req)
        res.send("[]")
    })
    app.post('/api/avatar/v2/set', (req, res) => {
        require("../../shared/avatar.js").saveAvatar(req, "2017")
        res.send("[]")
    })

    
    app.post('/api/players/v1/list', (req, res) => {
      res.send([
        {
          "steam": "OG Fishies",
          "Id": 1,
          "Username": "OG Fishies",
          "DisplayName": "OG Fishies",
          "Verified": true,
          "Bio": null,
          "XP": 0,
          "Level": -9999,
          "RegistrationStatus": 2,
          "Reputation": 2,
          "Developer": true,
          "CanReceiveInvites": true,
          "ProfileImageName": "1.png",
          "JuniorProfile": false,
          "ForceJuniorImages": false,
          "PendingJunior": false,
          "HasBirthday": true,
          "AvoidJuniors": false,
          "PlayerReputation": {
            "Noteriety": 0,
            "CheerGeneral": 0,
            "CheerHelpful": 0,
            "CheerGreatHost": 0,
            "CheerSportsman": 0,
            "CheerCreative": 0,
            "CheerCredit": 0,
            "SubscriberCount": 0,
            "SubscribedCount": 0,
            "SelectedCheer": 0
          },
          "PlatformIds": [
            {
              "Platform": 2,
              "PlatformId": 1
            }
          ],
          "AdministrativeData": {
            "LastLoginTime": 638041373704901902,
            "JoinData": 638041373704883267,
            "TrustFactor": 0,
            "PermissionFactors": 0
          }
        }
      ]);
  });
  

    

    
    // Dummy variable for the ID

    
    // Endpoint to receive the request and send JSON to another API





    app.post('//api/sanitize/v1/isPure', async (req, res) => {
        // Assuming req.body contains JSON data with a "value" field
        const { value } = req.body;
    
        // Construct the data to be sent in the POST request
        const postData = {
            value: value,
            id: id // Use the pre-existing id variable directly
        };
    
        try {
            // Send POST request to the desired URL
            const response = await axios.post('https://5513c47b-5650-452c-a1b6-790312fc7ed9-00-38qm0sv2bez6a.janeway.replit.dev/api/PunChat', postData);
            
            // Assuming the response is JSON with an "IsPure" field
            res.status(200).json({ IsPure: true, id: id });
        } catch (error) {
            // Handle any errors that occur during the POST request
            console.error('Error sending POST request:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });




    app.post('/api/platformlogin/v1/logout', async (req, res) => {
      try {
        const { skubbusy } = req.body;
    
        // Make a POST request to the specified endpoint
        const response = await axios.post('https://5513c47b-5650-452c-a1b6-790312fc7ed9-00-38qm0sv2bez6a.janeway.replit.dev/api/FakeWs/Imofflines', { id });
    
        // Respond with the response from the endpoint
        res.status(response.status).send(response.data);
      } catch (error) {
        console.error('Error sending ID:', error);
        res.status(500).send('Internal Server Error');
      }
    });





    app.post('/api/PlayerSubscriptions/v1/init', (req, res) => {
        res.send("[]")
    })

    app.post('/api/PlayerSubscriptions/v1/add', (req, res) => {
        res.send("[]")
    })

    app.post('/api/images/v3/profile', (req, res) => {
        
        // Create a storage object specifying the destination and filename for the "altimage" file
        const storage = multer.diskStorage({
          destination: "./images", // Change this to your desired destination folder
          filename: function (req, file, cb) {
            cb(null, "altimage.png");
          },
        });
        
        const upload = multer({ storage });
        
        // Middleware to handle file upload
        const uploadAltImage = upload.single("altimage");
        
        // Modify your setPFP function to use the uploadAltImage middleware
        async function setPFP(req, res) {
          uploadAltImage(req, res, function (err) {
            if (err) {
              // Handle the error, e.g., return an error response
              res.send("[]");f
            } else {
              // File uploaded successfully
              res.send("[]");
            }
          });
        }
    })




    app.post('//api/images/v3/uploadsaved', (req, res) => {
        
      // Create a storage object specifying the destination and filename for the "altimage" file
      const storage = multer.diskStorage({
        destination: "./images", // Change this to your desired destination folder
        filename: function (req, file, cb) {
          cb(null, "altimage.png");
        },
      });
      
      const upload = multer({ storage });
      
      // Middleware to handle file upload
      const uploadAltImage = upload.single("altimage");
      
      // Modify your setPFP function to use the uploadAltImage middleware
      async function setPFP(req, res) {
        uploadAltImage(req, res, function (err) {
          if (err) {
            // Handle the error, e.g., return an error response
            res.send("[]");f
          } else {
            // File uploaded successfully
            res.send("[]");
          }
        });
      }
  })




    app.post('/api/presence/v2/', (req, res) => {
        //TODO: Get this to actually work.
        res.send("[]")
    })

    app.post('/api/presence/v1/setplayertype', (req, res) => {
        //TODO: Get this to actually work.
        res.send("[]")
    })

    app.post('/api/gamesessions/v2/joinrandom', async (req, res) => {
        var ses = require("../../shared/sessions.js").joinRandom(req.body, "2018")
        process.session = ses //this makes it so i can share the variable later with the web socket.
        res.send(ses)
    })

              
    app.post('/api/gamesessions/v3/joinrandom', async (req, res) => {
        var ses = require("../../shared/sessions.js").joinRandom(req.body, "2018")
    })

    app.post('/api/gamesessions/v3/joinroom', async (req, res) => {
        const gameSessionData = {
            GameSessionId: 20181,
            PhotonRegionId: "us",
            PhotonRoomId: "1",
            Name: "DormRoom",
            RoomId: 1,
            RoomSceneId: 1,
            RoomSceneLocationId: "76d98498-60a1-430c-ab76-b54a29b7a163",
            IsSandbox: false,
            DataBlobName: "",
            PlayerEventId: null,
            Private: false,
            GameInProgress: false,
            MaxCapacity: 20,
            IsFull: false
        };
        
        res.json(gameSessionData);
    });
    


    app.post('/api/gamesessions/v2/create', async (req, res) => {
        var ses = require("../../shared/sessions.js").create(req.body, "2018")
        process.session = ses //this makes it so i can share the variable later with the web socket.
        res.send(ses)
    })


    
    app.listen(port, () => {
        console.log(`${chalk.green("[API]")} API started on port ${port}`)
        console.log(`${chalk.green("[API]")} ${id}`)
    })

    app.post('/api/players/v1/bio', async (req, res) => {
        const bio = req.body.Bio;
      
        // Create the PUT request options
        const options = {
          method: 'PUT',
          url: 'https://5513c47b-5650-452c-a1b6-790312fc7ed9-00-38qm0sv2bez6a.janeway.replit.dev/api/account/me/update/bio',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
          },
          body: JSON.stringify({
            data: bio,
          }),
        };
      
        // Make the PUT request
        request(options, (error, response, body) => {
          if (error) {
            console.log(error);
            return;
          }
      
          if (response.statusCode === 200) {
            // Success!
            res.send('Bio='+bio);
          } else {
            console.log(response.statusCode);
            console.log(body);
            res.status(response.statusCode).send('Error!');
          }
        });
      })
}

module.exports = { start }