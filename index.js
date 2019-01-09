const Realm = require('realm')
const Csv = require('csvtojson')
const fs = require('fs');
const gender = require('gender-detection');
const {
    HouseHold,
    Address,
    PhoneNumber,
    EmailAddress,
    Members,
    Names,
    DateOfBirth
} = require('./realm_schema')



const main_csv_path = './main.csv'
const sub_csv_path = './sub.csv'


// zip code pattern 
const zip_code_pattern = /74\d\d\d/gi;



function getZipCode(address) {
    let zip_code = address.match(zip_code_pattern)
    return zip_code ? parseInt(zip_code[0]) : null 
}

function getCityName(address) {
    let patterns = ['glenpool', 'tulsa', 'jenks', 'stillwater']
    let city_name
    patterns.map((pattern) => {
        let regexp = new RegExp(pattern, 'gi')
        if (regexp.test(address)) {
            city_name = address.match(regexp)
        }
    })
    return city_name ? city_name[0] : null
}

function getStreetAddress(address) {
    return address
            .replace(getCityName(address), '')
            .replace(getZipCode(address), '')
            .replace(/\s+$/, '')
            .replace(/[^0-9a-zA-Z ]/g, '')
    
}

function generateMemberID(index) {
    let label = 'TMSL'
    for (let i = 4; i >  index.toString().length ; i--) {
        label += '0'
    }
    return label + index
    
}

function jsonFun() {
    // let household_main_list = []
    // let household_sub_list = []

    // get the date from main csv turn into Realm Database.
    Csv()
        .fromFile(main_csv_path)
        .then((mainObjs)=>{
            
            mainObjs.map((mainObj) => {  
                Realm.open({schema: [HouseHold, Address, PhoneNumber, EmailAddress, Members, Names, DateOfBirth]})
                    .then(realm => {
                        
                        realm.write(() => {
                            let address = mainObj.address
                            let primary_number = mainObj.primary_number
                            let secondary_number = mainObj.primary_number
                            let household = realm.create('HouseHold', { members: []})
                            let address_obj = realm.create('Address', {
                                street: getStreetAddress(address),
                                city: getCityName(address),
                                zip_code: getZipCode(address)
                            })
                            let phone_obj = realm.create('PhoneNumber', {
                                primary_number,
                                secondary_number,
                            })
                            let email_obj = realm.create('EmailAddress', { })
                            household.id = parseInt(mainObj.index)
                            household.address = address_obj
                            household.phone_number = phone_obj
                            household.email_address = email_obj

                        })
                        
                    })
                       
            })
                    
        })
        .then(() => {
            Csv()
                .fromFile(sub_csv_path)
                .then(members => {    
                    members.map((member, counter) => {
                        Realm.open({schema: [HouseHold, Address, PhoneNumber, EmailAddress, Members, Names, DateOfBirth]})
                            .then(realm => {
                                let tribal_name = member.tribal_name
                                let baptismal_name = member.baptismal_name
                                let nick_name = member.nick_name
                                let others_name = member.note
                                let year = member.year ? parseInt(member.year) : null
                                let gender_status = gender.detect(member.baptismal_name)
                                realm.write(() => {
                                    
                                    let householdID = realm.objects('HouseHold').filtered(`id == ${parseInt(member.index)}`)
                                    let member_obj = realm.create('Members', { })
                                    let names = realm.create('Names', {
                                        tribal_name,
                                        baptismal_name,
                                        nick_name,
                                        others_name
                                    })
                                    let date_of_birth = realm.create('DateOfBirth', { 
                                        year
                                    })
                                    member_obj.gender = gender_status
                                    member_obj.date_of_birth = date_of_birth
                                    member_obj.names = names
                                    member_obj.memberID = generateMemberID(counter)
                                    //console.log({counter})
                                    member_obj.index = parseInt(member.index)
                                    householdID[0].members.push(member_obj)
                                    //if (householdID.length)
                                    if (householdID[0].members.length > 1) {
                                        householdID[0].isFamily = true
                                    } else {
                                        householdID[0].isFamily = false
                                    }
                                    

                                    
                                })
                                
                            })
                            .then((realm) => {
                                //console.log({realm})
                                process.exit()
                            })
                })                
            })
            .then(() => {
                //process.exit()
            })
            
            
                
        })   
          
}

    



jsonFun()

