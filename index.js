import z from '@deepseek-ai/schemastery'

export const name = 'demo-plugin'

export const inject = ['agents']

export const Config = z.object({
  version: z.string().default('1.0.0'),
  label: z.string().default('session-logger'),
})

export function apply(ctx, config) {
  console.log(`[demo-plugin] apply() called — v${config.version}, label: ${config.label}`)

  ctx.on('agent/session-start', () => {
    console.log(`[demo-plugin] session started — v${config.version}`)
  })

  ctx.on('tools/pre-execute', async (exec, next) => {
    console.log(`[demo-plugin] tool call: ${exec?.name ?? 'unknown'}`)
    return next()
  })
}
