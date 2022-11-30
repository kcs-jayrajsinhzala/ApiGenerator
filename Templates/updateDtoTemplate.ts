export const updateDtoTemplate = (name, fields, apiType) => {
  const fileName = name.charAt(0).toUpperCase() + name.slice(1)

  const fieldsTemplate = (element, type) => {
    let fieldTemplate = ``
    for (let i in element) {
      if (element[i]['key'] !== 'PRI') {
        if (type === "GraphQL") {
          fieldTemplate += `\t@Field()\n`
        }
        else if (type === "RestAPI") {
          fieldTemplate += `@ApiProperty({ required: false, type: ${element[i]['type'].charAt(0).toUpperCase() + element[i]['type'].slice(1)} })`
        }
        fieldTemplate += `\t${i}: ${element[i]['type']}\n`
      }
    }
    return fieldTemplate
  }

  const data = fieldsTemplate(fields, apiType)


  let template = ``

  if (apiType === "RestAPI") {
    template += `import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from "@nestjs/swagger";
import { Create${fileName}Dto } from './create-${name}.dto';
  
export class Update${fileName}Dto extends PartialType(Create${fileName}Dto) {\n`

  }
  else if (apiType === "GraphQL") {
    template += `import { PartialType } from '@nestjs/mapped-types';
import { Create${fileName}Input } from './create-${name}.input';
import { Field, InputType } from '@nestjs/graphql';
  
@InputType()
export class Update${fileName}Input extends PartialType(Create${fileName}Input) {\n${data}`
  }
  template += `}`
  return template
}