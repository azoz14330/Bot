const Discord = require('discord.js');
const bot = new Discord.Client({ intents: ['GuildMessages','Guilds', 'GuildMembers','DirectMessages', 'MessageContent']});
require('dotenv').config();
bot.login(process.env.token);
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
    // if (msg.author.id !== bot.user.id){
    //     msg.channel.send("\:7rsh:");
    // }
    if(msg.content[0] == "!" && msg.content.length >1)
    {
        let command = msg.content.substring(1);
        let Array = command.split(" ");
        if(Array.length == 3)
        {
            msg.channel.send(doMath(Array[0],Array[1],Array[2]));
        }
    }
})