import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Linkedin, Github, Mail, ExternalLink, Menu, X, Download } from "lucide-react";

// Custom hook for an infinite typing animation effect for a list of words
const useTypingEffect = (texts, typingSpeed = 100, pauseDelay = 1500) => {
  const [displayedText, setDisplayedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentText = texts[textIndex];
    let timeoutId;

    if (!isDeleting && charIndex < currentText.length) {
      // Typing forward
      timeoutId = setTimeout(() => {
        setDisplayedText(currentText.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, typingSpeed);
    } else if (isDeleting && charIndex > 0) {
      // Deleting
      timeoutId = setTimeout(() => {
        setDisplayedText(currentText.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      }, typingSpeed / 2); // Deleting is faster
    } else if (!isDeleting && charIndex === currentText.length) {
      // Pausing at the end of a word
      timeoutId = setTimeout(() => {
        setIsDeleting(true);
      }, pauseDelay);
    } else if (isDeleting && charIndex === 0) {
      // Switching to the next word
      setIsDeleting(false);
      setTextIndex((textIndex + 1) % texts.length);
    }

    return () => clearTimeout(timeoutId);
  }, [charIndex, isDeleting, textIndex, texts, typingSpeed, pauseDelay]);

  return displayedText;
};

// Custom hook for scroll-based fade-in effect that re-triggers
const useOnScreen = (options) => {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return [ref, isVisible];
};

// Main App component
const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSkillsHovered, setIsSkillsHovered] = useState(false);
  const [imageTranslate, setImageTranslate] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState('All');

  // New loading state
  const [isLoading, setIsLoading] = useState(true);

  // Dark/Light Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('theme');
    return savedMode ? savedMode === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // UseEffect to apply the theme class to the HTML element
  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // useEffect to handle the loading screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2-second delay
    return () => clearTimeout(timer);
  }, []);

  // Define refs for each section to observe for scrolling
  const [aboutRef, aboutVisible] = useOnScreen({ threshold: 0.1 });
  const [skillsRef, skillsVisible] = useOnScreen({ threshold: 0.1 });
  const [projectsRef, projectsVisible] = useOnScreen({ threshold: 0.1 });
  const [experienceRef, experienceVisible] = useOnScreen({ threshold: 0.1 });
  const [educationRef, educationVisible] = useOnScreen({ threshold: 0.1 });
  const [contactRef, contactVisible] = useOnScreen({ threshold: 0.1 });


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const handleImageMouseMove = (e) => {
    if (!imageRef.current) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Calculate a small translation value based on mouse position relative to center
    // Increased the multiplier from 20 to 40 to make the movement more pronounced.
    const translateX = ((clientX - centerX) / width) * 40; 
    const translateY = ((clientY - centerY) / height) * 40;

    setImageTranslate({ x: translateX, y: translateY });
  };

  const handleImageMouseLeave = () => {
    setImageTranslate({ x: 0, y: 0 });
  };

  const personalInfo = {
    name: 'G Padma Sai',
    title: 'Full-Stack Web Developer | MERN Stack Enthusiast',
    summary: "A Computer Science undergraduate with hands-on experience in full-stack web development using the MERN stack. Proficient in designing responsive user interfaces, building RESTful APIs, and deploying scalable applications. I'm focused on automation and effective team collaboration, with a track record of delivering real-world projects through internships and self-driven initiatives.",
    social: {
      email: 'padmasaigorrela@gmail.com',
      linkedin: 'https://linkedin.com/in/padmasaigorrela',
      github: 'https://github.com/padmasai4233'
    }
  };

  const skills = [
    'Python', 'C', 'JavaScript', 'SQL', 'HTML & CSS', 'React.js',
    'Node.js', 'Express.js', 'MongoDB', 'MySQL', 'Git & GitHub', 'Vercel & Render'
  ];

  const projects = [
    {
      title: 'Think Store',
      description: 'Engineered a scalable e-commerce platform using MERN stack with product listings, cart, and order management. Simulated 200+ products and processed 10+ test orders. Hosted on Vercel.',
      liveUrl: 'https://think-store-delta.vercel.app/',
      category: 'Full-Stack (MERN)'
    },
    {
      title: 'AI Chef Claude',
      description: 'Developed a real-time recipe recommendation engine using React.js and Gemini API. Suggested 50+ meals based on user preferences using user-driven input forms.',
      liveUrl: 'https://ai-chef-claude.vercel.app/',
      category: 'Full-Stack (MERN)'
    },
    {
      title: 'Email Automation',
      description: 'Created a Python tool to automate personalized bulk email distribution from Excel. Tested with 5+ users, achieving 95% delivery accuracy.',
      liveUrl: 'https://email-automation-e9vc.onrender.com/',
      category: 'Python'
    }
  ];

  const projectTitles = projects.map(p => p.title);
  const animatedTitle = useTypingEffect(projectTitles, 100);

  const experience = [
    {
      role: 'Web Development Intern',
      company: 'Prodigy InfoTech',
      dates: 'Aug 2024 - Sep 2024',
      details: [
        'Designed and launched 3+ responsive websites using HTML, CSS, and JavaScript.',
        'Implemented Git-based version control and pushed 30+ commits across collaborative projects.',
      ],
      certificate: null // No certificate for this entry
    },
    {
      role: 'AI & Machine Learning Intern',
      company: 'Edunet Foundation',
      dates: 'Jun 2025 - Jul 2025',
      details: [
        'Completed a 6-week internship on Artificial Intelligence & Machine Learning.',
        'The program was implemented by Edunet Foundation in collaboration with All India Council for Technical Education (AICTE).'
      ],
      certificate: null
    }
  ];

  const education = [
    {
      degree: 'B.Tech in Computer Science and Engineering',
      institution: "Vignan's Foundation for Science, Technology & Research",
      dates: 'Jul 2022 - Jun 2026',
    },
    {
      degree: 'Intermediate (MPC Stream)',
      institution: 'Sri Chaitanya Junior College',
      dates: 'Jul 2020 - Jun 2022',
    }
  ];

  const sectionClasses = (isVisible) =>
    `transition-all duration-1000 ease-in-out transform ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`;

  const filteredProjects = activeFilter === 'All'
    ? projects
    : projects.filter(project => project.category === activeFilter);

  const categories = ['All', ...new Set(projects.map(p => p.category))];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-950 text-teal-600 dark:text-teal-400">
        <svg className="animate-spin h-20 w-20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-200 min-h-screen font-sans">
      <style>
        {`
          html {
            scroll-padding-top: 6rem; /* Ensures sections are not hidden behind sticky header */
          }
          @keyframes slide-left {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          @keyframes slide-right {
            from { transform: translateX(-50%); }
            to { transform: translateX(0); }
          }
          .animate-slide-left {
            animation: slide-left 30s linear infinite;
          }
          .animate-slide-right {
            animation: slide-right 30s linear infinite;
          }
          .animate-slide.paused {
            animation-play-state: paused;
          }
          .nav-link-underline {
            position: relative;
          }
          .nav-link-underline::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: 0;
            left: 0;
            background-color: #fbbf24; /* amber-400 */
            transition: width 0.3s ease-in-out;
          }
          .nav-link-underline:hover::after {
            width: 100%;
          }
          .hero-image {
            transition: transform 0.3s ease-out;
            will-change: transform;
          }
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-8px);
            }
          }
          .bouncing-char {
            display: inline-block;
            animation: bounce 1s infinite;
          }

          /* Timeline specific styles */
          .timeline-container {
            position: relative;
            padding: 0 1rem; /* Add padding to prevent content from touching the edge */
            margin-top: 2rem;
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
          }
          .timeline-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            width: 2px;
            height: 100%;
            background-color: #6ee7b7; /* green-300 */
            transform: translateX(-50%);
          }
          .timeline-item {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-bottom: 2rem;
            position: relative;
          }
          .timeline-item.right {
            justify-content: flex-end;
          }
          .timeline-item .date-container {
            width: 50%;
            padding: 0 1rem;
            text-align: right;
            position: relative;
          }
          .timeline-item.right .date-container {
            text-align: left;
          }
          .timeline-item .card-container {
            width: 50%;
            padding: 0 1rem;
          }
          .timeline-item .date-container::after {
            content: '';
            position: absolute;
            top: 4px;
            right: -10px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: #0d9488; /* teal-600 */
            border: 2px solid #6ee7b7; /* green-300 */
            transform: translateX(50%);
          }
          .timeline-item.right .date-container::after {
            left: -10px;
            right: auto;
            transform: translateX(-50%);
          }
          /* This positions the card on the right for a left-aligned date and vice-versa */
          .timeline-item .date-container + .card-container {
            order: 2;
          }
          .timeline-item.right .date-container + .card-container {
            order: 1;
          }
          @media (max-width: 768px) {
            .timeline-container::before {
              left: 20px;
              transform: translateX(0);
            }
            .timeline-item {
              flex-direction: column;
              align-items: flex-start;
              justify-content: flex-start;
              padding-left: 2rem;
            }
            .timeline-item::before {
              top: 4px;
              left: 12px;
              transform: translateX(0);
              width: 10px;
              height: 10px;
            }
            .timeline-item .date-container, .timeline-item .card-container {
              width: 100%;
              padding: 0;
              text-align: left;
            }
            .timeline-item .date-container::after {
              display: none;
            }
          }
        `}
      </style>

      {/* Header */}
      <header className="bg-gray-100 dark:bg-gray-900 shadow-xl sticky top-0 z-50">
        <nav className="container mx-auto p-4 flex justify-between items-center">
          <a href="#hero" className="text-3xl font-bold text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 transition-colors">
            {personalInfo.name.split('').map((char, index) => (
              <span 
                key={index} 
                className="bouncing-char" 
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </a>
          {/* Desktop Navigation */}
          <div className="space-x-8 hidden md:flex font-semibold overflow-hidden">
            <a href="#about" className="relative nav-link-underline hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-lg">About</a>
            <a href="#skills" className="relative nav-link-underline hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-lg">Skills</a>
            <a href="#projects" className="relative nav-link-underline hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-lg">Projects</a>
            <a href="#experience" className="relative nav-link-underline hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-lg">Experience</a>
            <a href="#education" className="relative nav-link-underline hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-lg">Education</a>
            <a href="#contact" className="relative nav-link-underline hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-lg">Contact</a>
          </div>
          {/* Mobile Menu Button & Dark Mode Toggle */}
          <div className="flex items-center space-x-4">
            <button onClick={toggleDarkMode} className="text-xl focus:outline-none text-gray-800 dark:text-gray-200 cursor-pointer">
              {isDarkMode ? <Sun /> : <Moon />}
            </button>
            <button onClick={toggleMenu} className="md:hidden text-gray-800 dark:text-gray-200 text-xl focus:outline-none cursor-pointer">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </nav>
        {/* Mobile Navigation */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} bg-gray-100 dark:bg-gray-900 shadow-lg`}>
          <div className="flex flex-col p-4 space-y-2">
            <a href="#about" onClick={toggleMenu} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-lg py-2">About</a>
            <a href="#skills" onClick={toggleMenu} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-lg py-2">Skills</a>
            <a href="#projects" onClick={toggleMenu} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-lg py-2">Projects</a>
            <a href="#experience" onClick={toggleMenu} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-lg py-2">Experience</a>
            <a href="#education" onClick={toggleMenu} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-lg py-2">Education</a>
            <a href="#contact" onClick={toggleMenu} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-lg py-2">Contact</a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="h-screen flex items-center justify-center text-center px-4 bg-gray-50 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-800">
        <div className="container mx-auto flex flex-col-reverse md:flex-row md:justify-center md:items-center md:space-x-12">
          {/* Text Content */}
          <div className="md:w-1/2 mt-8 md:mt-0 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight">
              {personalInfo.name}
            </h1>
            <p className="text-xl md:text-2xl mt-4 text-gray-600 dark:text-gray-400">
              {personalInfo.title}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center md:justify-start items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a href="#projects" className="bg-teal-600 dark:bg-teal-500 hover:bg-teal-700 dark:hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
                View My Work
              </a>
              <a href="#contact" className="bg-amber-500 dark:bg-amber-400 hover:bg-amber-600 dark:hover:bg-amber-500 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105">
                Get In Touch
              </a>
            </div>
          </div>
          {/* Image Container with Animation */}
          <div 
            className="md:w-1/2 flex justify-center items-center p-4 relative"
          >
            <img 
              src="/Adobe Express - file.png" 
              alt="A desktop computer setup with a transparent background"
              className="w-full h-auto max-w-sm hero-image cursor-pointer"
              ref={imageRef}
              onMouseMove={handleImageMouseMove}
              onMouseLeave={handleImageMouseLeave}
              style={{ transform: `translate(${imageTranslate.x}px, ${imageTranslate.y}px)` }}
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" ref={aboutRef} className={`py-20 bg-gray-100 dark:bg-gray-900 ${sectionClasses(aboutVisible)}`}>
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold text-center text-teal-600 dark:text-teal-400 mb-12">About Me</h2>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-teal-500/50">
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              {personalInfo.summary}
            </p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" ref={skillsRef} className={`py-20 bg-gray-50 dark:bg-gray-950 ${sectionClasses(skillsVisible)}`}>
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-center text-amber-500 dark:text-amber-400 mb-12">Technical Skills</h2>
          {/* Mobile Skills Animation */}
          <div className="md:hidden">
            <div className="overflow-hidden relative h-16">
              <div 
                className={`flex items-center absolute whitespace-nowrap animate-slide-left ${isSkillsHovered ? 'paused' : ''}`}
                onMouseEnter={() => setIsSkillsHovered(true)}
                onMouseLeave={() => setIsSkillsHovered(false)}
              >
                {[...skills.slice(0, 6), ...skills.slice(0, 6)].map((skill, index) => (
                  <div key={index} className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white px-2 py-1 rounded-full shadow-md transition-all duration-300 transform hover:scale-110 hover:bg-teal-600 dark:hover:bg-teal-500 hover:text-white mx-0.5 text-xs">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
            <div className="overflow-hidden relative h-16 mt-4">
              <div 
                className={`flex items-center absolute whitespace-nowrap animate-slide-right ${isSkillsHovered ? 'paused' : ''}`}
                onMouseEnter={() => setIsSkillsHovered(true)}
                onMouseLeave={() => setIsSkillsHovered(false)}
              >
                {[...skills.slice(6), ...skills.slice(6)].map((skill, index) => (
                  <div key={index} className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white px-2 py-1 rounded-full shadow-md transition-all duration-300 transform hover:scale-110 hover:bg-teal-600 dark:hover:bg-teal-500 hover:text-white mx-0.5 text-xs">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Desktop Skills Animation */}
          <div className="hidden md:block">
            <div className="overflow-hidden relative h-16">
              <div 
                className={`flex items-center absolute whitespace-nowrap animate-slide-left ${isSkillsHovered ? 'paused' : ''}`}
                onMouseEnter={() => setIsSkillsHovered(true)}
                onMouseLeave={() => setIsSkillsHovered(false)}
              >
                {[...skills, ...skills].map((skill, index) => (
                  <div key={index} className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white px-6 py-3 rounded-full shadow-md transition-all duration-300 transform hover:scale-110 hover:bg-teal-600 dark:hover:bg-teal-500 hover:text-white mx-2">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" ref={projectsRef} className={`py-20 bg-gray-100 dark:bg-gray-900 ${sectionClasses(projectsVisible)}`}>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col items-center">
            <h2 className="text-4xl font-bold text-center text-teal-600 dark:text-teal-400 mb-2">
              Professional Projects
            </h2>
            <h3 className="text-2xl font-bold text-center text-amber-500 dark:text-amber-400 min-h-[36px] mb-8">
              {animatedTitle}
            </h3>
          </div>

          {/* Project Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105
                  ${activeFilter === category
                    ? 'bg-amber-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-amber-400 hover:text-white'
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-teal-500/50 border border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>
                <div className="flex space-x-4 mt-4">
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 font-semibold flex items-center space-x-2">
                    <ExternalLink />
                    <span>Live Demo</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" ref={experienceRef} className={`py-20 bg-gray-50 dark:bg-gray-950 ${sectionClasses(experienceVisible)}`}>
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-center text-amber-500 dark:text-amber-400 mb-12">Work Experience</h2>
          <div className="timeline-container">
            {experience.map((job, index) => (
              <div key={index} className={`timeline-item ${index % 2 === 1 ? 'right' : ''}`}>
                <div className={`date-container text-gray-600 dark:text-gray-400 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <p className="text-lg font-semibold">{job.dates}</p>
                </div>
                <div className={`card-container ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-teal-500/50">
                    <h4 className="text-xl font-semibold text-teal-600 dark:text-teal-400">{job.role}</h4>
                    <p className="text-lg text-gray-700 dark:text-gray-300">{job.company}</p>
                    <ul className="list-disc list-inside mt-2 text-gray-600 dark:text-gray-400 space-y-1">
                      {job.details.map((detail, i) => (
                        <li key={i}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" ref={educationRef} className={`py-20 bg-gray-100 dark:bg-gray-900 ${sectionClasses(educationVisible)}`}>
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-center text-teal-600 dark:text-teal-400 mb-12">Education</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {education.map((edu, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-teal-500/50">
                <h4 className="text-xl font-semibold text-teal-600 dark:text-teal-400">{edu.degree}</h4>
                <p className="text-lg text-gray-700 dark:text-gray-300">{edu.institution} | {edu.dates}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" ref={contactRef} className={`py-20 bg-gray-50 dark:bg-gray-950 ${sectionClasses(contactVisible)}`}>
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-4xl font-bold text-teal-600 dark:text-teal-400 mb-8">Get In Touch</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
            I'm currently seeking new opportunities. Feel free to connect with me!
          </p>
          <div className="flex justify-center space-x-6 text-4xl">
            <a href={`mailto:${personalInfo.social.email}`} className="text-gray-600 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors">
              <Mail />
            </a>
            <a href={personalInfo.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors">
              <Linkedin />
            </a>
            <a href={personalInfo.social.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors">
              <Github />
            </a>
            {/* Unified Resume Download Button */}
            <a href="/G_Padma_Sai_Resume.pdf" download="G_Padma_Sai_Resume.pdf" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors cursor-pointer flex items-center space-x-2 text-lg">
              <Download />
              <span>Resume</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 text-center py-6 text-gray-500 dark:text-gray-500">
        <p>&copy; {new Date().getFullYear()} G Padma Sai. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
