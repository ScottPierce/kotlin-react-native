declare type Options = {
    directories: Array<string>;
    hasteOptions?: any;
};
/**
 * Resolver plugin that allows requiring haste modules with Webpack
 */
export default class HasteResolver {
    private options;
    constructor(options: Options);
    apply(resolver: any): void;
}
export {};
//# sourceMappingURL=HasteResolver.d.ts.map