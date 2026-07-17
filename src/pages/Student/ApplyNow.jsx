import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Clock,
  Briefcase, CheckCircle,
  Send
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Container from '../../components/common/Container';

const ApplyNow = () => {
  const navigate = useNavigate();
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  // Internship details (would come from API)
  const internship = {
    title: 'Frontend Developer Intern',
    company: 'TechCorp Inc.',
    location: 'Lagos, Nigeria',
    type: 'Full-time',
    duration: '6 months',
    match: '95%',
    tags: ['React', 'JavaScript', 'CSS', 'Tailwind'],
    description: 'We are looking for a passionate Frontend Developer Intern to join our dynamic team. You will work on exciting projects and learn from experienced developers.',
    about: 'TechCorp Inc. is a leading technology company specializing in innovative web solutions. We have a track record of mentoring young talents and helping them grow into successful professionals.',
    requirements: ['Proficiency in React.js', 'Strong JavaScript skills', 'Understanding of CSS and responsive design', 'Good communication skills'],
    benefits: ['Mentorship program', 'Remote work options', 'Flexible working hours', 'Potential for full-time offer'],
    deadline: 'December 15, 2024',
    spots: '3 spots available',
  };

  // Student profile (would come from API - prefilled)
  const studentProfile = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@university.edu',
    phone: '+234 800 000 0000',
    university: 'University of Lagos',
    faculty: 'Faculty of Science',
    department: 'Computer Science',
    level: '400L',
    skills: ['React', 'JavaScript', 'CSS', 'Python', 'SQL'],
    interests: ['Web Development', 'Data Science'],
    careerAspiration: 'Full Stack Developer',
  };

  const handleApply = () => {
    setApplying(true);
    // Simulate API call
    setTimeout(() => {
      setApplying(false);
      setApplied(true);
      // Redirect back to internships after 2 seconds
      setTimeout(() => {
        navigate('/student/internships');
      }, 2000);
    }, 1500);
  };

  if (applied) {
    return (
      <Container className="py-12">
        <Card variant="bordered" padding="lg" className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-status-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-status-success" />
          </div>
          <h2 className="text-2xl font-bold text-primary-dark mb-2">Application Submitted!</h2>
          <p className="text-text-secondary mb-6">
            Your application for <strong>{internship.title}</strong> has been successfully submitted.
          </p>
          <p className="text-sm text-text-muted">Redirecting to internships...</p>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/student/internships')}
        className="flex items-center text-text-secondary hover:text-primary transition-colors mb-6 group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Internships
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content - Left */}
        <div className="lg:col-span-2 space-y-6">
          {/* Internship Details */}
          <Card variant="bordered" padding="lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-primary-dark">{internship.title}</h1>
                <p className="text-text-secondary flex items-center mt-1">
                  <Building2 className="w-4 h-4 mr-1" />
                  {internship.company}
                </p>
              </div>
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                {internship.match} Match
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-text-secondary mb-4">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {internship.location}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {internship.duration}
              </span>
              <span className="flex items-center">
                <Briefcase className="w-4 h-4 mr-1" />
                {internship.type}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {internship.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-primary-light/20 text-primary-dark text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <div className="prose prose-sm max-w-none">
              <h4 className="text-sm font-semibold text-primary-dark">About the Role</h4>
              <p className="text-text-secondary text-sm">{internship.description}</p>

              <h4 className="text-sm font-semibold text-primary-dark mt-4">About the Company</h4>
              <p className="text-text-secondary text-sm">{internship.about}</p>

              <h4 className="text-sm font-semibold text-primary-dark mt-4">Requirements</h4>
              <ul className="list-disc list-inside text-text-secondary text-sm space-y-1">
                {internship.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>

              <h4 className="text-sm font-semibold text-primary-dark mt-4">Benefits</h4>
              <ul className="list-disc list-inside text-text-secondary text-sm space-y-1">
                {internship.benefits.map((benefit, i) => (
                  <li key={i}>{benefit}</li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border-light">
              <div>
                <p className="text-xs text-text-muted">Application Deadline</p>
                <p className="text-sm font-medium text-primary-dark">{internship.deadline}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-text-muted">Availability</p>
                <p className="text-sm font-medium text-primary-dark">{internship.spots}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Sidebar - Application Form */}
        <div className="space-y-6">
          <Card variant="bordered" padding="lg" className="sticky top-24">
            <h2 className="text-lg font-bold text-primary-dark mb-4">Application Review</h2>
            <p className="text-sm text-text-secondary mb-4">
              Your profile information will be used for this application. Please review before submitting.
            </p>

            {/* Profile Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Full Name</span>
                <span className="font-medium text-primary-dark">
                  {studentProfile.firstName} {studentProfile.lastName}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Email</span>
                <span className="font-medium text-primary-dark">{studentProfile.email}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Phone</span>
                <span className="font-medium text-primary-dark">{studentProfile.phone}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">University</span>
                <span className="font-medium text-primary-dark">{studentProfile.university}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Department</span>
                <span className="font-medium text-primary-dark">{studentProfile.department}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Level</span>
                <span className="font-medium text-primary-dark">{studentProfile.level}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Skills</span>
                <span className="font-medium text-primary-dark text-xs">
                  {studentProfile.skills.join(', ')}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Career Aspiration</span>
                <span className="font-medium text-primary-dark">{studentProfile.careerAspiration}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border-light">
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={applying}
              onClick={handleApply}
              icon={<Send className="w-5 h-5" />}
            >
              Apply Now
            </Button>

            <p className="text-xs text-text-muted text-center mt-3">
              By applying, you agree to share your profile information with {internship.company}
            </p>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default ApplyNow;