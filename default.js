
const Realm = require('realm')

// //class Address extends Realm.Object{ }
// const Address = {
//     name: 'Address',
//     properties: {
//         'street': {type: 'string?'},
//         'city': {type: 'string?'},
//         'state': {type: 'string', default: 'Oklahoma', optional: true},
//         'zip_code': {type: 'int', default: 100, optional: true},
//     }
// }

// // module.exports = new Realm({schema: [Address]})
Realm.open({path: './default.realm'})
    .then((realm) => {
        realm.write(() => {
            realm.create('Address', {
                'street': `I don't know where I live`
            })
        })
        let obj = realm.objects('Address')
        console.log({obj})
    })
