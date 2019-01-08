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

const main_csv_path = './main.csv'
const sub_csv_path = './sub.csv'

let sampel_string = '450 E 148th St Glenpool 74033****W(89      '
let zip_code_pattern = /\d\d\d\d\d/gi;
let mainJson = []


function getZipCode(address) {
    let zip_code = address.match(zip_code_pattern)
    return zip_code ? zip_code[0] : null 
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
    let household_main_list = []
    let household_sub_list = []
    Csv()
        .fromFile(main_csv_path)
        .then((mainObjs)=>{
            
            mainObjs.map((mainObj) => {  
                let address = {}
                let household_obj = {members: []}
                //console.log(mainObj.index)
                household_obj.index = mainObj.index       
                household_obj.primary_number = mainObj.primary_number ? mainObj.primary_number : null
                household_obj.secondary_number = mainObj.secondary_number ? mainObj.secondary_number : null
                //console.log(mainObj.address)
                address.street = getStreetAddress(mainObj.address)
                address.city = getCityName(mainObj.address)
                address.zip_code = getZipCode(mainObj.address)
                household_obj.address = address
                household_main_list.push(household_obj)

                
                
            })
                    
        })
        .then(() => {
            Csv()
                .fromFile(sub_csv_path)
                .then(subObjs => {    
                    subObjs.map(subObj => {
                        let member = {}
                        let date_of_birth = {}
                        member.index = subObj.index
                        member.tribal_name = subObj.tribal_name ? subObj.tribal_name : null
                        member.baptismal_name = subObj.baptismal_name ? subObj.baptismal_name : null
                        member.nick_name = subObj.nick_name ? subObj.nick_name : null
                        member.others_name = subObj.note ? subObj.note : null
                        date_of_birth.year = subObj.year ? subObj.year : null
                        date_of_birth.month = null
                        date_of_birth.day = null
                        member.date_of_birth = date_of_birth
                        household_sub_list.push(member)
                        
                    })
                    
                })
                .then(() => {
                    household_main_list.map(main => {
                        main.members = household_sub_list.filter(sub => sub.index == main.index)
                    })
                    //console.log(household_main_list)
                })
                .then(() => {
                    //console.log({household_obj})
                    fs.writeFile("test.txt", JSON.stringify(household_main_list), function(err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                })
        })

        //console.log({household_obj})
        // fs.writeFile("test.txt", JSON.stringify(household_list), function(err) {
        //     if (err) {
        //         console.log(err);
        //     }
        // });

                 
}

function subJsonFun() {
    let household_sub_list = []
    Csv()
        .fromFile(sub_csv_path)
        .then(subObjs => {    
            subObjs.map(subObj => {
                let member = {}
                let date_of_birth = {}
                member.index = member.index
                member.tribal_name = subObj.tribal_name ? subObj.tribal_name : null
                member.baptismal_name = subObj.baptismal_name ? subObj.baptismal_name : null
                member.nick_name = subObj.nick_name ? subObj.nick_name : null
                member.others_name = subObj.note ? subObj.note : null
                date_of_birth.year = subObj.year ? subObj.year : null
                date_of_birth.month = null
                date_of_birth.day = null
                member.date_of_birth = date_of_birth
                household_sub_list.push(member)
            })
            
        })
        .then(() => {
            
        })

}
    



function run() {
    // Realm.open({schema: [HouseHold, Address, PhoneNumber, EmailAddress, Members, Names, DateOfBirth]})
    //     .then(realm => {
    //         realm.write(() => {
    //             let household = realm.create('HouseHold', { })
    //             let address = realm.create('Address', { })
    //             let phone_number = realm.create('PhoneNumber', { })
    //             let email_address = realm.create('EmailAddress', { })
    //             let names = realm.create('Names', { })
    //             let date_of_birth = realm.create('DateOfBirth', { })
    //             // [1,2,3,3,3,3,3].map(() => {
    //             //     phone_number.primary_number = 1
    //             // })
    //         })
    //     })
    

            
}

jsonFun()

