import { fieldTemplate } from "./fieldTemplate"

export const schemaTemplate = (filename, fields, apiType) => {

    let reference = []
    for (let i in fields) {
        if (fields[i]['reference']) {
            reference.push(fields[i]['reference'])
        }
    }
    reference = [... new Set(reference)]

    const importTemplates = (value, type) => {
        let template = ``
        if (type === "GraphQL") {
            template += `import { Field, ObjectType } from '@nestjs/graphql';\n`
        }
        for (let i in value) {
            if (value[i]) {

                template += `import { ${value[i].charAt(0).toUpperCase() + value[i].slice(1)} } from './${value[i]}.schema';\n`
            }
        }
        return template
    }
    let template = ``

    const fieldsData = fieldTemplate(fields, apiType)

    template += `import {
Column,
Model,
ForeignKey,
BelongsTo,
Table,
} from 'sequelize-typescript';
import sequelize from 'sequelize';
${importTemplates(reference, apiType)}
@Table({ timestamps: false, freezeTableName: true })${apiType === "GraphQL" ? `\n@ObjectType({ isAbstract: true })` : ``}
export class ${filename.charAt(0).toUpperCase() + filename.slice(1)} extends Model {
${fieldsData}}
`

    return template

}