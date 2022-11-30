export const serviceTemplate = (name, fields, apiType) => {
    const fileName = name.charAt(0).toUpperCase() + name.slice(1)

    let reference = []
    for (let i in fields) {
        if (fields[i]['reference']) {
            reference.push(fields[i]['reference'])
        }
    }
    reference = [... new Set(reference)]
    const importTemplates = (value, type) => {
        let template = ``
        if (type === "GraphQL") {
            template += `import { Create${fileName}Input } from './dto/create-${name}.input';
import { Update${fileName}Input } from './dto/update-${name}.input';
import { Filter${fileName}Input } from './dto/filter-${name}.input';\n`
        }
        else if (type === "RestAPI") {
            template += `import { Create${fileName}Dto } from './dto/create-${name}.dto';
import { Update${fileName}Dto } from './dto/update-${name}.dto';
import { Filter${fileName}Dto } from './dto/filter-${name}.dto';\n`
        }
        for (let i in value) {
            if (value[i]) {

                template += `import { ${value[i].charAt(0).toUpperCase() + value[i].slice(1)} } from '../schemas/${value[i]}.schema';\n`
            }
        }
        return template
    }

    const includeModelTemplates = (element) => {
        let template = ``
        for (let i in element) {
            if (element[i]['reference'] && element[i]['referenceAs']) {
                // template = `include: [`
                template += `{ model: ${element[i]['reference'].charAt(0).toUpperCase() + element[i]['reference'].slice(1)}, as: '${element[i]['referenceAs']}' },`
            }
        }
        return template
    }

    const checkIncludesTemplate = (value) => {
        let template = ``
        for (let i in value) {
            if (value[i]['reference'] && value[i]['referenceAs']) {
                template = `include: [`
            }
        }
        if (template !== '') {
            template += `${includeModelTemplates(value)}]`
        }

        return template

    }
    const data = checkIncludesTemplate(fields)

    const checkGraphQL = apiType === "GraphQL" ? "Input" : apiType === "RestAPI" ? "Dto" : ""

    let template = ``

    template += `import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ${fileName} } from '../schemas/${name}.schema';
${importTemplates(reference, apiType)}

@Injectable()
export class ${fileName}Service {
    constructor(@InjectModel(${fileName}) private readonly ${name}Model: typeof ${fileName}) { }

    async create(create${fileName}${checkGraphQL}: Create${fileName}${checkGraphQL}) {
        try {
            const ${name}Details = await this.${name}Model.create({...create${fileName}${checkGraphQL}});
            if(!${name}Details){
                throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }
        return ${name}Details;
        } catch (err) {
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }
    }

    async findAll(filter${fileName}${checkGraphQL}: Filter${fileName}${checkGraphQL}) {
        try{
            filter${fileName}${checkGraphQL}.limit ? filter${fileName}${checkGraphQL}.limit : filter${fileName}${checkGraphQL}.limit= 10
            filter${fileName}${checkGraphQL}.page ? filter${fileName}${checkGraphQL}.page : filter${fileName}${checkGraphQL}.page = 1
      
            const offset = (filter${fileName}${checkGraphQL}.page - 1) * filter${fileName}${checkGraphQL}.limit;
            let whereCondition = {}
      
            if(filter${fileName}${checkGraphQL}.columnName && filter${fileName}${checkGraphQL}.search){
              whereCondition[filter${fileName}${checkGraphQL}.columnName]= { [Op.like] : '%' + filter${fileName}${checkGraphQL}.search + '%'}
            }

            let order = []
      
            if(filter${fileName}${checkGraphQL}.sortName && filter${fileName}${checkGraphQL}.sortOrder){
              order= [[filter${fileName}${checkGraphQL}.sortName,filter${fileName}${checkGraphQL}.sortOrder]]
            }
      
            const ${name} = await this.${name}Model.findAll({
              limit:+filter${fileName}${checkGraphQL}.limit,
              offset,
              where: whereCondition,
              ${data ? `${data},` : ''}
              order:order
            });
            return ${name}
        }
        catch (err){
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }
    }

    async findOne(id: number) {
        try {
            const ${name} = await this.${name}Model.findOne({
              where: {
                id: id,
              },
              ${checkIncludesTemplate(fields)}
            });
            return ${name}
      
          } catch (err) {
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
          }
    }

    async update(id: number, update${fileName}${checkGraphQL}: Update${fileName}${checkGraphQL}) {
        try{
            const [numberOfAffectedRows, [updated${fileName}]] = await this.${name}Model.update({ ...update${fileName}${checkGraphQL} }, { where: { id }, returning: true });

            return { numberOfAffectedRows, updated${fileName} };
        }
        catch (err){
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }
    }

    async remove(id: number) {
        try{
            return await this.${name}Model.destroy({ where: { id } });
        }
        catch (err){
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }
    }
}
`
    return template
}