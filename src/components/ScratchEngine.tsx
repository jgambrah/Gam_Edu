
'use client';

// This is a placeholder for the ScratchEngine component.
// The original component was causing a server-side rendering error due to p5.js.
// This simplified version allows the rest of the application to load correctly.

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ScratchEnginePlaceholder() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scratch Engine Placeholder</CardTitle>
      </CardHeader>
      <CardContent>
        <p>The Scratch Engine component is currently disabled to resolve a rendering issue.</p>
        <p>The original code is safe, and we can restore it once the routing is stable.</p>
      </CardContent>
    </Card>
  );
}
