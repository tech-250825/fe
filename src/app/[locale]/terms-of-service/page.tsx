"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "@/i18n/routing";

export default function TermsOfServicePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Terms of Service
          </h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="bg-card p-6 rounded-lg border space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using our AI video and image generation service, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, you should not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
            <p className="text-muted-foreground">
              Our service provides AI-powered video and image generation tools. We use advanced artificial intelligence to create content based on user prompts and inputs. The service is provided "as is" and we make no warranties about the availability, reliability, or quality of the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
            <p className="text-muted-foreground">
              To use our service, you must create an account using Google OAuth. You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Acceptable Use</h2>
            <p className="text-muted-foreground mb-2">
              You agree noti to use our service to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Generate content that is illegal, harmful, threatening, defamatory, or obscene</li>
              <li>Create content that infringes on intellectual property rights</li>
              <li>Generate content that violates any applicable laws or regulations</li>
              <li>Generate deepfake content that misuses the likeness, voice, or dentity of any individual without their explicit consent</li>
              <li>Attempt to reverse engineer or hack our systems</li>
              <li>Use the service for commercial purposes without authorization</li>
            </ul>
          </section>


          <section>
            <h2 className="text-xl font-semibold mb-3">5. Age Restrictions</h2>
            <p className="text-muted-foreground">
              Our service is intended for users who are 19 years of age or older. By using our service, you represent that you meet this age requirement. We may implement age verification procedures to ensure compliance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Content Ownership</h2>
            <p className="text-muted-foreground">
              You retain ownership of content you create using our service. However, by using our service, you grant us a non-exclusive, royalty-free license to use, display, and distribute your content for the purpose of providing and improving our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Credits and Payment</h2>
            <p className="text-muted-foreground">
              Our service operates on a credit-based system. Credits are required to generate content. All credit purchases are final and non-refundable unless required by law. We reserve the right to change our pricing at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Privacy</h2>
            <p className="text-muted-foreground">
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              We shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Modifications to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new terms on our website. Your continued use of the service after such modifications constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">11. Termination</h2>
            <p className="text-muted-foreground">
              We may terminate or suspend your account and access to our service immediately, without prior notice, for any reason, including if you breach these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">12. Contact Information</h2>
            <p className="text-muted-foreground">
              If you have any questions about these Terms of Service, please contact us through our support channels.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}