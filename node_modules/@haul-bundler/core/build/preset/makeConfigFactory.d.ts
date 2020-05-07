import webpack from 'webpack';
import { Runtime, EnvOptions, ProjectConfig, NormalizedProjectConfig, NormalizedProjectConfigBuilder } from '../';
declare type GetDefaultConfig = (runtime: Runtime, env: EnvOptions, bundleName: string, normalizedProjectConfig: NormalizedProjectConfig) => webpack.Configuration;
export default function makeConfigFactory(getDefaultConfig: GetDefaultConfig): (projectConfig: ProjectConfig) => NormalizedProjectConfigBuilder;
export {};
//# sourceMappingURL=makeConfigFactory.d.ts.map