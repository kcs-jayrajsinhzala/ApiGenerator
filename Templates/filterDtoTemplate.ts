export const filterDtoTemplate = (name) => {
    const fileName = name.charAt(0).toUpperCase() + name.slice(1)

    let template = ``

    template += `export class Filter${fileName}Dto {
        columnName?: string;
        search?: string;
        sortName?: string;
        sortOrder?: string;
        limit?: number;
        page?: number;
}
`

    return template
}