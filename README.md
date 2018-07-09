# Timezone App

#### Functionality of the app:
- This app allows user to be able to create an account and log in. 
- When logged in, a user can see, edit and delete timezone records he has entered.
- Three permission levels: regular user (CRUD own records), user manager (regular user + CRUD users), admin (user manager + CRUD other user records)
- Timezone record has a name, city (which can be retrieved via Google Place Autocomplete API), and the difference to GMT time (is automatically calculated using city or can be manually entered)
- When displayed, each entry has a current time
- Filter by timezone names
- REST API. All actions can be performed via the API (including authentication)
- The timezone difference to GMT is calculated automatically based on the city mentioned on the timezone record. 
- Uses Google API for finding city.


#### Setup:
1) Clone/Download app.
2) Have mongodb and node.js installed and open terminal in root of where downloaded and run: ```npm install```
3) Run ```mongod```
4) Run ```npm start```

#### Screenshots:
![Alt text](https://i.imgur.com/czJlSgs.png "City via Google API")


![Alt text](https://i.imgur.com/UeN1Tfc.png "GMT Difference calculated based on city selected")


![Alt text](https://i.imgur.com/2hfGTrU.png "List of records")

