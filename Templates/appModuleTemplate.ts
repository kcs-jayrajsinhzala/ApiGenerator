export const appModuleTemplate = (value) => {
    let template = ``

    let importsTemplate = ``

    let moduleList = ``

    for (let i in value) {
        importsTemplate += `import { ${value[i]}Module } from './${i}/${i}.module';\n`
        moduleList += `\t${value[i]}Module,\n`
    }

    const data = ''

    template += `import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseConfig } from './database/config';
${importsTemplate}

@Module({
    imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot(DatabaseConfig()),
${moduleList}],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
`
    return template
}