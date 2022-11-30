
const generateColumnTemplate = (value, currentcolumn, type) => {
    let template = ``
    template += `\t@Column({ allowNull: ${value['allowNull']},`

    if (value['key'] === 'PRI') {
        template += ` primaryKey: true, autoIncrement: true,`
    }
    if (value['enumFields']) {
        template += ` type: sequelize.ENUM${value['enumFields'].slice(4)},`
    }
    if (value['default']) {
        if (value['default'] === true || value['default'] === false || value['default'] === 'new Date()') {
            template += ` defaultValue: ${value['default']},`
        }
        else {
            template += ` defaultValue: '${value['default']}',`
        }
    }
    template += ` })\n`
    if (type === "GraphQL") {
        template += `\t@Field()\n`
    }
    template += `\t${currentcolumn}: ${value['type']}\n\n`
    return template
}

const generateBelongsToTemplate = (value, currentcolumn, type) => {
    let template = ``

    template += `\t@BelongsTo(() => ${value['reference'].charAt(0).toUpperCase() + value['reference'].slice(1)}, {
\t\tforeignKey: '${currentcolumn}',
\t\ttargetKey: '${value['referenceColumn']}',
\t\tonDelete: 'CASCADE',
\t\tonUpdate: 'CASCADE',
\t})\n`
    if (type === "GraphQL") {
        template += `\t@Field(() => ${value['reference'].charAt(0).toUpperCase() + value['reference'].slice(1)}, { nullable: true })\n`
    }
    template += `\t${value['referenceAs']}?: ${value['reference'].charAt(0).toUpperCase() + value['reference'].slice(1)} | null;\n\n`

    return template
}

export const fieldTemplate = (field, apiType) => {
    let template = ``

    for (let i in field) {
        if (field[i]['reference']) {
            template += `\t@ForeignKey(() => ${field[i]['reference'].charAt(0).toUpperCase() + field[i]['reference'].slice(1)})\n`
            template += generateColumnTemplate(field[i], i, apiType)

            template += generateBelongsToTemplate(field[i], i, apiType)
        }
        else {
            template += generateColumnTemplate(field[i], i, apiType)
        }
    }
    // console.log(template);
    return template
}