## MICROSERVICES

### Objective
Speed up development by the implementation a of a new architectural approach to designing applications based on modules that can be easily deployed and independently scaled.

### 12 factor apps that return a portable, deployable and scalable application
A methodology for building software-as-a-service apps

12) 1) Principles

* I. Codebase:
This principle emphasizes the importance of having a single codebase tracked in a version control system. From this source, you can perform multiple deployments in development, testing, and production environments, ensuring consistency and traceability throughout the development lifecycle.

* II. Dependencies:
It's essential to explicitly declare and isolate your application's dependencies. Doing so makes your application more predictable and maintainable, as you'll know exactly which versions of libraries and components are used, avoiding surprises and conflicts.

* III. Config:
Application configurations should be stored in the environment, separate from the source code. This allows flexible configuration for each environment without modifying the code, enhancing portability and security.

* IV. Backing services:
Treat external services (databases, web services, etc.) as attached resources. This means that services should be easily replaceable and configurable, facilitating change and scalability.

* V. Build, release, run:
Clearly separate the stages of building, releasing, and running the application. This helps ensure that applications are deployed reliably and consistently in different environments.

* VI. Processes:
Run the application as one or more stateless processes. This makes scaling and recovery from failures easier since there are no state dependencies on a single server.

* VII. Port binding:
Export services through port binding. This allows the application to be accessible and communicable in a standard way over the network.

* VIII. Concurrency:
Scale the application using the process model. You can increase your application's capacity by running multiple processes rather than making them larger. This improves reliability and efficiency.

* IX. Disposability:
Maximize robustness with fast startup and graceful shutdown. Ensure that your application can start quickly and shut down safely to minimize the impact of failures and updates.

* X. Dev/prod parity:
Keep development, testing, and production environments as similar as possible. This reduces errors caused by differences in environments and allows issues to be detected earlier.

* XI. Logs:
Treat application logs as event streams. Logs should be accessible, structured, and useful for monitoring and debugging.

* XII. Admin processes:
Run administrative and management tasks as independent processes, not part of the main application. This ensures that these tasks do not impact the performance of the main application and can be executed in a controlled manner.

For more info: https://12factor.net/

12) 2) An app with these characteristics results in a portable, deployable and scalable app:
---> portable: prepared to work in different environments reducing dependencies and configurations related incompatibilities.
---> deployable: thought to be deployed in cloud where the borders between development and production environments get blur. 
---> scalable: prepared to bear different users' demands.

### Setup Google Compute Engine (GCE) and Enable Cloud Shell

Create two Cloud Shell Sessions and run the following commands to avoid setting the compute zone.

For more info: https://github.com/udacity/ud615/tree/master/app

1) List available time zones: 
gcloud compute zones list

2) Set a time zone example:
gcloud config set compute/zone europe-west1-d

3) Download Go
wget https://storage.googleapis.com/golang/go1.6.2.linux-amd64.tar.gz
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf go1.6.2.linux-amd64.tar.gz
echo "export GOPATH=~/go" >> ~/.bashrc
source ~/.bashrc

4) Get the code
mkdir -p $GOPATH/src/github.com/udacity
cd $GOPATH/src/github.com/udacity
git clone https://github.com/udacity/ud615

5) Go to app
cd ud615/app

6) On shell 1 - build the app:
cd $GOPATH/src/github.com/udacity/ud615/app
mkdir bin
go build -o ./bin/monolith ./monolith

6) 1) In case of error install the dependencies first by running:
go get -u

6) 2) Generate TLS certificates (autenticar la identidad de los servidores web y cifrar la comunicación entre el cliente y el servidor)
sudo ./bin/monolith -http :10080

7) On shell 2 - test the app:
curl http://127.0.0.1:10080
curl http://127.0.0.1:10080/secure

7) 1) Authenticate (password is password)
curl http://127.0.0.1:10080/login -u user

7) 2) Login and assign the value of the JWT to a variable
TOKEN=$(curl http://127.0.0.1:10080/login -u user | jq -r '.token')
---> Checking if it works: echo $TOKEN

7) 3) aAccess the secure endpoint using the JWT
url -H "Authorization: Bearer $TOKEN" http://127.0.0.1:10080/secure

7) 4) Check out dependencies
ls vendor 
cat vendor/vendor.json

