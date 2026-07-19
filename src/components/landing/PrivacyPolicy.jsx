import React from 'react';

export const PrivacyPolicyContent = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-primary-dark">Privacy Policy</h3>
    <p className="text-sm text-text-secondary">Last updated: July 2026</p>

    <div>
      <h4 className="font-semibold text-primary-dark">1. Introduction</h4>
      <p className="text-sm">
        Welcome to SIPP (Student Internship Placement Platform). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
      </p>
    </div>

    <div>
      <h4 className="font-semibold text-primary-dark">2. Information We Collect</h4>
      <p className="text-sm font-medium mt-1">We collect information that you provide directly to us:</p>
      <ul className="list-disc list-inside text-sm space-y-1 mt-1">
        <li><strong>Account Information:</strong> Name, email address, phone number, and password</li>
        <li><strong>Student Profile:</strong> University, faculty, department, level, skills, interests, and career aspirations</li>
        <li><strong>Company Profile:</strong> Company name, industry, location, and company description</li>
        <li><strong>Application Data:</strong> Cover letters, application status, and internship preferences</li>
        <li><strong>Usage Data:</strong> How you interact with our platform, including pages visited and features used</li>
      </ul>
    </div>

    <div>
      <h4 className="font-semibold text-primary-dark">3. How We Use Your Information</h4>
      <ul className="list-disc list-inside text-sm space-y-1">
        <li>To create and manage your account</li>
        <li>To match students with suitable internships based on skills and interests</li>
        <li>To facilitate communication between students and companies</li>
        <li>To process applications and track their status</li>
        <li>To send notifications about application updates</li>
        <li>To improve our platform and user experience</li>
        <li>To comply with legal obligations</li>
      </ul>
    </div>

    <div>
      <h4 className="font-semibold text-primary-dark">4. Information Sharing</h4>
      <p className="text-sm">
        We share your information only in the following circumstances:
      </p>
      <ul className="list-disc list-inside text-sm space-y-1 mt-1">
        <li><strong>With Companies:</strong> When you apply to an internship, your profile information is shared with the company</li>
        <li><strong>With Students:</strong> Companies can view student profiles when applications are submitted</li>
        <li><strong>Service Providers:</strong> We use third-party services for email delivery, cloud storage, and analytics</li>
        <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
      </ul>
    </div>

    <div>
      <h4 className="font-semibold text-primary-dark">5. Data Security</h4>
      <p className="text-sm">
        We implement appropriate technical and organizational measures to protect your personal information, including:
      </p>
      <ul className="list-disc list-inside text-sm space-y-1 mt-1">
        <li>Encryption of data in transit and at rest</li>
        <li>Secure authentication and access controls</li>
        <li>Regular security assessments and monitoring</li>
        <li>Limited access to personal data by authorized personnel only</li>
      </ul>
    </div>

    <div>
      <h4 className="font-semibold text-primary-dark">6. Your Rights</h4>
      <p className="text-sm">You have the right to:</p>
      <ul className="list-disc list-inside text-sm space-y-1 mt-1">
        <li>Access your personal information</li>
        <li>Correct inaccurate information</li>
        <li>Delete your account and associated data</li>
        <li>Withdraw consent for data processing</li>
        <li>Opt-out of marketing communications</li>
      </ul>
    </div>

    <div>
      <h4 className="font-semibold text-primary-dark">7. Data Retention</h4>
      <p className="text-sm">
        We retain your personal information for as long as your account is active or as needed to provide you with our services. We may retain and use your information to comply with legal obligations, resolve disputes, and enforce our agreements.
      </p>
    </div>

    <div>
      <h4 className="font-semibold text-primary-dark">8. Cookies</h4>
      <p className="text-sm">
        We use cookies and similar tracking technologies to enhance your experience, analyze usage, and personalize content. You can manage cookie preferences in your browser settings. For more details, please see our <button onClick={() => document.dispatchEvent(new CustomEvent('openCookiePolicy'))} className="text-primary hover:underline">Cookie Policy</button>.
      </p>
    </div>

    <div>
      <h4 className="font-semibold text-primary-dark">9. Children's Privacy</h4>
      <p className="text-sm">
        Our platform is not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If we become aware that we have collected such information, we will take steps to delete it.
      </p>
    </div>

    <div>
      <h4 className="font-semibold text-primary-dark">10. Changes to This Policy</h4>
      <p className="text-sm">
        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
      </p>
    </div>

    <div>
      <h4 className="font-semibold text-primary-dark">11. Contact Us</h4>
      <p className="text-sm">
        If you have questions about this Privacy Policy, please contact us at:
      </p>
      <ul className="text-sm mt-1">
        <li><strong>Email:</strong> privacy@sipp.com</li>
        <li><strong>Address:</strong> Lagos, Nigeria</li>
      </ul>
    </div>
  </div>
);

export default PrivacyPolicyContent;