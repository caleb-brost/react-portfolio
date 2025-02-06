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
  const ProjectDetails = memo(({ title, techStack, description }) => (
    <div className="project-details">
      <h2>{title}</h2>
      <div className="project-tech-stack">
        {techStack.map((tech, index) => (
          <span key={index}>{tech}</span>
        ))}
      </div>
      <p>{description}</p>
      <div className="project-links">
        <a href="#" className="btn">View Project</a>
        <a href="#" className="btn">GitHub</a>
      </div>
    </div>
  ))

  const ProjectSection = memo(() => {
    // Memoize project data
    const projects = useMemo(() => [
      {
        title: 'Title',
        techStack: ['React', 'Node.js', 'MongoDB'],
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc eget ultricies tincidunt, velit velit bibendum velit, vel bibendum sapien nunc vel lectus. Fusce euismod, nunc sit amet aliquam lacinia, nisi enim lobortis enim, vel lacinia nunc enim eget nunc.'
      },
      {
        title: 'Title',
        techStack: ['React', 'Redux', 'Firebase'],
        description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.'
      },
      {
        title: 'Title',
        techStack: ['Python', 'TensorFlow', 'Natural Language Processing'],
        description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.'
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
