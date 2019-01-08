const Realm = require('realm')

Realm.open({path: './default.realm'})
    .then((realm) => {
        //const obj = realm.objects('HouseHold')
        realm.write(() => {
            // let names = realm.create('Names', { 
            //     tribal_name: 'Pau Cin',
            //     baptismal_name: 'Paul'
            // })
            // let address = realm.create('Address', {
            //     street: '2981 E 77th',
            //     city: 'Tulsa',
            //     zip_code: 74136,   
            // }, true)
            realm.create('Address', {
                'street': '35 st APK'
            })
        })
        const obj = realm.objects('Address')
        console.log({obj})
        realm.close()
        process.exit()
    })

