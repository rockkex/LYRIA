"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { site } from "@/content/site";

export function FaqAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {site.faq.items.map((item, i) => (
        <AccordionItem
          key={i}
          value={`faq-${i}`}
          className="border-line last:border-b"
        >
          <AccordionTrigger className="py-5 text-left font-display text-lg font-normal text-ink hover:no-underline hover:text-ink-soft [&[data-state=open]]:text-ink [&>svg]:text-gold">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="max-w-3xl pb-6 text-[15px] leading-relaxed text-ink-soft">
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
