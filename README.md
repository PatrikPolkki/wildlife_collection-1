# Wildlife Collection

A place for people to share photos and videos of nature.

<img src="https://user-images.githubusercontent.com/74305561/150800925-8151447f-5b93-4685-b5ba-476573a6e2a8.png" width="475"> <img src="https://user-images.githubusercontent.com/74305561/150800910-8b8a85d6-1b61-45db-8385-231e6dc8c0c2.png" width="475">

## Features

Possibility to browse photos and videos posted by users.

Browse by newest and most liked or use search tool to search by a keyword.

Location data of photo is visible unless user has deleted exifdata.

Create own account to be able to post content.

Like and comment on other peoples' content.

Being able to delete own photos, videos or comments.

Admin users have possibility to delete anything.

Responsive design.

## UI

<img src="https://user-images.githubusercontent.com/74305561/150800920-27aa3361-4951-4a5c-9445-9ad545dd246e.png" width="450"> <img src="https://user-images.githubusercontent.com/74305561/150800922-30eb9d62-53c9-4487-a6bb-fc306327bd40.png" width="450"> <img src="https://user-images.githubusercontent.com/74305561/150800925-8151447f-5b93-4685-b5ba-476573a6e2a8.png" width="450"> <img src="https://user-images.githubusercontent.com/74305561/150800900-74e40e88-a3d0-47b4-8dfc-cddbd2c403e8.png" width="450"> <img src="https://user-images.githubusercontent.com/74305561/150800910-8b8a85d6-1b61-45db-8385-231e6dc8c0c2.png" width="450"> <img src="https://user-images.githubusercontent.com/74305561/150800919-6bba4f7a-01ab-46a2-b7a9-8c2ea70a5573.png" width="450"> <img src="https://user-images.githubusercontent.com/74305561/150800928-15df0155-615d-47b9-a1e9-6ddfe23627eb.png" width="450"> <img src="https://user-images.githubusercontent.com/74305561/150800931-9c8c26d8-daaf-4bb8-b33f-e32ba562d8f3.png" width="450"> <img src="https://user-images.githubusercontent.com/74305561/150800932-67e0789a-0a95-4960-9fff-fd9c67a7e4a0.png" width="475"> <img src="https://user-images.githubusercontent.com/74305561/150800923-c9fbdb71-fae0-448d-b4db-95b8c919727e.PNG" width="300">

## Getting started

#### Install dependencies
* npm i

#### Generate keys and certificate with openssl for HTTPS
* openssl genrsa -out ssl-key.pem 2048

* openssl req -new -key ssl-key.pem -out certrequest.csr

* openssl x509 -req -in certrequest.csr -signkey ssl-key.pem -out ssl-cert.pem


* Put the keys and certificate in the root folder

#### Database model for database
* Take a look at: [lauriari.sql](https://github.com/Lauri92/wildlife_collection/blob/master/lauriari.sql) file

#### Required database information and JWT secretOrPrivatekey

#### Provide  *.env* with your corresponding values

* DB_HOST=`<db>`

* DB_USER=`<db-username>`

* DB_PASS=`<db-pw>`

* DB_NAME=`<db-name>`

* JWT=`<jwt-secret>`

* HTTPS_PORT=8000

* HTTP_PORT=3000

*jwt-secret is used in authController.js and pass.js, value can be anything*



#### Create folders for media to be uploaded into 

* Uploads
* Thumbnails



#### Start app by typing
node app.js

#### Open http://localhost:3000 or https://localhost:8000
* http is redirected to https
