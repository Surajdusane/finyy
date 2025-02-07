import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '../ui/card';

const Faq = () => {
  const faqs = [
    {
      question: 'How secure is my financial data?',
      answer:
        'We prioritize your security by using top-grade encryption protocols to protect your data. Even though we don’t handle payments directly, we ensure the privacy of your transaction records within our platform.',
    },
    {
      question: 'Do I need to enter payment information to use the platform?',
      answer:
        'No, our product is completely free to use. There are no hidden charges or subscription fees, and you don’t need to provide any payment information.',
    },
    {
      question: 'How does the free product work?',
      answer:
        'Our platform offers full access to all core features with no limits or hidden costs. You can start managing your transactions without any restrictions from day one.',
    },
    {
      question: 'Can I upgrade to a premium plan later?',
      answer:
        'At the moment, we offer only a free plan with no premium upgrades. We believe in offering our platform at no cost to users while maintaining all the features you need.',
    },
    {
      question: 'Can I track all types of transactions?',
      answer:
        'Yes! You can track, categorize, and analyze your transactions, from one-time payments to recurring charges, without needing to connect bank accounts or payment gateways.',
    },
    {
      question: 'Is my data backed up?',
      answer:
        'Yes! We regularly back up all user data, ensuring your transaction history is safe and easily retrievable when you need it.',
    },
    {
      question: 'How do I get started?',
      answer:
        'Simply sign up, log in, and start adding and managing your transactions right away. No setup fees or complicated configurations are required!',
    },
  ];

  return (
    <section className="sm:py-2 py-16">
      <Card className="sm:mx-40 mx-8 px-8 py-8 sm:py-16">
        <CardContent className="md:mx-40 sm:mx-8">
          <div className="container">
            <h1 className="mb-4 text-3xl sm:text-center text-left font-semibold md:mb-11 md:text-5xl">
              Frequently asked questions
            </h1>
            {faqs.map((faq, index) => (
              <Accordion key={index} type="single" collapsible>
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger className="hover:text-foreground/60 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default Faq;
