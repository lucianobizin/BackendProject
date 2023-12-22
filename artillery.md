## Testing unitario con Mocha

### PRUEBAS UNITARIAS CON MOCHA y MONGOOSE

1. Importación de módulos

import mongoose from "mongoose";
import UsersDao from "../.."; 
import { strict as assert } from "assert";

*NOTA: La clase UsersDao trae los usuarios porque el ejemplo es un test unitario de usuarios.*

2. Conexión a la base de datos MongoDB

mongoose.connect("string connection");

3. Definición de pruebas unitarias con Mocha

describe("Tests unitarios para....", function(){
    this.timeout(10000);
    before(function(){
        this.usersDao = new UsersDao();
    });

    beforeEach(function(){
        mongoose.connection.collections.users.drop();
    });

    it("El dao debe devolver los usuarios en formato de arreglo", async function(){
        // Aquí irá la lógica de la prueba unitaria
    });
});

*NOTAS:* 

*- Se utiliza Mocha para definir una serie de pruebas unitarias.*
*- before se ejecuta antes de todas las pruebas y se utiliza para inicializar recursos, como la instancia de UsersDao.*
*- beforeEach se ejecuta antes de cada prueba y se utiliza para limpiar la colección "users" de la base de datos antes de cada prueba.*
*- it define una prueba unitaria específica.*

## Testing integral con Artillery

1. Pruebas de carga con Artillery

artillery quick --count 40 --num 50 "http://localhost:8080/simple" -o simple.json

*NOTAS:*

*- --count 40: Especifica el número de usuarios simultáneos.*
*- --num 50: Indica el número de solicitudes que cada usuario realizará.*
*- "http://localhost:8080/simple": Es la URL a la que se dirigirán las solicitudes.*
*- -o simple.json: Especifica el archivo de salida para los resultados.*

2. Ejecución de pruebas de carga con Artillery y generación de informes

artillery run config.yml -o sessionflow.json
artillery report sessionflow.json -o report.html

*NOTAS:*

*- artillery run config.yml: Ejecuta pruebas de carga basadas en la configuración proporcionada en config.yml.*
*- -o sessionflow.json: Guarda los resultados de las pruebas en un archivo JSON.*
*- artillery report sessionflow.json -o report.html: Genera un informe HTML basado en los resultados de las pruebas.*