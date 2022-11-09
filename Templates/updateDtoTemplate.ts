export const updateDtoTemplate = (name, fields) => {
    const fileName = name.charAt(0).toUpperCase() + name.slice(1)

    let template = ``

    template += `import { PartialType } from '@nestjs/mapped-types';
import { Create${fileName}Dto } from './create-${name}.dto';

export class Update${fileName}Dto extends PartialType(Create${fileName}Dto) {}
  `
    return template
}