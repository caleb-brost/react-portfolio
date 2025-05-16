import { useState, useEffect, memo, useMemo, useCallback, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('about')
  const [navbarTranslation, setNavbarTranslation] = useState(0)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Refs for sections
  const sectionRefs = {
    about: useRef(null),
    projects: useRef(null),
    contact: useRef(null)
  }

  // Memoize scroll handler to prevent unnecessary re-renders
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY
    const scrollDifference = currentScrollY - lastScrollY

    // Gradually translate navbar up or down
    if (scrollDifference > 0 && currentScrollY > 100) {
      setNavbarTranslation(Math.max(-100, navbarTranslation - scrollDifference));
    } else if (scrollDifference < 0) {
      setNavbarTranslation(Math.min(0, navbarTranslation - scrollDifference));
    }
    
    // Update active section based on scroll position
    Object.entries(sectionRefs).forEach(([section, ref]) => {
      if (ref.current) {
        const { top, bottom } = ref.current.getBoundingClientRect()
        if (top <= window.innerHeight / 2 && bottom >= window.innerHeight / 2) {
          setActiveSection(section)
        }
      }
    })
    
    setLastScrollY(currentScrollY)
  }, [lastScrollY, navbarTranslation])

  // Optimize scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  // Smooth scroll to section
  const scrollToSection = useCallback((sectionName) => {
    sectionRefs[sectionName].current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }, [])

  // Memoize navigation items to prevent re-creation
  const navItems = useMemo(() => [
    { label: 'About', section: 'about' },
    { label: 'Projects', section: 'projects' },
    { label: 'Contact', section: 'contact' },
    { label: 'Download Resume', section: 'resume', type: 'download' }
  ], [])

  // Download resume function
  const downloadResume = useCallback(() => {
    const link = document.createElement('a')
    link.href = '/react-portfolio/documents/resume.pdf'
    link.setAttribute('download', 'Caleb_Brost_Resume.pdf')
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])

  // Memoize NavBar component
  const NavBar = memo(({ activeSection, scrollToSection }) => {
    return (
      <nav 
        className="navbar" 
        style={{ 
          transform: `translateY(${navbarTranslation}%)`,
          transition: 'transform 0.3s ease-out'
        }}
      >
        <div className="nav-icons">
          {navItems.map((item, index) => (
            <button 
              key={index}
              data-section={item.section}
              className={`nav-icon ${activeSection === item.section ? 'active' : ''} ${item.section === 'contact' ? 'contact-btn' : ''}`} 
              onClick={() => 
                item.type === 'download' 
                  ? downloadResume() 
                  : scrollToSection(item.section)
              }
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    )
  })

  // Memoize other section components
  const MainGraphic = memo(() => (
    <section ref={sectionRefs.about} className="main-graphic">
      <div className="graphic-content">
        <h1>Caleb Brost</h1>
        <p>Software Developer | 2nd Year University Student</p>
      </div>
    </section>
  ))

  const IntroSection = memo(() => (
    <section ref={sectionRefs.about} className="intro-section">
      <div className="intro-content">
        <div className="about-me-container">
          <div className="about-me-text">
            <h2>About Me</h2>
            <p>
              I'm a passionate Computer Science student with a strong interest in software development 
              and emerging technologies. My academic journey has been driven by a curiosity to understand 
              how complex systems work and a desire to create innovative solutions.
            </p>
            <p>
              Throughout my studies, I've developed skills in multiple programming languages and 
              explored various domains of computer science, from low-level systems programming to 
              web development and machine learning.
            </p>
            <div className="social-icons">
              <a href="https://github.com/caleb-brost" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faGithub} />
              </a>
              <a href="https://www.linkedin.com/in/caleb-brost-50462332b/" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <a href="mailto:calebbrost252@gmail.com">
                <FontAwesomeIcon icon={faEnvelope} />
              </a>
            </div>
          </div>
          <div className="about-me-image">
            <img 
              src="/react-portfolio/profile_picture.png" 
              alt="Caleb Brost" 
              className="profile-picture" 
            />
          </div>
        </div>
        <div className="skills-container">
          <h3>Skills</h3>
          <div className="skills-grid">
            <span>C++</span>
            <span>Python</span>
            <span>Java</span>
            <span>Rust</span>
            <span>JavaScript</span>
            <span>HTML</span>
            <span>CSS</span>
            <span>Assembly</span>
          </div>
        </div>
      </div>
    </section>
  ))

  // Memoize project details to prevent unnecessary re-renders
  const ProjectDetails = memo(({ title, techStack, description, githubUrl, liveUrl }) => (
    <div className="project-details">
      <h2>{title}</h2>
      <div className="project-tech-stack">
        {techStack.map((tech, index) => (
          <span key={index}>{tech}</span>
        ))}
      </div>
      <p>{description}</p>
      <div className="project-links">
        {liveUrl && <a href={liveUrl} className="btn" target="_blank" rel="noopener noreferrer">View Project</a>}
        {githubUrl && <a href={githubUrl} className="btn" target="_blank" rel="noopener noreferrer">GitHub</a>}
      </div>
    </div>
  ))

  const ProjectSection = memo(() => {
    // Memoize project data
    const projects = useMemo(() => [
      {
        title: 'GymRat',
        techStack: ['React Native', 'Javascript', 'Supabase DB'],
        description: 'GymRat is a fitness tracking website application built with React Native. It helps users create workouts, track their workouts, and monitor their progress. The app features a clean, intuitive interface for logging exercises, viewing workout history, and analyzing performance trends. Using Supabase for the backend ensures reliable data storage and real-time synchronization across devices.',
        githubUrl: 'https://github.com/caleb-brost/gym-rat-app'
      },
      {
        title: 'Connect Four',
        techStack: ['Java Swing'],
        description: 'A classic Connect Four game implemented as part of a college lab course, submitted through Kings University academic system. This Java Swing version features a clean user interface, two-player gameplay, win detection, and move validation. The project demonstrates fundamental Java concepts for desktop application development and OS interaction.',
        githubUrl: 'https://github.com/caleb-brost/Java-ConnectFour'
      },
      {
        title: 'Portfolio Website',
        techStack: ['React', 'Vite', 'CSS'],
        description: 'A modern, responsive portfolio website built using React and Vite. Features a clean, professional design with smooth scrolling navigation, dynamic content rendering, and interactive components. The site showcases my projects, skills, and contact information in an engaging and user-friendly format.',
        githubUrl: 'https://github.com/caleb-brost/react-portfolio'
      }
    ], [])

    return (
      <section ref={sectionRefs.projects} className="project-section">
        <h2>My Projects</h2>
        {projects.map((project, index) => (
          <div key={index} className="projects-container">
            <ProjectDetails 
              title={project.title}
              techStack={project.techStack}
              description={project.description}
              githubUrl={project.githubUrl}
              liveUrl={project.liveUrl}
            />
          </div>
        ))}
      </section>
    )
  })

  const Footer = memo(() => (
    <footer ref={sectionRefs.contact} className="footer">
      <div className="footer-content">
        <div className="footer-contact">
          <h3>Contact</h3>
          <div className="social-icons">
            <a href="https://github.com/caleb-brost" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faGithub} />
            </a>
            <a href="https://www.linkedin.com/in/caleb-brost-50462332b/" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
            <a href="mailto:calebbrost252@gmail.com">
              <FontAwesomeIcon icon={faEnvelope} />
            </a>
          </div>
        </div>
        <p>&copy; 2025 Caleb Brost. All Rights Reserved.</p>
      </div>
    </footer>
  ))

  return (
    <div className="app">
      <NavBar 
        activeSection={activeSection} 
        scrollToSection={scrollToSection}
      />
      <MainGraphic />
      <IntroSection />
      <ProjectSection />
      <Footer />
    </div>
  )
}

export default App
