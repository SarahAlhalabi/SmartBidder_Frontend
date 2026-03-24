import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { CheckCircle2 } from "lucide-react"; 

export default function TermsAndConditionsCard() {
  const [expanded, setExpanded] = useState(false);

  const shortText = (
    <p className="text-gray-700 dark:text-gray-800">
      You agree to use Smart Bidder for lawful purposes only and in a manner that does not infringe the rights of others.
    </p>
  );

  const fullText = (
    <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-800">
      <li>You agree to use Smart Bidder for lawful purposes only and in a manner that does not infringe the rights of others.</li>
      <li>All content provided on Smart Bidder is for informational purposes. We do not guarantee the accuracy or completeness of any information.</li>
      <li>Smart Bidder is not responsible for any investment decisions made based on the information provided on our platform.</li>
      <li>We reserve the right to modify or terminate Smart Bidder at any time without notice.</li>
      <li>By using Smart Bidder, you agree to our Privacy Policy.</li>
    </ul>
  );

  return (
    <Card id = "terms" className="max-w-3xl mx-auto my-12 p-8 rounded-xl shadow-lg bg-white transform transition-transform duration-300 hover:scale-105">
      <CardHeader className="flex flex-col items-center justify-center space-y-3 pb-6 border-b border-gray-200">
        <CheckCircle2 className="text-green-500 w-12 h-12" />
        <CardTitle className="text-3xl font-bold text-center text-gray-900">Terms and Conditions</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {expanded ? fullText : shortText}
        <div className="flex justify-center mt-6">
          <Button
            variant="link"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 hover:text-blue-800 font-semibold focus:outline-none"
            aria-expanded={expanded}
            aria-label={expanded ? "Show Less Terms and Conditions" : "Show More Terms and Conditions"}
          >
            {expanded ? "Show Less" : "Show More"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
