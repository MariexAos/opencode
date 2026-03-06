import { describe, expect, test } from "bun:test"
import { ModelsDev } from "../../src/provider/models"

describe("ModelsDev.refresh", () => {
  test("does not fetch from network and returns ok: false", async () => {
    const fetchCalls: string[] = []
    const originalFetch = global.fetch
    global.fetch = async (input: RequestInfo | URL) => {
      fetchCalls.push(typeof input === "string" ? input : input.toString())
      return originalFetch(input as any)
    }

    try {
      const result = await ModelsDev.refresh()
      expect(result.ok).toBe(false)
      expect(result.reason).toContain("disabled")
      expect(fetchCalls.filter((u) => u.includes("models.dev"))).toHaveLength(0)
    } finally {
      global.fetch = originalFetch
    }
  })

  test("refresh returns reason string", async () => {
    const result = await ModelsDev.refresh()
    expect(typeof result.reason).toBe("string")
    expect(result.reason.length).toBeGreaterThan(0)
  })
})

describe("ModelsDev.get", () => {
  test("does not fetch from network when snapshot or cache provides data", async () => {
    const fetchCalls: string[] = []
    const originalFetch = global.fetch
    global.fetch = async (input: RequestInfo | URL) => {
      fetchCalls.push(typeof input === "string" ? input : input.toString())
      return originalFetch(input as any)
    }

    try {
      await ModelsDev.get()
      expect(fetchCalls.filter((u) => u.includes("models.dev"))).toHaveLength(0)
    } finally {
      global.fetch = originalFetch
    }
  })
})
