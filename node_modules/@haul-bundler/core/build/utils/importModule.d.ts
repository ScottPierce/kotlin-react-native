/// <reference types="node" />
import Module from 'module';
import Runtime from '../runtime/Runtime';
declare type ModuleCache = {
    [id: string]: Module;
};
declare type Options = {
    resolve: (moduleId: string) => string;
    parentModule?: Module;
    ignore?: Array<string | RegExp> | ((moduleId: string) => boolean);
    cache?: ModuleCache;
    runtime: Runtime;
};
export default function importModule(filename: string, options: Options): {
    exports: any;
    cache: ModuleCache;
};
export {};
//# sourceMappingURL=importModule.d.ts.map