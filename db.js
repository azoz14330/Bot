const sqlite3 = require("sqlite3").verbose();

function dbinit(){
    const db = new sqlite3.Database("./database/messages.db", sqlite3.OPEN_READWRITE, (err)=> {
        if (err) return console.error(err.message);
    
        console.log('connected to the db');
        return db;
    });
}




// db.run("CREATE TABLE messages(date, username, content, id)");
function writedb(date,name,content,id){
    const sql = `INSERT INTO messages(date, username, content, id)
            VALUES(?,?,?,?)`;
    db.run(sql,[date,name, content,id], (err)=>{
        if (err) return console.error(err.message);

        console.log('Message logged');
});
}




function printdb(){
    const sql = `SELECT * FROM messages`;
    db.all(sql, [], (err, rows)=>{
        if (err) return console.error(err.message);
        rows.forEach(row =>{
            console.log(row);
        });
    });    
}

function dbclose(){
    db.close((err)=>{
        if (err) return console.error(err.message);

        console.log('closed the database');
    })
}
let db = dbinit();
dbclose();
