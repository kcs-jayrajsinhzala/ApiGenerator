export const controllerTemplate = (name) => {
    const fileName = name.charAt(0).toUpperCase() + name.slice(1)

    let template = ``

    template += `import { Controller, Get, Query, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ${fileName}Service } from './${name}.service';
import { Create${fileName}Dto } from './dto/create-${name}.dto';
import { Update${fileName}Dto } from './dto/update-${name}.dto';
import { Filter${fileName}Dto } from './dto/filter-${name}.dto';

@Controller('${name}')
export class ${fileName}Controller {
    constructor(private readonly ${name}Service: ${fileName}Service) {}

    @Post('create')
    create(@Body() create${fileName}Dto: Create${fileName}Dto) {
    return this.${name}Service.create(create${fileName}Dto);
    }

    @Get('all')
    findAll(@Query() filter${fileName}Dto: Filter${fileName}Dto) {
    return this.${name}Service.findAll(filter${fileName}Dto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
    return this.${name}Service.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() update${fileName}Dto: Update${fileName}Dto) {
    return this.${name}Service.update(+id, update${fileName}Dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
    return this.${name}Service.remove(+id);
    }
}
`
    return template
}