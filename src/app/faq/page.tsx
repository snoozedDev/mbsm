import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { UserPing } from "@/components/user-ping";
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
          the current social media landscape, so I'm making my own.`}
        </p>
        <p>
          {`I'm not trying to compete with anyone, I'm just making something that
          I'd like to use and won't be banned from.`}
        </p>
      </React.Fragment>
    ),
  },
  {
    question: "I want to join, how?",
    answer: (
      <React.Fragment>
        <p>
          {`You can't for now, I'm still working on it. But you can follow me on 
        twitter `}
          <a className="underline" href="https://twitter.com/foru_rune">
            @foru_rune
          </a>
          {` and I'll announce when it's ready.`}
        </p>
        <p>
          {`Please understand that allowing anyone to join would involve a lot of
          technical work and moderation, so I'm not ready for that yet.`}
        </p>
      </React.Fragment>
    ),
  },
  {
    question: "Is this a twitter clone?",
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
    question: "Is this a tumblr clone, then?",
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
    question: '"omg the site is slow!!!"',
    answer: (
      <React.Fragment>
        <p>
          {`Maybe, you currently have `}
          <span className="underline">
            <UserPing />
          </span>
          {` ms ping to the server. I'm not focused on having a distributed
          network of servers yet, so I'm not worried about it.`}
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
  // {
  //   question: "Are you gonna sell this?",
  //   answer: (
  //     <React.Fragment>
  //       <p>
  //         {`I like money so I'll never say never, but I'll make everything open-source
  //         if I do. That's a promise and I know WayBackMachine exists to keep these
  //         in check.`}
  //       </p>
  //     </React.Fragment>
  //   ),
  // },
];

const FAQ = () => {
  return (
    <main className="flex flex-col items-center py-16 px-4">
      <h1 className="text-3xl text-center self-stretch">
        <Balancer>Frequently Asked Questions</Balancer>
      </h1>
      <div className="max-w-lg w-full my-12">
        <Accordion type="single" collapsible className="w-full">
          {Object.entries(faq).map(([i, { question, answer }]) => (
            <AccordionItem key={i} value={`${i}`}>
              <AccordionTrigger className="text-xl text-left">
                {question}
              </AccordionTrigger>
              <AccordionContent className="text-base">
                <div className="space-y-2">{answer}</div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </main>
  );
};

export default FAQ;
