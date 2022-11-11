export const serviceTemplate = (name, fields) => {
    const fileName = name.charAt(0).toUpperCase() + name.slice(1)

    let reference = []
    for (let i in fields) {
        if (fields[i]['reference']) {
            reference.push(fields[i]['reference'])
        }
    }
    reference = [... new Set(reference)]

    const modelList = []
    reference.forEach(element => {
        modelList.push(element.charAt(0).toUpperCase() + element.slice(1))
    })

    let template = ``

    template += `import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Create${fileName}Dto } from './dto/create-${name}.dto';
import { Update${fileName}Dto } from './dto/update-${name}.dto';
import { ${fileName} } from '../schemas/${name}.schema';

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

    async findAll() {
    }

    async findOne(id: number) {
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