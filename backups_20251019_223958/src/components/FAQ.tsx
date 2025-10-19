"use client";
import React from "react";
import { FAQ } from "@/content/faq";

export default function FAQBlock() {
  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Questions fréquentes</h2>
      <div className="space-y-3">
        {FAQ.map((item, i) => (
          <details key={i} className="border rounded p-3">
            <summary className="font-medium cursor-pointer">{item.q}</summary>
            <p className="mt-2 text-gray-700">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
