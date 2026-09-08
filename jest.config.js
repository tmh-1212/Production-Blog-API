
// module.exports = {

//     testEnvironment:"node",

//     setupFilesAfterEnv:[
//         "./tests/setup.js"
//     ]

// };



// //part 10 :
// module.exports = {
//     testEnvironment: "node",
//     setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
// };


//part 10 update:
module.exports = {

    testEnvironment: "node",

    setupFilesAfterEnv:[
        "<rootDir>/tests/setup.js"
    ],

    maxWorkers:1,

};