export const createDtoTemplate = (name, fields) => {
    console.log(fields);
    const fileName = name.charAt(0).toUpperCase() + name.slice(1)

    const fieldsTemplate = (element) => {
        let fieldTemplate = ``
        for (let i in element) {
            if (!element[i]['allowNull'] && element[i]['key'] !== 'PRI') {
                // console.log(element[i], fields[i]['type']);

                fieldTemplate += `\t${i}: ${element[i]['type']}\n`
            }
        }
        return fieldTemplate
    }

    const data = fieldsTemplate(fields)

    let template = ``

    template += `export class Create${fileName}Dto {
${data}}      
  `

    return template
}