const Realm = require('realm')
const Csv = require('csvtojson')
var fs = require('fs');
const {
    HouseHold,
    Address,
    PhoneNumber,
    EmailAddress,
    Members,
    Names,
    DateOfBirth
} = require('./realm_schema')


Realm.open({schema: [HouseHold, Address, PhoneNumber, EmailAddress, Members, Names, DateOfBirth]})
    .then((realm) => {
        realm.write(() => {
            
            realm.deleteAll()
          });

    })
    .then(() => {
        process.exit()
    })