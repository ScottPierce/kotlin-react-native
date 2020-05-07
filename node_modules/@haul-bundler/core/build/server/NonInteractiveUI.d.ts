import Runtime from '../runtime/Runtime';
import UserInterface from './UI';
export default class NonInteractiveUserInterface implements UserInterface {
    private runtime;
    constructor(runtime: Runtime);
    updateCompilationProgress(platform: string, { running, value }: {
        running: boolean;
        value: number;
    }): void;
    addLogItem(item: string): void;
    dispose(exitCode?: number, exit?: boolean): void;
    start(platforms: string[]): void;
}
//# sourceMappingURL=NonInteractiveUI.d.ts.map