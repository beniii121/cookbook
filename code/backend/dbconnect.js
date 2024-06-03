/**
 * Script that handles the database connection, provides abstraction layer. Connects to the db
 * container, which is running an sqlite database.
 */

const sqlite3 = require('sqlite3');

class DB {
    constructor() {
        this.db = new sqlite3.Database('db/recipes.db', (err) => {
            if (err) {
              return console.error(err.message);
            }

            console.log('Connected to the SQlite database.');

            this.createTable();
        });
    }

    async createTable() {
        let query = "CREATE TABLE IF NOT EXISTS recipes (id integer PRIMARY KEY AUTOINCREMENT,title text,ingredients text,description text,notes text,image_path text,liked integer default 0,created date);";

        return new Promise((resolve, reject) => {
            this.db.run(query, [], function(err) {
                if (err) {
                    console.log("Something went wrong: "+err.message);
    
                    return reject({'message':'error'});
                }
    
                console.log("Successfully created table");
    
                resolve({'message':'ok'});
            });
        });
    }

    async insertRecipe(title, ingredients, description, notes, image_path, liked) {
        let query = "INSERT INTO recipes (title, ingredients, description, notes, image_path, liked, created) VALUES ('"+title+"', '"+ingredients+"', '"+description+"', '"+notes+"', '"+image_path+"', "+liked+", CURRENT_DATE)";

        return new Promise((resolve, reject) => {
            this.db.run(query, [], function(err) {
                if (err) {
                    console.log("Something went wrong: "+err.message);
    
                    return reject({'message':'error'});
                }
    
                console.log("Successfully inserted into database with id: "+this.lastID);
    
                resolve({'lastID':this.lastID, 'message':'ok'});
            });
        });
    }

    async editRecipe(title, ingredients, description, notes, image_path, liked, id) {
        let query = "UPDATE recipes SET title='"+title+"', ingredients='"+ingredients+"', description='"+description+"', notes='"+notes+"', image_path='"+image_path+"', liked="+liked+" WHERE id="+id;

        return new Promise((resolve, reject) => {
            try {
                this.db.run(query, [], function(err) {
                    if (err) {
                        console.log("Something went wrong: "+err.message);
        
                        return reject({'error':err.message});
                    }
        
                    console.log("Successfully updated record with id: "+id);
        
                    resolve({'message':'ok'});
                });
            } catch (error) {
                console.log("Something went wrong: "+err.message);

                return reject({'error':err.message})
            }
        });
    }

    async getAll(query) {
        try {
            return new Promise((resolve, reject) => {
                this.db.all(query, [], (err, rows) => {
                    if (err) {
                        console.log("Something went wrong: "+err);
        
                        return reject({'message':'error'});
                    }
        
                    console.log("Successfully query");
        
                    resolve(rows);
                });
            });
        } catch (error) {
            console.log("Something went wrong: "+error);

            return reject({'error':error.message});
        }
    }

    async getFirst(query) {
        return new Promise((resolve, reject) => {
            this.db.get(query, [], (err, row) => {
                if (err) {
                    console.log("Something went wrong: "+err.message);
    
                    return reject({'message':'error'});
                }
    
                console.log("Successfully query");
    
                resolve(row);
            });
        });
    }

    async deleteRecipes(ids) {
        let query = "DELETE FROM recipes WHERE id IN ("+ids.join(",")+")";

        return new Promise((resolve, reject) => {
            this.db.run(query, [], (err) => {
                if (err) {
                    console.log("Something went wrong: "+err.message);
    
                    return reject({'message':'error'});
                }
                console.log("Row(s) deleted with id(s) "+ids.join(","));
    
                resolve({'message':'ok'});
            });
        });
    }
}

module.exports = DB;