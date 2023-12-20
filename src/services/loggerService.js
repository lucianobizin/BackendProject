import winston from "winston";

export default class LoggerService {

    constructor(env){

        this.options = {

            levels: {
                fatal: 0,
                error: 1, 
                warning: 2,
                http: 3,
                info: 4,
            }

        }

        this.logger = this.createLogger(env);

    }

    createLogger = (env) => {

        switch(env){

            case "dev": {

                return winston.createLogger({

                    levels: this.options.levels,

                    transports: [

                        new winston.transports.Console({

                            level:"info"

                        })

                    ]

                })

            }

            case "prod": {

                return winston.createLogger({

                    levels: this.options.levels,

                    transports: [

                        new winston.transports.Console({

                            level:"http"

                        }),
                
                        new winston.transports.File({

                            levels: "error",

                            filename: "./errors.log" 

                        })

                    ]
                })

            }

            case "test": {

                return winston.createLogger({

                    levels: this.options.levels,

                    transports: [

                        new winston.transports.Console({

                            level:"http"   	// El desafío pedía info pero siguiendo al profe y modifiqué los niveles de logueo

                        }),
                
                        new winston.transports.File({

                            levels: "error",

                            filename: "./errors.log" 

                        })

                    ]
                })

            }

        }

    }


}