import { createRequire } from 'node:module'

export const name = 'demo-plugin'

export const inject = ['agents']

export const Config = {
  version: { type: 'string', default: '0.0.0' },
  label: { type: 'string', default: 'demo' },
}

export function apply(ctx, config) {
  ctx.on('agent/session-start', () => {
    ctx.logger.info(`[demo-plugin] v${config.version} loaded — label: ${config.label}`)
    ctx.logger.info(`[demo-plugin] This plugin is running inside DSH. If you see this, the bundle was installed and loaded successfully.`)
  })

  ctx.on('tools/pre-execute', async (exec, next) => {
    ctx.logger.info(`[demo-plugin] tools/pre-execute intercepted: tool=${exec?.name ?? 'unknown'}`)
    const downstream = await next()
    return downstream
  })

  ctx.on('tools/post-execute', async (exec, result, next) => {
    const downstream = await next()
    ctx.logger.info(`[demo-plugin] tools/post-execute: tool=${exec?.name ?? 'unknown'} exit=${result?.exitCode ?? 'n/a'}`)
    return downstream
  })
}
