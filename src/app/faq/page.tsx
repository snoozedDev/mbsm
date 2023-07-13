import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React, { ReactNode } from "react";
import { Balancer } from "react-wrap-balancer";

const faq: {
  question: ReactNode;
  answer: ReactNode;
}[] = [
  {
    question: "What is this?",
    answer: (
      <React.Fragment>
        <p>
          {`A social media platform which I'm making for myself. I'm not a fan of
          the current offerings, so I'm making my own from scratch.`}
        </p>
        <p>
          {`I'm not trying to compete with anyone, I'm just making something that
          I'd like to use and won't ever get banned from.`}
        </p>
      </React.Fragment>
    ),
  },
  {
    question: "A twitter clone?",
    answer: (
      <React.Fragment>
        <p>
          No, this is a digital product made for myself with a very specific
          vision.
        </p>
        <p>
          Twitter is optimized for engagement. This is optimized for content.
        </p>
      </React.Fragment>
    ),
  },
  {
    question: "A tumblr clone, then?",
    answer: (
      <React.Fragment>
        <p>
          {`Kinda, I personally think tumblr is the best social media platform
          ever made. So I'm taking a lot of inspiration from it.`}
        </p>
        <p>
          {`But some guys in suits bought tumblr and ruined it `}
          <span className="text-muted-foreground text-sm">(no porn lmao)</span>
          {`, so I'm making my own
          version and taking some creative liberties.`}
        </p>
      </React.Fragment>
    ),
  },
  {
    question: "Fediverse?",
    answer: (
      <React.Fragment>
        <p>
          {`I like federated social media, but that's not my priority right now.
          I'll probably add mastodon support in the future since I'd like to
          use my site as a feed for myself.`}
        </p>
      </React.Fragment>
    ),
  },
  {
    question: "I want to join, how?",
    answer: (
      <React.Fragment>
        <p>
          {`You can't for now, I'm still working on it. But you can follow me here
           or on my other linked socials and I'll announce when it's ready.`}
        </p>
        <p>
          {`Please understand that allowing anyone to join would involve a lot of
          technical work and moderation, so I'm not ready for that yet.`}
        </p>
      </React.Fragment>
    ),
  },
];

const FAQ = () => {
  return (
    <main className="flex flex-col items-center py-16 px-4 max-w-2xl w-full self-center">
      <h1 className="text-3xl text-center self-stretch">
        <Balancer>Frequently Asked Questions</Balancer>
      </h1>
      <div className="w-full my-12">
        <Accordion type="single" collapsible className="w-full">
          {Object.entries(faq).map(([i, { question, answer }]) => (
            <AccordionItem key={i} className="first:border-t" value={`${i}`}>
              <AccordionTrigger className="text-xl text-left">
                {question}
              </AccordionTrigger>
              <AccordionContent className="text-base">
                <div className="space-y-2 text-muted-foreground p-2">
                  {answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </main>
  );
};

export default FAQ;
