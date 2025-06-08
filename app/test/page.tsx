"use client"

import { Button } from "@/components/ui/button"

export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Button Test</h1>
      <Button onClick={() => console.log("Test button clicked!")}>
        Click Me
      </Button>
    </div>
  )
}