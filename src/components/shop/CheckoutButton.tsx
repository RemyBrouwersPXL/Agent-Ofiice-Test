"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/store/cart";

/** Posts the cart to /api/checkout, which will return a Stripe Checkout URL in Phase 2. */
export function CheckoutButton() {
  const lines = useCart((s) => s.lines);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [msg, setMsg] = useState("");

  const checkout = async () => {
    setState("loading");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines: lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })) }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error(json.error ?? "Checkout unavailable");
      window.location.assign(json.url);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Checkout unavailable");
      setState("error");
    }
  };

  return (
    <div>
      <Button className="w-full" onClick={checkout} disabled={!lines.length || state === "loading"}>
        {state === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
        Checkout
      </Button>
      {state === "error" && <p className="mt-3 text-center text-sm text-magenta">{msg}</p>}
    </div>
  );
}
