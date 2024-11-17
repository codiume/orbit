import type { AstroConfig, AstroIntegration } from 'astro';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PurgeCSS, type UserDefinedOptions } from 'purgecss';

import {
  generateFileHash,
  readFileContent,
  success,
  writeCssFile,
  writeFileContent
} from './utils';

/**
 * Extended PurgeCSS options interface that allows partial configuration
 * of the standard PurgeCSS options
 */
export interface PurgeCSSOptions extends Partial<UserDefinedOptions> {}

const INTEGRATION_NAME = 'astro-purgecss' as const;

const defaultExtractor = (content: string) =>
  content.match(/[\w-/:]+(?<!:)/g) || [];
/**
 * Astro integration for PurgeCSS that removes unused CSS from the final build
 * @param options - PurgeCSS configuration options
 * @returns AstroIntegration - The configured Astro integration
 */
function Plugin(options: PurgeCSSOptions = {}): AstroIntegration {
  let config: AstroConfig;

  return {
    name: INTEGRATION_NAME,
    hooks: {
      'astro:config:done': ({ config: cfg, logger }) => {
        config = cfg;
      },
      'astro:build:done': async ({ dir, pages, logger }) => {
        const buildMode = config.output;
        logger.info(`📦 Running in '${buildMode}' mode`);

        // Convert the URL to a filesystem path
        const outDir = fileURLToPath(dir);

        // Skip file rehashing for SSR/Hybrid modes
        const isSSR = buildMode !== 'static';

        // Validate required Astro configuration
        if (!outDir || !config.build.format || !config.build.assets) {
          logger.warn(
            `${INTEGRATION_NAME} requires the following astro.config options: 'outDir', 'build.format', 'build.assets'`
          );
          return;
        }

        // Run PurgeCSS on all CSS files
        const purgeResults = await new PurgeCSS().purge({
          css: [join(outDir, '/**/*.css')],
          // default extractor to handle various CSS selector patterns
          defaultExtractor,
          ...options,
          content: [
            join(outDir, '/**/*.html'),
            join(outDir, '/**/*.js'),
            ...(options.content || [])
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

        // Handle SSR/Hybrid mode
        if (isSSR) {
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

            // Skip rehashing for non-asset files
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
                if (content.includes(oldFilename)) {
                  content = content.replace(
                    new RegExp(oldFilename, 'g'),
                    newFilename
                  );
                }
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
