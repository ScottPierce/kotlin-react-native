import Runtime from '../../runtime/Runtime';
declare type Options = {
    test?: RegExp;
    platform: string;
    runtime: Runtime;
};
declare type CollectOutput = {
    [key: string]: {
        platform: string;
        name: string;
    };
};
declare type CollectOptions = {
    name: string;
    platform: string;
    type: string;
};
export default class AssetResolver {
    private options;
    static test: RegExp;
    static collect(list: Array<string>, { name, type, platform }: CollectOptions): CollectOutput;
    constructor(options: Options);
    apply(resolver: any): void;
}
export {};
//# sourceMappingURL=AssetResolver.d.ts.map