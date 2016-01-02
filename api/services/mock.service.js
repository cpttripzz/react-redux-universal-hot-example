import userService from 'user.service'

export function load() {

  let genres, instruments, cities, countries;
  var assert = require('assert')
  var readFile = require("bluebird").promisify(require("fs").readFile)
  var _ = require('lodash')
  var Genre = require('mongoose').model('Genre');
  Genre.find({}).then((genres) => {
    if (!genres.length) {
      readFile(__dirname + '/../json/genres.json')
        .then((json) =>  JSON.parse(json))
        .then((json) => {
          Genre.create(json, function (err, g) {
            genres = g
          })
        })
    }
  })

  var Instrument = require('mongoose').model('Instrument');
  Instrument.find({}).then((instruments) => {
    if (!instruments.length) {
      readFile(__dirname + '/../json/instruments.json')
        .then((json) =>  JSON.parse(json))
        .then((json) => {
          Instrument.create(json, function (err, data) {
            instruments = data
          })
        })
    }
  })

  var Country = require('mongoose').model('Country');
  Country.find({}).then((countries) => {
    if (!countries.length) {
      readFile(__dirname + '/../json/countries.json')
        .then((json) =>  JSON.parse(json))
        .then((json) => {
          Country.create(json, function (err, data) {
            countries = data
          })
        })
    }
  })

  var City = require('mongoose').model('City');
    City.find({}).then((cities) => {
      if (!cities.length) {
        readFile(__dirname + '/../json/cities.json')
          .then((json) =>  JSON.parse(json))
          .then((json) => {
            let cities = _.uniq(json, function (item, key, a) {
              return item.name;
            })
            cities.forEach((city) => {
              let countryCode = city.country_code
              Country.findOne({code: countryCode}).lean().then((country) => {
                city.country = country._id
                delete city.country_code

                City.create(city, (err, data) => {
                  if (err) {
                    console.log(err)
                  }
                })
              })

            })
          })
      }
    })

  City.findOne({name:'Toronto'}).populate('country', 'name').exec((err,data) => { console.log(data)})
  var faker = require('faker');
  for (let x = 0; x < 100; x++) {

    newUser({name: faker.name.findName(), email: faker.internet.email(), password: '11111111'}).then((user) => {

      })
      .catch((err) => reject(err))
    //$user->setUsername($this->faker->userName);
    //$user->setEmail($this->faker->email);
    //$user->setPlainPassword('123456');
    //$user->setDateOfBirth($this->faker->dateTimeBetween($startDate = '-80 years', $endDate = '-20 years'));
    //$user->setFirstname($this->faker->firstName);
    //$user->setLastname($this->faker->lastName);
    //$gender = (rand(0, 1) == 1 ? 'm' : 'f');
    //$user->setGender($gender);
    //$user->setPhone('111-111-1111');
    //$user->addGroup($userGroup);
    //$user->setEnabled(true);
  }

}




