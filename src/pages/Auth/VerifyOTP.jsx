import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Mail } from 'lucide-react';
import Container from '../../components/common/Container';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'student'; // Default to student if no role specified
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const numbers = paste.replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < numbers.length; i++) {
      newOtp[i] = numbers[i];
    }
    setOtp(newOtp);
    const nextIndex = Math.min(numbers.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate based on role
    if (role === 'company') {
      navigate('/company');
    } else {
      navigate('/student');
    }
  };

  const handleResend = () => {
    // Simulate resend
    console.log('OTP resent');
  };

  return (
    <section className="min-h-screen flex items-center justify-center py-20 bg-gradient-hero">
      <Container>
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card variant="bordered" padding="lg" className="shadow-strong">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-primary-dark">Verify Your Account</h1>
                <p className="text-text-secondary mt-2 text-sm">
                  We've sent a 6-digit verification code to your email
                </p>
                <div className="flex items-center justify-center mt-2 text-sm text-text-secondary">
                  <Mail className="w-4 h-4 mr-1" />
                  <span>info@sipp.curriumx.online</span>
                </div>
                <div className="mt-2 text-xs text-text-muted">
                  {role === 'company' ? 'Creating company account...' : 'Creating student account...'}
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* OTP Inputs */}
                <div className="flex justify-center gap-3 mb-8">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => inputRefs.current[index] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-12 h-14 text-center text-2xl font-bold text-primary-dark border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      autoComplete="one-time-code"
                    />
                  ))}
                </div>

                {/* Verify Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={<ArrowRight className="w-5 h-5" />}
                >
                  Verify Account
                </Button>
              </form>

              {/* Resend Section */}
              <div className="mt-6 text-center">
                <p className="text-sm text-text-secondary">
                  Didn't receive the code?{' '}
                  <button
                    onClick={handleResend}
                    className="text-primary font-medium hover:underline transition-colors"
                  >
                    Resend
                  </button>
                </p>
              </div>

              {/* Back to Login */}
              <div className="mt-4 text-center">
                <Link to="/login" className="text-sm text-text-secondary hover:text-primary transition-colors">
                  ← Back to Login
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default VerifyOTP;