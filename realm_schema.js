const HouseHold = {
    name: 'HouseHold',
    properties: {
        id: 'int?',
        members: 'Members[]',
        address: 'Address?',
        phone_number: 'PhoneNumber?',
        email_address: 'EmailAddress?',
        date_addedd: {type: 'date?', default: new Date()},
        isFamily: 'bool?'

        
    }
    };
 
const Members = {
        name: 'Members',
        properties: {
            index: 'int?',
            memberID: 'string?',
            names: 'Names?',
            date_of_birth: 'DateOfBirth?',
            gender: 'string?'
        }
    };
const Address = {
    name: 'Address',
    properties: {
        'street': 'string?',
        'city': 'string?',
        'state': {type: 'string?', default: 'OK'},
        'zip_code': 'int?'
    }
}

const PhoneNumber = {
    name: 'PhoneNumber',
    properties: {
        'primary_number': {type: 'string?', default: '911'},
        'secondary_number': 'string?'
    }
}

const EmailAddress = {
    name: 'EmailAddress',
    properties: {
        'primary_email': 'string?',
        'secondary_email': 'string?'
    }
}

const DateOfBirth = {
    name: 'DateOfBirth',
    properties: {
        'year': 'int?',
        'month': 'int?',
        'date': 'int?'
    }
}

const Names = {
    name: 'Names',
    properties: {
        'tribal_name': 'string?',
        'baptismal_name': 'string?',
        'nick_name': 'string?',
        'others_name': 'string?'
    }
}

module.exports = {
    HouseHold,
    Members,
    Address,
    PhoneNumber,
    EmailAddress,
    DateOfBirth,
    Names,
}