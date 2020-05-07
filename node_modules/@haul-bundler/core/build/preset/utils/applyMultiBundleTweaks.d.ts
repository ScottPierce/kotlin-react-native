import webpack from 'webpack';
import { EnvOptions, NormalizedBundleConfig, NormalizedTemplatesConfig } from '../../config/types';
export declare function getBundleFilename(env: EnvOptions, templatesConfig: NormalizedTemplatesConfig, bundleConfig: NormalizedBundleConfig): string;
export default function applyMultiBundleTweaks(env: EnvOptions, templatesConfig: NormalizedTemplatesConfig, bundleConfig: NormalizedBundleConfig, webpackConfig: webpack.Configuration, normalizedBundleConfigs: {
    [bundleName: string]: NormalizedBundleConfig;
}): void;
//# sourceMappingURL=applyMultiBundleTweaks.d.ts.map