export const serviceTemplate = (name, fields) => {
    const fileName = name.charAt(0).toUpperCase() + name.slice(1)

    let template = ``

    template += `import { Injectable } from '@nestjs/common';
    
    @Injectable()
    export class ${fileName}Service {
      
    }    
  `
    return template
}