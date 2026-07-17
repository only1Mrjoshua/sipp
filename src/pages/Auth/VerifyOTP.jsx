import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Mail } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'student';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
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
    if (role === 'company') {
      navigate('/company');
    } else {
      navigate('/student');
    }
  };

  const handleResend = () => {
    console.log('OTP resent');
  };

  return (
    <section className="min-h-screen flex items-center justify-center py-12 bg-gradient-hero">
      <div className="w-full max-w-sm mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card variant="bordered" padding="md" className="shadow-strong">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-primary-dark">Verify Your Account</h1>
              <p className="text-text-secondary mt-1 text-sm">
                We've sent a 6-digit verification code to your email
              </p>
              <div className="flex items-center justify-center mt-2 text-xs text-text-secondary">
                <Mail className="w-3 h-3 mr-1" />
                <span>info@sipp.curriumx.online</span>
              </div>
              <div className="mt-1 text-xs text-text-muted">
                {role === 'company' ? 'Creating company account...' : 'Creating student account...'}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="flex justify-center gap-2 mb-6">
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
                    className="w-10 h-12 text-center text-xl font-bold text-primary-dark border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    autoComplete="one-time-code"
                  />
                ))}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Verify Account
              </Button>
            </form>

            <div className="mt-4 text-center">
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

            <div className="mt-3 text-center">
              <Link to="/login" className="text-xs text-text-secondary hover:text-primary transition-colors">
                ← Back to Login
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default VerifyOTP;