
const generateColumnTemplate = (value, currentcolumn) => {
    let template = ``
    template += `\t@Column({ allowNull: ${value['allowNull']}`
    if (value['enumFields']) {
        template += `, type: sequelize.ENUM${value['enumFields'].slice(4)}`
    }
    if (value['default']) {
        if (value['default'] === true || value['default'] === false || value['default'] === 'new Date()') {
            template += `, defaultValue: ${value['default']}`
        }
        else {
            template += `, defaultValue: '${value['default']}'`

        }
    }
    value['type'] = value['reference'] ? value['reference'].charAt(0).toUpperCase() + value['reference'].slice(1) : value['type']
    template += ` })\n\t${currentcolumn}: ${value['type']}\n\n`
    return template
}

export const fieldTemplate = (field) => {
    let template = ``

    for (let i in field) {
        if (field[i]['reference']) {
            template += `\t@ForeignKey(() => ${field[i]['reference'].charAt(0).toUpperCase() + field[i]['reference'].slice(1)})\n`
            template += generateColumnTemplate(field[i], i)
        }
        else {
            template += generateColumnTemplate(field[i], i)
        }
    }
    // console.log(template);
    return template
}