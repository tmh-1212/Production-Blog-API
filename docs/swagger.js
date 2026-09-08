const swaggerJsDoc = require("swagger-jsdoc");


const options = {

    definition: {

        openapi: "3.0.0",

        info: {

            title: "Production Blog API",

            version: "1.0.0",

            description: "Professional Blog API Documentation"

        },


        servers: [

            {
                url: "http://localhost:5000"
            }

        ],


        components: {

            securitySchemes: {

                bearerAuth: {

                    type: "http",

                    scheme: "bearer",

                    bearerFormat: "JWT"

                }

            }

        }

    },


    apis: [

        "./routes/*.js"

    ]

};


const swaggerSpec = swaggerJsDoc(options);


module.exports = swaggerSpec;