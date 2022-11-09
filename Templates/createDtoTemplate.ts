export const createDtoTemplate = (name, fields) => {
    const fileName = name.charAt(0).toUpperCase() + name.slice(1)

    let template = ``

    template += `export class Create${fileName}Dto {
}      
  `
    return template
}