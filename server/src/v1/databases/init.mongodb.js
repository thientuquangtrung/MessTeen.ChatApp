const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { countConnections } = require('../helpers/checkConnect');
const {
    DB: { MONGO_URI },
} = require('../configs');
const userModel = require('../modules/User/user.model');

const connectString = MONGO_URI;
console.log(`MONGO CONNECT STRING::::`, connectString);

class Database {
    constructor() {
        this.connect();
    }

    // connect
    connect(type = 'mongodb') {
        if (1 === 1) {
            // all executed methods log output to console
            mongoose.set('debug', true);

            // disable colors in debug mode
            mongoose.set('debug', { color: false });

            // get mongodb-shell friendly output (ISODate)
            mongoose.set('debug', { shell: true });
        }

        mongoose
            .connect(connectString)
            .then(async (_) => {
                console.log(`Connect mongodb success`, countConnections());
                const foundAdmin = await userModel.findOne({
                    usr_email: 'messteen-admin@gmail.com',
                    usr_role: 'admin',
                });

                if (!foundAdmin) {
                    await userModel.create({
                        usr_name: 'Messteen Administrator',
                        usr_email: 'messteen-admin@gmail.com',
                        usr_role: 'admin',
                        usr_password: await bcrypt.hash('admin1234567890', 10),
                        usr_avatar:
                            'https://firebasestorage.googleapis.com/v0/b/messteen-chat-app.appspot.com/o/avatars%2Ff8ee5b8f-8a38-4ff5-8ecb-22642b545a7e?alt=media&token=11051af8-9be7-4927-a3ac-89645345bd13',
                    });
                }
            })
            .catch((error) => console.log(`Connect error: ${error}`));
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
