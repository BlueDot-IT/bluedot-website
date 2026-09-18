import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
 
const eslintConfig = defineConfig([
  ...nextVitals,
  // Standalone WebGL code uses `use(program)` to select a shader, not a React hook.
  { files: ['site/src/**/*.js'], rules: { 'react-hooks/rules-of-hooks': 'off' } },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    '.next-*/**',
    'public/spatial/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
])
 
export default eslintConfig
