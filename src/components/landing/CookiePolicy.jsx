import React from 'react';

export const CookiePolicyContent = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-primary-dark">Cookie Policy</h3>
    <p className="text-sm text-text-secondary">Last updated: July 2026</p>

    <div>
      <h4 className="font-semibold text-primary-dark">1. What Are Cookies</h4>
      <p className="text-sm">
        Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners. Cookies help us understand how you interact with our platform and improve your experience.
      </p>
    </div>

    <div>
      <h4 className="font-semibold text-primary-dark">2. How We Use Cookies</h4>
      <p className="text-sm">We use cookies for the following purposes:</p>
      
      <p className="text-sm font-medium mt-2">Essential Cookies</p>
      <ul className="list-disc list-inside text-sm space-y-1">
        <li>Authentication - Keep you logged in during your session</li>
        <li>Security - Protect against fraud and unauthorized access</li>
        <li>Session management - Maintain your session state</li>
      </ul>

      <p className="text-sm font-medium mt-2">Functional Cookies</p>
      <ul className="list-disc list-inside text-sm space-y-1">
        <li>Remember your preferences (language, region)</li>
        <li>Remember your login status</li>
        <li>Save your profile information for easy access</li>
      </ul>

      <p className="text-sm font-medium mt-2">Analytics Cookies</p>
      <ul className="list-disc list-inside text-sm space-y-1">
        <li>Track how you use our platform</li>
        <li>Analyze which features are most popular</li>
        <li>Improve user experience based on behavior patterns</li>
        <li>Monitor platform performance</li>
      </ul>

      <p className="text-sm font-medium mt-2">Preference Cookies</p>
      <ul className="list-disc list-inside text-sm space-y-1">
        <li>Store your internship preferences</li>
        <li>Save search filters and settings</li>
        <li>Remember your application history</li>
      </ul>
    </div>

    <div>
      <h4 className="font-semibold text-primary-dark">3. Types of Cookies We Use</h4>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-background-light">
            <th className="border border-border-light px-3 py-2 text-left">Cookie Type</th>
            <th className="border border-border-light px-3 py-2 text-left">Purpose</th>
            <th className="border border-border-light px-3 py-2 text-left">Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-border-light px-3 py-2">session_token</td>
            <td className="border border-border-light px-3 py-2">Authentication</td>
            <td className="border border-border-light px-3 py-2">Session</td>
          </tr>
          <tr>
            <td className="border border-border-light px-3 py-2">user_preferences</td>
            <td className="border border-border-light px-3 py-2">User settings</td>
            <td className="border border-border-light px-3 py-2">1 year</td>
          </tr>
          <tr>
            <td className="border border-border-light px-3 py-2">_ga</td>
            <td className="border border-border-light px-3 py-2">Analytics</td>
            <td className="border border-border-light px-3 py-2">2 years</td>
          </tr>
          <tr>
            <td className="border border-border-light px-3 py-2">_gid</td>
            <td className="border border-border-light px-3 py-2">Analytics</td>
            <td className="border border-border-light px-3 py-2">24 hours</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div>
      <h4 className="font-semibold text-primary-dark">4. Third-Party Cookies</h4>
      <p className="text-sm">
        We may also use third-party services that set their own cookies, including:
      </p>
      <ul className="list-disc list-inside text-sm space-y-1 mt-1">
        <li><strong>Analytics:</strong> We use Google Analytics to understand how users interact with our platform</li>
        <li><strong>CDN:</strong> Content Delivery Networks may set cookies for performance optimization</li>
        <li><strong>Payment Processors:</strong> If we offer paid services (future feature)</li>
      </ul>
    </div>

    <div>
      <h4 className="font-semibold text-primary-dark">5. Cookie Management</h4>
      <p className="text-sm">
        You can manage your cookie preferences in your browser settings. Most browsers allow you to:
      </p>
      <ul className="list-disc list-inside text-sm space-y-1 mt-1">
        <li>View cookies stored on your device</li>
        <li>Delete individual cookies</li>
        <li>Block all or specific cookies</li>
        <li>Set preferences for different websites</li>
      </ul>
      <p className="text-sm mt-2">
        Please note that blocking essential cookies may affect the functionality of our platform. For example, you may need to log in more frequently or lose saved preferences.
      </p>
    </div>

    <div>
      <h4 className="font-semibold text-primary-dark">6. Browser-Specific Instructions</h4>
      <ul className="list-disc list-inside text-sm space-y-1">
        <li><strong>Chrome:</strong> Settings → Privacy and Security → Site Settings → Cookies</li>
        <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
        <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
        <li><strong>Edge:</strong> Settings → Cookies and Site Permissions → Manage Cookies</li>
      </ul>
    </div>

    <div>
      <h4 className="font-semibold text-primary-dark">7. Consent</h4>
      <p className="text-sm">
        By using our platform, you consent to our use of cookies as described in this policy. You can withdraw your consent at any time by:
      </p>
      <ul className="list-disc list-inside text-sm space-y-1 mt-1">
        <li>Deleting cookies from your browser</li>
        <li>Adjusting your browser settings</li>
        <li>Contacting us at privacy@sipp.com</li>
      </ul>
    </div>

    <div>
      <h4 className="font-semibold text-primary-dark">8. Updates to This Policy</h4>
      <p className="text-sm">
        We may update this Cookie Policy from time to time to reflect changes in technology or regulations. We will notify you of significant changes by posting a notice on our platform.
      </p>
    </div>

    <div>
      <h4 className="font-semibold text-primary-dark">9. Contact Us</h4>
      <p className="text-sm">
        If you have questions about our use of cookies, please contact us at:
      </p>
      <ul className="text-sm mt-1">
        <li><strong>Email:</strong> privacy@sipp.com</li>
        <li><strong>Address:</strong> Lagos, Nigeria</li>
      </ul>
    </div>
  </div>
);

export default CookiePolicyContent;