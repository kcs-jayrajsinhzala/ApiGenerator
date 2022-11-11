export const configTemplate = (models, dbInfo) => {
    let template = ``

    let importsTemplate = ``
    let modelList = ``

    for (let i in models) {
        importsTemplate += `import { ${models[i]} } from '../schemas/${i}.schema';\n`
        modelList += `\t\t${models[i]},\n`
    }

    const data = ''

    template += `import 'dotenv/config';
${importsTemplate}

const database = {
    development: {
        dialect: 'mysql',
        host: process.env.DB_HOST_NAME,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    test: {
        dialect: 'mysql',
        host: process.env.DB_HOST_NAME,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    production: {
        dialect: 'mysql',
        host: process.env.DB_HOST_NAME,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
};
      
export const DatabaseConfig = () => ({
    ...database[process.env.NODE_ENV],
    models: [
${modelList}\t],
});
`

    return template
}