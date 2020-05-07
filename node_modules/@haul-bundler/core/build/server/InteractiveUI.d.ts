import { Terminal } from 'terminal-kit';
import UserInterface from './UI';
export default class InteractiveUserInterface implements UserInterface {
    private terminal;
    private logs;
    private compilations;
    private LOGS_START_Y;
    constructor(terminal: Terminal);
    renderLogsSection(): void;
    renderCompilationsSection(platforms: string[]): void;
    createCompilations(platforms: string[]): void;
    renderCompilationsProgress(): void;
    updateCompilationProgress(platform: string, { running, value }: {
        running: boolean;
        value: number;
    }): void;
    renderLogs(): void;
    addLogItem(item: string): void;
    dispose(exitCode?: number, exit?: boolean): void;
    start(platforms: string[]): void;
}
//# sourceMappingURL=InteractiveUI.d.ts.map