export const serviceTemplate = (name, fields) => {
    const fileName = name.charAt(0).toUpperCase() + name.slice(1)

    let reference = []
    for (let i in fields) {
        if (fields[i]['reference']) {
            reference.push(fields[i]['reference'])
        }
    }
    reference = [... new Set(reference)]
    const importTemplates = (value) => {
        let template = ``
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

    let template = ``

    template += `import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Create${fileName}Dto } from './dto/create-${name}.dto';
import { Update${fileName}Dto } from './dto/update-${name}.dto';
import { Filter${fileName}Dto } from './dto/filter-${name}.dto';
import { ${fileName} } from '../schemas/${name}.schema';
${importTemplates(reference)}

@Injectable()
export class ${fileName}Service {
    constructor(@InjectModel(${fileName}) private readonly ${name}Model: typeof ${fileName}) { }

    async create(create${fileName}Dto: Create${fileName}Dto) {
        try {
            const ${name}Details = await this.${name}Model.create({...create${fileName}Dto});
            if(!${name}Details){
                throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }
        return ${name}Details;
        } catch (err) {
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }
    }

    async findAll(filter${fileName}Dto: Filter${fileName}Dto) {
        try{
            filter${fileName}Dto.limit ? filter${fileName}Dto.limit : filter${fileName}Dto.limit= 10
            filter${fileName}Dto.page ? filter${fileName}Dto.page : filter${fileName}Dto.page = 1
      
            const offset = (filter${fileName}Dto.page - 1) * filter${fileName}Dto.limit;
            let whereCondition = {}
      
            if(filter${fileName}Dto.columnName && filter${fileName}Dto.search){
              whereCondition[filter${fileName}Dto.columnName]= { [Op.like] : '%' + filter${fileName}Dto.search + '%'}
            }

            let order = []
      
            if(filter${fileName}Dto.sortName && filter${fileName}Dto.sortOrder){
              order= [[filter${fileName}Dto.sortName,filter${fileName}Dto.sortOrder]]
            }
      
            const ${name} = await this.${name}Model.findAll({
              limit:filter${fileName}Dto.limit,
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
                is_deleted: false,
              },
              ${checkIncludesTemplate(fields)}
            });
            return ${name}
      
          } catch (e) {
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
          }
    }

    async update(id: number, update${fileName}Dto: Update${fileName}Dto) {
        try{
            const [numberOfAffectedRows, [updated${fileName}]] = await this.${name}Model.update({ ...update${fileName}Dto }, { where: { id }, returning: true });

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