// import mongoose from "mongoose"

// export const dbConnect = (url: string) => {
//     mongoose.connect(url, () => {
//         console.log("DB connect successfully");

//     })
// }
import { Dialect, Sequelize } from 'sequelize'
import fs from "fs"
import path from "path"

// const dbName = process.env.DB_NAME as string
// const dbUser = process.env.DB_USER as string
// const dbHost = process.env.DB_HOST
// const dbDriver = process.env.DB_DRIVER as Dialect
// const dbPassword = process.env.DB_PASSWORD


//sequelize
export const dbConnect = async (dbName: string, dbUser: string, dbPassword: string, dbHost: string, dbDriver: Dialect) => {


    const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
        host: dbHost,
        dialect: dbDriver
    })


    const checkTypes = (value) => {
        if (value.includes("tinyint(1)")) {
            return 'boolean'
        }
        if (value.includes("int")) {
            return 'number'
        }
        if (value.includes("date") || value.includes("time")) {
            return 'Date'
        }
        if (value.includes('varchar')) {
            return 'string'
        }
    }
    // const query = sequelize.models

    // console.log(query);




    const [relationList, metadata2]: any = await sequelize.query(`SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE REFERENCED_TABLE_SCHEMA = '${dbName}'`)


    // console.log(relationList);
    sequelize.showAllSchemas({ logging: true }).then(async (e: any) => {
        // console.log(e[0].Tables_in_test);
        // e.forEach(async element => {
        //     console.log(element.Tables_in_test);
        //     const [results, metadata]: any = await sequelize.query(`Desc ${element.Tables_in_test}`)


        // });
        // console.log(e);

        let data: any
        for (data of e) {

            // console.log(data[`Tables_in_${dbName}`]);
            const table = data[`Tables_in_${dbName}`]
            const [results, metadata]: any = await sequelize.query(`SHOW COLUMNS from ${table}`)
            // console.log(results);
            // break;
            const fields = {}

            results.forEach(d => {
                // console.log("first", d['Null']);
                // console.log(d['Type'].indexOf('enum'));
                d['Null'] = d['Null'] === "YES" ? true : false
                if (d['Type'].indexOf('enum') === 0) {
                    d['Type'].indexOf('enum') === 0 ? (d['enumFields'] = d['Type'], d['Type'] = 'string') : ''
                } else {
                    d['Type'] = checkTypes(d['Type'])
                }
                if (d['Default'] !== null) {
                    d['defaultValue'] = d['Default'] === '0' ? false : d['Default'] === '1' ? true : d['Default'] === 'current_timestamp()' ? 'new Date()' : d['Default']
                }


                relationList.forEach(elm => {
                    if (elm.TABLE_NAME === table && elm.COLUMN_NAME === d['Field']) {
                        d['Referece'] = elm.REFERENCED_TABLE_NAME
                    }

                });
                // console.log(d['Field'], d['Type']);


                fields[d['Field']] = {
                    type: d['Type'],
                    default: d['defaultValue'],
                    allowNull: d['Null'],
                    key: d['Key'],
                    reference: d['Referece'],
                    enumFields: d['enumFields']
                }

            });
            console.log(fields);
            const createDtoResponse = createDtoTemplate(table, fields)

            const schemaResponse = schemaTemplate(table, fields)
            const moduleResponse = moduleTemplate(table, fields)
            const controllerResponse = controllerTemplate(table)
            const serviceResponse = serviceTemplate(table, fields)
            const updateDtoResponse = updateDtoTemplate(table)
            // console.log(response);

            if (!fs.existsSync('./src/schemas')) {
                fs.mkdirSync('./src/schemas', { recursive: true });
            }
            fs.writeFileSync(`./src/schemas/${table}.schema.ts`, schemaResponse)
            fs.mkdirSync(`./src/${table}`, { recursive: true })
            fs.mkdirSync(`./src/${table}/dto`, { recursive: true })
            fs.writeFileSync(`./src/${table}/dto/create-${table}.dto.ts`, createDtoResponse)
            fs.writeFileSync(`./src/${table}/dto/update-${table}.dto.ts`, updateDtoResponse)
            fs.writeFileSync(`./src/${table}/${table}.module.ts`, moduleResponse)
            fs.writeFileSync(`./src/${table}/${table}.controller.ts`, controllerResponse)
            fs.writeFileSync(`./src/${table}/${table}.service.ts`, serviceResponse)
            // console.log(__dirname);


            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");


        }

    }
    )









    // sequelize.query("show tales")
    // console.log(sequelize.showAllSchemas({ logging: true }));
    // sequelize.authenticate().then(() => {
    //     console.log('Connection has been established successfully.');
    // }).catch((error) => {
    //     console.error('Unable to connect to the database: ', error);
    // });






    const db: any = {};

    // fs
    //     .readdirSync(__dirname)
    //     .filter((file) => {
    //         return (file.indexOf(".") !== 0) && (file !== "index.js") && (file !== "migrations") && (file !== "redshift-migrations");
    //     })
    //     .forEach((file) => {
    //         const model = sequelize.import(path.join(__dirname, file));
    //         db[model.name] = model;
    //     });

    // Object.keys(db).forEach((modelName) => {
    //     if ("associate" in db[modelName]) {
    //         db[modelName].associate(db);
    //     }

    //     db[modelName].sync().then(result => {
    //         // some logic
    //     }).catch(err => {
    //         // some logic
    //     })
    // });

    // db.sequelize = sequelize;
    // db.Sequelize = Sequelize;

}










//mysql
import mysql from "mysql"
import { schemaTemplate } from './Templates/schemaTemplate'
import { moduleTemplate } from './Templates/moduleTemplate'
import { controllerTemplate } from './Templates/controllerTemplate'
import { serviceTemplate } from './Templates/serviceTemplate'
import { createDtoTemplate } from './Templates/createDtoTemplate'
import { updateDtoTemplate } from './Templates/updateDtoTemplate'

// export const dbConnect = () => {
//     var con = mysql.createConnection({
//         host: "localhost",
//         user: "root",
//         password: "",
//         database: "test"
//     });

//     con.connect(function (err) {
//         if (err) throw err;
//         console.log("Connected!");
//     });

//     con.query("SHOW tables", function (err, result) {
//         if (err) throw err;
//         console.log(result);
//         con.query(`DESC customers`, function (err2, result2) {
//             if (err2) throw err2;
//             console.log(result2);
//         })
//     });
// }



// export default sequelizeConnection
