#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const host = 'bluedot.it.com'
const origin = `https://${host}`
const key = readFileSync(resolve(process.cwd(), 'public/indexnow.txt'), 'utf8').trim()

const defaultUrls = [
  `${origin}/`,
  `${origin}/services`,
  `${origin}/about`,
  `${origin}/projects`,
  `${origin}/open-source`,
  `${origin}/blog`,
  `${origin}/contact`,
  `${origin}/security`,
  `${origin}/services/security-reviews`,
  `${origin}/services/server-hardening`,
  `${origin}/services/nextjs-security-hardening`,
  `${origin}/services/workflow-automation`,
  `${origin}/services/mcp-security-consulting`,
  `${origin}/services/ai-security-tooling`,
  `${origin}/services/full-stack-development`,
]

const urlList = process.argv.slice(2)
const body = {
  host,
  key,
  keyLocation: `${origin}/indexnow.txt`,
  urlList: urlList.length > 0 ? urlList : defaultUrls,
}

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body),
})

const text = await response.text()
console.log(`IndexNow status: ${response.status} ${response.statusText}`)
if (text) console.log(text)

if (!response.ok && response.status !== 202) {
  process.exitCode = 1
}
