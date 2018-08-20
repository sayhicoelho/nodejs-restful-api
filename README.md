# Node.js RESTful API
I have nothing to say yet. This is just a study project.

# Setup
## Redis
* [Linux](https://redis.io/topics/quickstart)
* [Windows](https://github.com/tporadowski/redis/releases)

## MongoDB
* Install [MongoDB](https://docs.mongodb.com/manual/administration/install-community/)
* On Windows, create a folder to store the `data` files (e.g `C:\Program Files\MongoDB\Server\4.0\data`)
* Setup configuration security by editing the file `C:\Program Files\MongoDB\Server\4.0\bin\mongod.cfg` (Windows) or `/etc/mongod.conf` (Linux) adding the [YAML](http://yaml.org/) code bellow:

``` YAML
security:
  authorization: enabled
```

* In addition, change the dbPath if your're on Windows:

``` YAML
storage:
  dbPath: C:\Program Files\MongoDB\Server\4.0\data
```

* On Windows, add the `bin` path to [Environment Variables](https://msdn.microsoft.com/pt-br/library/windows/desktop/ms682653(v=vs.85).aspx)

* Stop the MongoDB service to proceed with the next steps by running `sudo service mongod stop` (Linux) or `net stop MongoDB` (Windows)

* Create the [super user](https://stackoverflow.com/a/34634554/4158755) to work with all databases. Open a command prompt and type:

``` bash
$ mongod --dbpath "your_data_path" # this will run the MongoDB service without any security mode (e.g --auth)
```

* With previous one running, open another command prompt and type:

``` bash
$ mongo
$ use admin
$ db.createUser({ user: 'root', pwd: 'password', roles: [ 'root' ] })
```

* And lastly, close these two command prompts and restart the MongoDB service

# Adding new database
As MongoDB works on top of NoSQL document-oriented database, we do not need to create any database on our system.

Whenever we need to start a new application with its database, we create an user and give to it the dbOwner role. So now, we need to go to the command prompt and type:

``` bash
$ mongo
$ use admin
$ db.auth('root', 'password')
$ use dbname
$ db.createUser({ user: 'admin', pwd: 'password', roles: [ 'dbOwner' ] })
```

# Usage
* Run the command `npm run worker` to start the queue worker with [bee-queue](https://github.com/bee-queue/bee-queue)
* Run the command `npm run start` to start the server with [nodemon](http://nodemon.io/)

# License
[MIT](LICENSE) license.
