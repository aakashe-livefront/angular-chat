// Define the type of the environment variables.
declare interface Env {
  readonly NODE_ENV: string;
  // OpenRouter environment variables
  readonly NG_APP_OPENROUTER_API_KEY: string;
  readonly NG_APP_OPENROUTER_MODEL: string;
  [key: string]: any;
}

declare interface ImportMeta {
  readonly env: Env;
}

declare const _NGX_ENV_: Env;

// 3. Use process.env.YOUR_ENV_VAR in your code. (deprecated)
declare namespace NodeJS {
  export interface ProcessEnv extends Env {}
}
