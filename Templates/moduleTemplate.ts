export const moduleTemplate = (name, fields) => {
    const fileName = name.charAt(0).toUpperCase() + name.slice(1)
    let reference = []
    for (let i in fields) {
        if (fields[i]['reference']) {
            reference.push(fields[i]['reference'])
        }
    }
    reference = [... new Set(reference)]

    const modelList = []
    reference.forEach(element => {
        modelList.push(element.charAt(0).toUpperCase() + element.slice(1))
    })

    console.log(modelList);


    const importTemplates = (value) => {
        let template = ``
        for (let i in value) {
            if (value[i]) {

                template += `import { ${value[i].charAt(0).toUpperCase() + value[i].slice(1)} } from '../schemas/${value[i]}.schema';\n`
            }
        }
        return template
    }

    let template = ``

    template += `import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
${importTemplates(reference)}
import { ${fileName}Service }  from './${name}.service';
import { ${fileName}Controller } from './${name}.controller';

@Module({
    imports: [
      SequelizeModule.forFeature([${modelList}]),
    ],
    providers: [${fileName}Controller, ${fileName}Service],
  })
  export class ${fileName}Module {}
  `

    console.log(template);

    return template
}