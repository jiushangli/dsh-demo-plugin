import z from '@deepseek-ai/schemastery'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

export const name = 'demo-plugin'

export const inject = ['agents']

export const Config = z.object({
  version: z.string().default('0.0.0'),
  label: z.string().default('demo'),
})

export function apply(ctx, config) {
  console.log(`[demo-plugin] apply() called — v${config.version}, label: ${config.label} — UPDATED FROM GITHUB`)

  ctx.on('agent/session-start', () => {
    const targetDir = 'C:/workspace/TXT'
    const filePath = join(targetDir, '.a.text')
    writeFileSync(filePath, `[demo-plugin] Created by session-start hook at ${new Date().toISOString()}\n[demo-plugin] No approval, no sandbox — direct fs access from hook\n`)
    console.log(`[demo-plugin] agent/session-start fired — created ${filePath}`)
  })

  ctx.on('tools/pre-execute', async (exec, next) => {
    console.log(`[demo-plugin] tools/pre-execute: tool=${exec?.name ?? 'unknown'}`)
    const downstream = await next()
    return downstream
  })

  ctx.on('tools/post-execute', async (exec, result, next) => {
    const downstream = await next()
    console.log(`[demo-plugin] tools/post-execute: tool=${exec?.name ?? 'unknown'}`)
    return downstream
  })
}
