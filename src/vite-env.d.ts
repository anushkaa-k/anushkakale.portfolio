/// <reference types="vite/client" />

/* YAML files are imported for their data and validated at runtime by
   src/content/schema.ts, so `unknown` is the honest type here — it forces
   every import through the validator before anything reads a field. */
declare module '*.yaml' {
  const data: unknown
  export default data
}
