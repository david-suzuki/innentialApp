// import bootcampData from './constants/_bootcamps.js'
// import fs from 'fs'

// const responses = [
//   {
//     "type": "webdev",
//     "resident": true,
//     "agentur": false,
//     "location": "Berlin",
//     "remote": "Onsite",
//     "english": true,
//     "format": "Part-time (4 hours/day)",
//     "startsAt": "October, 2020",
//     "name": "merle",
//   },
//   {
//     "type": "datascience",
//     "resident": true,
//     "agentur": false,
//     "location": "Berlin",
//     "remote": "No Preference",
//     "english": true,
//     "format": "Part-time (4 hours/day)",
//     "startsAt": "November, 2020",
//     "name": "Eleonora Cataldo",
//   },
//   {
//     "type": "dataanalyst, uxui",
//     "resident": true,
//     "agentur": false,
//     "location": "Berlin",
//     "remote": "No Preference",
//     "english": true,
//     "format": "Part-time (4 hours/day)",
//     "startsAt": "November, 2020",
//     "name": "Christian Ruhnau",
//   }
// ]

// const formatLookup = {
//   'Full-time (8 hours/day)': ['full-time', 'part-time'],
//   'Part-time (4 hours/day)': ['part-time']
// }

// const remoteLookup = {
//   'Onsite': false,
//   'Remote': true,
//   'No Preference': false
// }

// // const filterBootcampsForResult = criteria => {
// //   return bootcampData.filter(({
// //     startsAt,
// //     format,
// //     remote,
// //     locations,
// //     languages,
// //     type
// //   }) => {
// //     // const dateCheck = new Date(startsAt) > criteria.startsAt
// //     const formatCheck = format.split(', ').some(format => criteria.format.includes(format))
// //     const languageCheck = (!languages || languages.split(', ').some(language => criteria.language.includes(language)))
// //     const locationCheck = (locations.split(', ').includes(criteria.location) || Boolean(remote))
// //     const typeCheck = criteria.type.includes(type)

// //     return /*dateCheck &&*/ formatCheck && languageCheck && locationCheck && typeCheck
// //   })
// // }

// const sortBootcampsByBest = (bootcamps, criteria) => {
//   return bootcamps
//     .map(camp => {
//       let rating = 0

//       if(new Date(camp.startsAt) > criteria.startsAt)
//         rating += 1

//       if(camp.languages.split(', ').some(language => criteria.language.includes(language)))
//         rating++

//       if(criteria.type.includes(camp.type))
//         rating += 3

//       if(camp.format.split(', ').some(format => criteria.format.includes(format)))
//         rating++

//       if(camp.locations.split(', ').includes(criteria.location))
//         rating += 2

//       // const availableFinancing = camp.financing
//       //   .split(", ")
//       //   .filter(option => !criteria.unavailableFinancing.includes(option))

//       // rating += availableFinancing.length

//       rating += (camp.commission * 30)

//       return {
//         rating,
//         ...camp
//       }
//     })
//     .sort((a, b) => b.rating - a.rating)
//     .slice(0, 3)
//     .map(({ rating, ...item }) => item)
// }

// (() => {
//   responses.map(({
//     type,
//     resident,
//     agentur,
//     location,
//     remote,
//     english,
//     format,
//     startsAt,
//     name
//   }) => {

//     const criteria = { // THIS WILL BE PASSED TO THE FILTERING ALGORITHM
//       isGermanResident: resident,
//       isAgenturSigned: agentur,
//       startsAt: new Date(startsAt),
//       language: english ? ['en', 'de'] : ['de'],
//       format: formatLookup[format],
//       location: location,
//       remote: remoteLookup[remote] || false,
//       type: type.split(", "),
//       unavailableFinancing: [
//         ...(!resident && ['Income Share']),
//         ...(!agentur && ['Bildungsgutschein'])
//       ]
//     }

//     // const bootcamps = filterBootcampsForResult(criteria)

//     const bestBootcamps = sortBootcampsByBest(bootcampData, criteria)

//     fs.writeFile(`bootcamps-${name}`, JSON.stringify(bestBootcamps), () => { })
//   })
// })()
