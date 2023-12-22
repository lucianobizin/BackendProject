## Contenerización con Docker

### CONTENEDORES 

#### ¿Qué son? 

Los contenedores son entornos o unidades de software estandarizadas e isoladas (aisladas) en las que se puede crear, probar, e implementar aplicativos con todas las configuraciones necesarias para su ejecución.

Esta tecnología a diferencia de las máquinas virtuales, en las que se les debe instalar un sistema operativo, se ejecutan utilizando los elementos básicos del kernel del sistema operativo sobre el que fue creado el contenedor.

De esta forma, los contenedores adquieren lo mejor del mundo de las máquinas virtuales (aislamiento y conexión controlada mediante un puerto) y lo mejor de la programación tradicional en los que las aplicaciones se creaban sobre la base de un mismo sistema operativo aprovechando su kernel sin la necesidad de tener que instalar un sistema operativo por aplicación.

### DOCKER

#### ¿Qué es?

Es una plataforma gestora de contenedores que permite empaquetar aplicativos que correrán sobre el kernel del sistema operativo de origen.

#### ¿Proceso de contenerización?

El proceso de contenerización con Docker consiste básicamente en 3 pasos:

* Paso 1: Construcción del dockerfile

Se debe crear un archivo dockerfile en el proyecto, el cual contendrá las instrucciones necesarias para que docker pueda generar la imagen (blueprint) del aplicativo a contenerizar.

- Código de ejemplo

FROM node

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

ENV PERSISTENCE=MONGO
ENV MODE=dev

CMD ["node", "src/app.js", "--persistence", "${PERSISTENCE}", "--mode", "${MODE}"]

- Explicación del ejemplo

---> Primer paso: 

Crear el archivo dockerignore para evitar una doble instalación de node_modules (una vez creado el archivo colocar "node_modules" -sin comillas-).

---> Segundo paso:

*NOTA: los nombres de los archivos y parámetros van sin comillas, solo se escribieron con comillas para diferenciar expresiones en el texto*

FROM node: indica la imagen base a partir de la cual se construirá la imagen (puede ser node, node:alpine, etc.).
WORKDIR /app: determina dónde vivirá el proyecto (una suerte de carpeta dentro del entorno aislado).
COPY package*.json ./: establece que los archivos que tengan en su nombre "package.json" se guardarán en el directorio raíz.
RUN npm install: automatiza le ejecución del comando "npm install" a fin de instalar la carpeta node_modules.
COPY . .: indica que se copiará todo lo que está al nivel del dockerfile (directorio raíz) se guardará al nivel del WORKDIR /app.
EXPOSE 8080: define el puerto de comunicación del contenedor para conectarse con otros entornos (en este caso el puerto 8080).
CMD ["node", "src/app.js"]: ejecuta el comando "node" y se define los parámetros que se le deben pasar (en este caso "src/app.js").

![Alt text](image.png)

* Paso 2: Contrucción de un contenedor

Construye un contenedor a partir de la carpeta en la que se está ejecutando el comando (.) y se pone un tag (-t), nombre de usuario y versión. 

En la consola escribir: docker build . -t usuario/ejemplodocker:version (ej. docker build . -t luchobizin/ejemplodocker:1.0.0)

* Paso 3: Carga de un contenedor

En la consola escribir: docker run -p 8080:8080 usuario/nombredelcontenedor:version (ej. docker run -p 8080:8080 luchobizin/backendprojectcoder:1.0.0)

*NOTA: el primer 8080 se refiere al puerto en el sistema host, y el segundo 8080 al puerto dentro del contenedor Docker. El 8080 (en el sistema host), es el puerto de la máquina host (donde se está ejecutando Docker). Este se debe mapear al puerto del contenedor. El segundo puerto 8080 es el del contenedor Docker. Este es el puerto en el contenedor Docker en sí mismo. La app dentro del contenedor debe estar escuchando en ese puerto para que se pueda acceder a ella desde el sistema host a través del puerto mapeado.* 

* Comando útiles:

- Lista imágenes activas: docker image ls
- Lista contenedores activos: docker container ls
- Exporta un contenedor a un archivo tar: docker export contenedorfeliz -o contenedor.tar
- Detiene un contenedor por nombre-imagen y versión: docker ps -a | grep luchobizin/backendserverdocker:1.0.0 | awk '{print $1}' | xargs docker stop
- Elimina una imagen por nombre y versión: docker rmi luchobizin/dockerbackendproject:1.0.0
- Detiene un contenedor por su ID: docker stop 538d23235f91
- Elimina un contenedor por su ID o nombre: docker rm ID_o_nombre_del_contenedor
- Intenta eliminar una imagen nuevamente: docker rmi luchobizin/backendserverdocker:1.0.0

* Diferencias entre docker run y docker-compose up:

- docker run:

Uso: Este comando se utiliza para ejecutar un contenedor a partir de una imagen específica.
Ejecución de un solo contenedor: Generalmente se usa para iniciar un solo contenedor.
Sintaxis básica: docker run [opciones] imagen [comando] [argumentos].
Ejemplo: docker run -p 8080:8080 luchobizin/backendprojectcoder:1.0.0.
Observaciones: Puede ser usado sin un archivo de configuración adicional, y es ideal para casos simples o cuando se necesita un control directo y específico sobre el contenedor.

- docker-compose up -d:
Uso: Este comando se utiliza para ejecutar aplicaciones definidas en un archivo de configuración docker-compose.yml. Este archivo puede especificar múltiples servicios, volúmenes, redes, y otras configuraciones relacionadas con la aplicación.
Ejecución de múltiples servicios: Ideal para iniciar aplicaciones compuestas por varios servicios o contenedores que necesitan trabajar juntos.
Sintaxis básica: docker-compose up -d.
Ejemplo: Si tienes un archivo docker-compose.yml configurado, puedes ejecutar docker-compose up -d en el mismo directorio que el archivo para iniciar todos los servicios definidos en él.
Observaciones: docker-compose proporciona una forma de definir y orquestar múltiples contenedores, configurando redes y volúmenes, lo que facilita el despliegue y la gestión de aplicaciones más complejas.










