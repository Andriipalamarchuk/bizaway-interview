db = db.getSiblingDB(process.env.DATABASE_NAME);

db.createUser({
    user: process.env.DATABASE_USERNAME,
    pwd: process.env.DATABASE_PASSWORD,
    roles: [{ role: "readWrite", db: db.getName() }]
});

db.createCollection(process.env.DATABASE_COLLECTION_NAME);
