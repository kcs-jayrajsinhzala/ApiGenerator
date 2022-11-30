export const createDtoTemplate = (name, fields, apiType) => {
    const fileName = name.charAt(0).toUpperCase() + name.slice(1)

    const fieldsTemplate = (element) => {
        let fieldTemplate = ``
        let checkInput = ``
        for (let i in element) {
            if (!element[i]['allowNull'] && element[i]['key'] !== 'PRI') {
                if (apiType === "GraphQL") {
                    fieldTemplate += `\t@Field()\n`
                    checkInput = `@InputType()\n`
                }
                else if (apiType === "RestAPI") {
                    fieldTemplate += `\t@ApiProperty({ required: true, type: ${element[i]['type'].charAt(0).toUpperCase() + element[i]['type'].slice(1)} })`
                }
                fieldTemplate += `\t${i}: ${element[i]['type']}\n`
            }
            else {
                checkInput = ``
            }
        }
        return [fieldTemplate, checkInput]
    }

    const [fieldTemplate, checkInput] = fieldsTemplate(fields)

    const className = apiType === "RestAPI" ? `Create${fileName}Dto` : `Create${fileName}Input`

    let template = ``
    if (apiType === "GraphQL") {
        template += `import { Field, InputType } from '@nestjs/graphql';\n\n${checkInput}`
    } else if (apiType === "RestAPI") {
        template += `import { ApiProperty } from "@nestjs/swagger";\n\n`
    }
    template += `export class ${className} {
${fieldTemplate}
}      
  `

    return template
}