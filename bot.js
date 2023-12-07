require('dotenv').config();
const sqlite3 = require("sqlite3").verbose();
const Discord = require('discord.js');
const bot = new Discord.Client({ intents: ['GuildMessages','Guilds', 'GuildMembers','DirectMessages', 'MessageContent']});


bot.login(process.env.token);

function isNumeric(value) {
    return !isNaN(value);
}


function getSpent(days){
    sum = 0.0;
    let currentDate = new Date();
    let now = currentDate.getTime(); //unix timestamp
    let from = currentDate.setDate(currentDate.getDate() - days);
    // console.log(`From ${from} to ${now}`);
    return new Promise((resolve, reject)=>{
        db.all('SELECT amount, timestamp FROM money', (err, rows) => {
            if (err) {
              console.error(err.message);
            } else {
            rows.forEach((row) => {
                if(from < row.timestamp){
                    sum = sum + parseFloat(row.amount);
                }
              });
            }
            resolve(sum);
          });
    })  
}


function parseCommand(msg){
    let command = msg.content;
    command = command.slice(1);
    commandArray = command.split(" ");
    commandName = commandArray[0];


    switch (commandName) {
        case "printdb":
          if (msg.author.id == "225953850765344769"){
            printdb();
            msg.channel.send("Printed your bitchass database")
          };
          break;
          
        case "spent":
          if(commandArray.length != 2 || !isNumeric(commandArray[1])){
            msg.channel.send("Use the command correctly (!spent 'numeric-amount')");
            break;
          }
          if(msg.author.id != "225953850765344769"){
            msg.channel.send("WHOOO ARE YOOOOU???");
            break;
          }else{
            msg.channel.send(msg.createdTimestamp.toString());
            writedb(commandArray[1], msg.createdTimestamp);
          }
          break;

          case "history":
            if (msg.author.id == "225953850765344769" && commandArray.length == 2 && isNumeric(commandArray[1])){
                // getSpent(parseInt(commandArray[1]))
                // .then((spent)=>{
                //     msg.channel.send(`Over the past ${commandArray[1]} days, you've spent ${spent}`);
                // })
                // .catch(error=>{
                //     console.error(error);
                // })
                const measureTime = (getSpent, args) => {
                    const start = new Date().getTime();
                    getSpent(args).then((spent) => {
                        msg.channel.send(`Over the past ${commandArray[1]} days, you've spent ${spent}`);
                        const end = new Date().getTime();
                        console.log(`Time taken: ${end - start}ms`);
                    }).catch();
                } 
                measureTime(getSpent,commandArray[1])
            }
          break;

        default:
          msg.channel.send("Invalid command")
          console.log(msg.author);
          console.log(commandArray);
          break;
}
}

const db = new sqlite3.Database("./database/money.db", sqlite3.OPEN_READWRITE, (err)=> {
    if (err) return console.error(err.message);

    db.run('CREATE TABLE IF NOT EXISTS money (id INTEGER PRIMARY KEY AUTOINCREMENT, amount DECIMAL(10,2) NOT NULL, timestamp INTEGER NOT NULL)');
    console.log('connected to the db');
});

function dbclose(){
    db.close((err)=>{
        if (err) return console.error(err.message);

        console.log('closed the database');
    })
}
process.on("exit", () =>{
    db.close()
})


// function writedb(date,name,content,id){
//     const sql = `INSERT INTO messages(date, username, content, id)
//             VALUES(?,?,?,?)`;
//     db.run(sql,[date,name, content,id], (err)=>{
//         if (err) return console.error(err.message);

//         console.log('Message logged');
// });
// }


function writedb(amount ,date){
    const sql = `INSERT INTO money(amount, timestamp)
            VALUES(?,?)`;

    db.run(sql,[amount,date], (err)=>{
        if (err) return console.error(err.message);

        console.log(`logged amount: ${amount}, and date ${date}`);
});
}


function printdb(){
    const sql = `SELECT * FROM money`;
    db.all(sql, [], (err, rows)=>{
        if (err) return console.error(err.message);
        rows.forEach(row =>{
            console.log(row);
        });
    });    
}
function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return String(time);
  }

function check(num1,num2)
{
    if((isNaN(num1)||isNaN(num2)))
    {
        return(true);
    }
    else{return false;}
}
function doMath(command, num1, num2)
{
    if(check(num1,num2))
    {
        return "Missing arguments, or invalid command";
    }
    switch(command)
    {
        case 'add':
            return ((Number(num1.toString())+Number(num2.toString())).toString());
        case 'subtract':
            return ((Number(num1.toString())-Number(num2.toString())).toString());
        case 'multiply':
            return ((Number(num1.toString())*Number(num2.toString())).toString());
        case 'divide':
            if(num2 !== '0')
            {
                return ((Number(num1.toString())/Number(num2.toString())).toString());
            }
            else{return "can't divide by 0";}
    }
    return "Invalid commad";
}
bot.on("messageCreate",(msg) => {

    if(msg.content[0] == "!" && msg.content.length >1)
    {
        parseCommand(msg);
    }
    if(msg.content.includes("may I sheesh that?")){
        msg.channel.send("You absolutely may");
    }
    if(msg.content.includes(":7rsh:") && msg.author != bot.author){
        msg.channel.send('<:7rsh:819272274116870195>');
    }
    })
