export const controllerTemplate = (name, fields) => {
    const fileName = name.charAt(0).toUpperCase() + name.slice(1)

    let template = ``

    template += `import { Controller, Get, Query } from '@nestjs/common';
    
    @Controller()
    export class ${fileName}Controller {
      constructor() {}
 
    }
    
  `
    return template
}