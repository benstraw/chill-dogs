/// <reference types="astro/client" />

// Fontsource packages ship CSS only, with no type declarations, so a
// side-effect import of one is an error under `astro check` without this.
declare module '@fontsource-variable/*';
declare module '@fontsource/*';
