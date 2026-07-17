import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  School, 
  BookOpen, 
  Briefcase,
  Settings,
  Edit2,
  Save,
  Camera
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const StudentProfile = () => {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Profile</h1>
          <p className="text-text-secondary">Manage your personal information</p>
        </div>
        <Button variant="ghost" size="sm" icon={<Settings className="w-4 h-4" />}>
          Settings
        </Button>
      </div>

      {/* Profile Header */}
      <Card variant="bordered" padding="lg" className="mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-primary-light rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-primary-dark">JD</span>
            </div>
            <button className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-primary-dark">John Doe</h2>
            <p className="text-text-secondary">Computer Science Student</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-sm">
              <span className="flex items-center text-text-secondary">
                <Mail className="w-4 h-4 mr-1" />
                john.doe@university.edu
              </span>
              <span className="flex items-center text-text-secondary">
                <Phone className="w-4 h-4 mr-1" />
                +234 800 000 0000
              </span>
            </div>
          </div>
          <Button variant="outline" size="sm" icon={<Edit2 className="w-4 h-4" />}>
            Edit Profile
          </Button>
        </div>
      </Card>

      {/* Profile Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card variant="bordered" padding="lg">
          <h3 className="text-lg font-semibold text-primary-dark mb-4 flex items-center">
            <School className="w-5 h-5 mr-2 text-primary" />
            Academic Information
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-text-muted">University</p>
              <p className="text-text-secondary font-medium">University of Lagos</p>
            </div>
            <div>
              <p className="text-sm text-text-muted">Faculty</p>
              <p className="text-text-secondary font-medium">Faculty of Science</p>
            </div>
            <div>
              <p className="text-sm text-text-muted">Department</p>
              <p className="text-text-secondary font-medium">Computer Science</p>
            </div>
            <div>
              <p className="text-sm text-text-muted">Level</p>
              <p className="text-text-secondary font-medium">400L</p>
            </div>
          </div>
        </Card>

        <Card variant="bordered" padding="lg">
          <h3 className="text-lg font-semibold text-primary-dark mb-4 flex items-center">
            <Briefcase className="w-5 h-5 mr-2 text-primary" />
            Skills & Interests
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-text-muted">Skills</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {['React', 'JavaScript', 'CSS', 'Python', 'SQL', 'UI/UX'].map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-primary-light/20 text-primary-dark text-sm rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-text-muted">Interests</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {['Web Development', 'Data Science', 'AI/ML', 'Cloud Computing'].map((interest, i) => (
                  <span key={i} className="px-3 py-1 bg-accent-yellow/10 text-accent-orange text-sm rounded-full">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-text-muted">Career Aspiration</p>
              <p className="text-text-secondary font-medium">Full Stack Developer</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <Button variant="primary" icon={<Save className="w-4 h-4" />}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default StudentProfile;