import Hapi from '@hapi/hapi';
import Runtime from '../runtime/Runtime';
export default function setupDevtoolRoutes(runtime: Runtime, server: Hapi.Server, { isDebuggerConnected }: {
    isDebuggerConnected: () => boolean;
}): void;
//# sourceMappingURL=setupDevtoolRoutes.d.ts.map