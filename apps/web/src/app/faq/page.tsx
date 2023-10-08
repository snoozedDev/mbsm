import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Metadata } from "next";
import React, { ReactNode } from "react";
import { Balancer } from "react-wrap-balancer";

export const metadata: Metadata = {
  title: "FAQ",
  description: "frequently asked questions",
};

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
          {`I'm not trying to compete with any website, I'm just making something for 
          myself to use and won't ever get banned from.`}
        </p>
        <h3 className="text-lg text-foreground font-medium">
          A twitter clone?
        </h3>
        <p>
          {`No, I dislike twitter as it's not suitable
          for content. Twitter is flawed from a fundamental level, so anything
          designed to be like Twitter will also be flawed.`}
        </p>
        <h3 className="text-lg text-foreground font-medium">
          A tumblr clone, then?
        </h3>
        <p>
          {`Kinda, I personally think tumblr is the best social media platform
          ever made. So I'm making my own and taking some creative liberties.`}
        </p>
      </React.Fragment>
    ),
  },
  {
    question: "Fediverse?",
    answer: (
      <React.Fragment>
        <p>
          {`I like the idea of federated social media, but that's not my priority right now.
          I may add mastodon support in the future since I'd personally like to
          use my site as a feed.`}
        </p>
      </React.Fragment>
    ),
  },
  {
    question: "I want to join, how?",
    answer: (
      <React.Fragment>
        <p>{`Get an invite code from someone who's already using the site.`}</p>
        <p>
          {`Please understand that allowing anyone to join would involve a lot of
          technical work and moderation, so I'm not ready for that yet.`}
        </p>
      </React.Fragment>
    ),
  },
  {
    question: "Why no passwords?",
    answer: (
      <React.Fragment>
        <p>{`I hate passwords and prefer to have passkeys as the only way to authenticate.`}</p>
        <h3 className="text-lg text-foreground font-medium">
          What if I lose my passkey?
        </h3>
        <p>{`You should have more than 1 passkey associated to your account, ideally 3.`}</p>
        <h3 className="text-lg text-foreground font-medium">
          Will my account be compromised if I lose my passkey?
        </h3>
        <p>{`Passkeys ask for a pin or biometric authentication before they can be used. So
            unless you're using a really weak pin, your account should be safe.`}</p>
        <p>{`You can always remove the passkey from your account if you're worried.`}</p>
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
