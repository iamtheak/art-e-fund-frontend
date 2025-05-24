import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const getFAQItems = async (): Promise<FAQProps[]> => {
  // Placeholder data, replace with actual data fetching logic
  return Promise.resolve([
    {
      question: "What is Art-E Fund?",
      answer:
        "Art-E Fund is a crowdfunding platform specifically designed to support and empower creators in Nepal. It provides a space for artists, musicians, filmmakers, writers, and other creative individuals to raise funds for their projects and connect with a supportive community.",
      value: "item-1",
    },
    {
      question: "Who can create a campaign on Art-E Fund?",
      answer:
        "Any creator based in Nepal or of Nepali origin with a specific project or creative endeavor can apply to start a campaign. We welcome a wide range of creative fields.",
      value: "item-2",
    },
    {
      question: "How does Art-E Fund ensure the legitimacy of projects?",
      answer:
        "We have a review process for all submitted projects to ensure they meet our guidelines and are legitimate creative endeavors. We encourage creators to be transparent and provide detailed information about their projects.",
      value: "item-3",
    },
    {
      question: "What are the fees for using Art-E Fund?",
      answer:
        "Art-E Fund charges a small platform fee on successfully funded projects to cover operational costs. Payment processing fees may also apply. We strive to keep our fees competitive and transparent.",
      value: "item-4",
    },
    {
      question: "How can I support a creator on Art-E Fund?",
      answer:
        "You can support creators by browsing active campaigns and making a donation to the projects you believe in. Many campaigns also offer unique rewards or perks for different contribution levels.",
      value: "item-5",
    },
  ]);
};

export const FAQ = async () => {
  const faqList = await getFAQItems();

  return (
    <section id="faq" className="container py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Frequently Asked{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Questions
        </span>
      </h2>

      <Accordion type="single" collapsible className="w-full AccordionRoot">
        {faqList.map(({ question, answer, value }: FAQProps) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>
            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

    </section>
  );
};