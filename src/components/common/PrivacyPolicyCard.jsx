import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Lock } from "lucide-react";

export default function PrivacyPolicyCard() {
  const [expanded, setExpanded] = useState(false);

  const shortText = (
    <p className="text-gray-700 dark:text-gray-800">
      We collect personal information you provide directly, such as your name, contact details, and investment preferences. We also gather usage data to enhance our services.
    </p>
  );

  const fullText = (
    <>
      <p>We collect personal information you provide directly, such as your name, contact details, and investment preferences. We also gather usage data to enhance our services.</p>
      <p>Your data will never be sold or shared with unauthorized parties.</p>
      <p>You have full control over your data and can request access, correction, or deletion at any time.</p>
      <p>We use cookies to improve your experience and provide analytics.</p>
      <p>If you have any questions or concerns, please contact us.</p>
    </>
  );

  return (
   <Card className="max-w-3xl mx-auto -mt-16 mb-12 p-8 rounded-xl shadow-lg bg-white transform transition-transform duration-300 hover:scale-105">

      <CardHeader className="flex flex-col items-center justify-center space-y-3 pb-6 border-b border-gray-200">
        <Lock className="text-blue-600 w-12 h-12" />
        <CardTitle className="text-3xl font-bold text-center text-gray-900">Privacy Policy</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 text-gray-700 dark:text-gray-800 space-y-4">
        {expanded ? fullText : shortText}
        <div className="flex justify-center mt-6">
          <Button
            variant="link"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 hover:text-blue-800 font-semibold focus:outline-none"
            aria-expanded={expanded}
            aria-label={expanded ? "Show Less Privacy Policy" : "Show More Privacy Policy"}
          >
            {expanded ? "Show Less" : "Show More"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
