export const resolverTemplate = (name) => {
    const fileName = name.charAt(0).toUpperCase() + name.slice(1)

    let template = ``

    template += `import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ${fileName}Service } from './${name}.service';
import { Create${fileName}Input } from './dto/create-${name}.input';
import { Update${fileName}Input } from './dto/update-${name}.input';
import { Filter${fileName}Input } from './dto/filter-${name}.input';
import { ${fileName} } from '../schemas/${name}.schema';

@Resolver(${fileName})
export class ${fileName}Resolver {
    constructor(private readonly ${name}Service: ${fileName}Service) {}

    @Mutation(() => ${fileName})
    create(@Args('create${fileName}Input') create${fileName}Input: Create${fileName}Input) {
    return this.${name}Service.create(create${fileName}Input);
    }

    @Query(() => [${fileName}])
    findAll(@Args('filter${fileName}Input') filter${fileName}Input: Filter${fileName}Input) {
    return this.${name}Service.findAll(filter${fileName}Input);
    }

    @Query(() => ${fileName})
    findOne(@Args('id') id: number) {
    return this.${name}Service.findOne(id);
    }

    @Mutation(() => ${fileName})
    update(@Args('id') id: number, @Args('update${fileName}Input') update${fileName}Input: Update${fileName}Input) {
    return this.${name}Service.update(id, update${fileName}Input);
    }

    @Mutation(() => ${fileName})
    remove(@Args('id') id: number) {
    return this.${name}Service.remove(id);
    }
}
`
    return template
}