## Local db setup

Pull the postgres container

```bash
$ docker pull postgres:alpine
```

Create the container

```bash
$ docker run --name mbsm-db -e POSTGRES_PASSWORD=password -d -p 5432:5432 postgres:alpine
```

Bash into the container

```bash
$ docker exec -it mbsm-db bash
```

Create the database

```bash
$ PGPASSWORD='password' psql \
    -h 'localhost' \
    -U 'postgres'  \
    -d 'template1' \
    -c 'create database mbsm'
```
