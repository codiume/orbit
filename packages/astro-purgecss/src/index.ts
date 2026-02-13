import type { AstroConfig, AstroIntegration } from 'astro';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { PurgeCSS, type UserDefinedOptions, type RawContent } from 'purgecss';

import {
  cleanPath,
  generateFileHash,
  readFileContent,
  success,
  writeCssFile,
  writeFileContent
} from './utils';

type PurgeStrategy = 'default' | 'cache-buster';

/**
 * Extended PurgeCSS options interface that allows partial configuration
 * of the standard PurgeCSS options
 */
export interface PurgeCSSOptions extends Partial<UserDefinedOptions> {
  strategy?: PurgeStrategy;
  /**
   * ⚠️ UNSAFE: Completely overrides the default content globs.
   * When provided, only these content sources will be scanned by PurgeCSS.
   * The default globs (outDir/**\/*.html and outDir/**\/*.js) will be ignored.
   *
   * Use this ONLY if the default globs cause performance issues on very large sites.
   * The double underscore prefix indicates this is an advanced option that should
   * be used with extreme caution.
   *
   * @example
   * ```ts
   * {
   *   __unsafeContent: [
   *     './dist/**\/*.js',
   *     './src/**\/*.{astro,vue,jsx,tsx}'
   *   ]
   * }
   * ```
   */
  __unsafeContent?: Array<string | RawContent>;
}

const INTEGRATION_NAME = 'astro-purgecss' as const;

/**
 * default extractor to handle various CSS selector patterns
 * @param content string
 */
const defaultExtractor = (content: string) =>
  content.match(/[\w-/:\.#\(\),';%]+(?<!:)/g) || [];

/**
 * Astro integration for PurgeCSS that removes unused CSS from the final build
 * @param options - PurgeCSS configuration options
 * @returns AstroIntegration - The configured Astro integration
 */
function Plugin(options: PurgeCSSOptions = {}): AstroIntegration {
  let config: AstroConfig;
  const { strategy = 'default', __unsafeContent, ...purgecssOptions } = options;

  return {
    name: INTEGRATION_NAME,
    hooks: {
      'astro:config:done': ({ config: cfg }) => {
        config = cfg;
      },
      ...(strategy === 'cache-buster' && {
        'astro:build:setup': ({ vite, logger }) => {
          if (!vite.plugins) vite.plugins = [];
          vite.plugins.push({
            name: 'inject-css-cache-buster',
            apply: 'build',
            enforce: 'pre',
            transform(code, id) {
              if (!/\.(css|scss|sass|less|styl)(\?|$)/.test(id)) {
                return null;
              }
              logger.info(`Injecting cache-buster CSS into: ${id}`);
              return {
                code: `/*! Build: ${randomUUID().slice(0, 8)} */\n` + code,
                map: null
              };
            }
          });
        }
      }),
      'astro:build:done': async ({ dir, pages, logger }) => {
        const buildMode = config.output;
        logger.info(`📦 Running in '${buildMode}' mode`);

        // Convert the URL to a filesystem path
        const outDir = cleanPath(dir);

        // skip file rehashing for SSR/Server mode or cache-buster strategy
        const skipRehash =
          buildMode !== 'static' || strategy === 'cache-buster';

        // Validate required Astro configuration
        if (!outDir || !config.build.format || !config.build.assets) {
          logger.warn(
            `${INTEGRATION_NAME} requires the following astro.config options: 'outDir', 'build.format', 'build.assets'`
          );
          return;
        }

        // Run PurgeCSS on all CSS files
        const purgeResults = await new PurgeCSS().purge({
          css: [`${outDir}/**/*.css`.replace(/\\/g, '/')],
          defaultExtractor,
          ...purgecssOptions,
          content: __unsafeContent ?? [
            `${outDir}/**/*.html`.replace(/\\/g, '/'),
            `${outDir}/**/*.js`.replace(/\\/g, '/'),
            ...(purgecssOptions.content || [])
          ]
        });

        // Filter out non-CSS files from purge results
        const purgedCssFiles = purgeResults.filter(({ file }) =>
          file?.endsWith('.css')
        ) as Array<{
          css: string;
          file: string;
        }>;

        if (purgedCssFiles.length === 0) {
          logger.info('ℹ️  No CSS files found to process');
          return;
        }

        logger.info(
          `Found ${purgedCssFiles.length} CSS ${purgedCssFiles.length === 1 ? 'file' : 'files'} to process`
        );

        // If SSR/Server mode or cache-buster strategy skip file rehash
        if (skipRehash) {
          await Promise.all(
            purgedCssFiles.map(async ({ css, file }) => {
              await writeCssFile(file, css, file);
              success(file.replace(outDir, ''));
            })
          );
          logger.info('🎉 Purging completed successfully!');
          return;
        }

        // Process files for static mode with content hashing
        let processedFiles = await Promise.all(
          purgedCssFiles.map(async ({ css, file }) => {
            const isAssetFile = file.includes(config.build.assets);

            // Skip rehashing for non-asset files (not generated by astro)
            // ex: assets/styles/light.css
            if (!isAssetFile) {
              await writeCssFile(file, css, file);
              const relativePath = file.replace(outDir, '');
              success(relativePath);
              return {
                oldFilename: relativePath,
                newFilename: relativePath
              };
            }

            // Generate new filename with content hash
            const hashedFilename = generateFileHash(file, css);
            await writeCssFile(hashedFilename, css, file);

            const relativeOldPath = file.replace(outDir, '');
            const relativeNewPath = hashedFilename.replace(outDir, '');
            success(relativeNewPath);

            return {
              oldFilename: relativeOldPath,
              newFilename: relativeNewPath
            };
          })
        );

        // Filter to only get files that actually changed
        const changedFiles = processedFiles.filter(
          ({ oldFilename, newFilename }) => oldFilename !== newFilename
        );

        if (changedFiles.length > 0) {
          logger.info(
            `Updating ${changedFiles.length} CSS ${changedFiles.length === 1 ? 'reference' : 'references'} in HTML files...`
          );
          // Get all HTML pages based on build format
          const htmlFiles = pages
            .filter((page) => typeof page.pathname === 'string')
            .map((page) => {
              const pathname = page.pathname as string;

              // Handle root/index page
              if (pathname === '') {
                return join(outDir, 'index.html');
              }

              /**
               * Custom 404 Error Page
               *
               * @see https://docs.astro.build/en/basics/astro-pages/#custom-404-error-page
               */
              if (pathname === '404/' || pathname === '404') {
                return join(outDir, '404.html');
              }

              /**
               * Custom 500 Error Page
               *
               * @see https://docs.astro.build/en/basics/astro-pages/#custom-500-error-page
               */
              if (pathname === '500/' || pathname === '500') {
                return join(outDir, '500.html');
              }

              switch (config.build.format) {
                case 'file':
                  // Format: /blog -> /blog.html
                  return join(outDir, `${pathname}.html`);

                case 'directory':
                  // Format: /blog -> /blog/index.html
                  return join(outDir, pathname, 'index.html');

                case 'preserve':
                  // Check if direct HTML file exists, otherwise use directory format
                  const directFile = join(outDir, `${pathname}.html`);
                  return existsSync(directFile)
                    ? directFile
                    : join(outDir, pathname, 'index.html');
              }
            });

          // Update CSS references in HTML files
          await Promise.all(
            htmlFiles.map(async (htmlFile) => {
              let content = await readFileContent(htmlFile);

              for (const { oldFilename, newFilename } of changedFiles) {
                const normalizedOldPath = oldFilename.replace(/\\/g, '/');
                const normalizedNewPath = newFilename.replace(/\\/g, '/');

                content = content.replace(
                  new RegExp(normalizedOldPath, 'g'),
                  normalizedNewPath
                );
              }

              await writeFileContent(htmlFile, content);
              success(htmlFile.replace(outDir, ''));
            })
          );
        }

        logger.info('🎉 Purging completed successfully!');
      }
    }
  };
}

export default Plugin;
