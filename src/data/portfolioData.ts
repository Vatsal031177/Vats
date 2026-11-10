export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: 'ai' | 'systems' | 'cloud' | 'security';
  description: string;
  problem: string;
  solution: string;
  metrics: string[];
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  architecture: {
    client: string;
    gateway: string;
    services: string[];
    dataStores: string[];
    flowDescription: string;
  };
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  type: string;
  highlights: string[];
  technologies: string[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  verifyUrl: string;
  badge?: string;
}

export interface Publication {
  id: string;
  title: string;
  year: string;
  publisher: string;
  summary: string;
  technologies: string[];
}

export interface PortfolioData {
  personal: {
    name: string;
    title: string;
    headline: string;
    email: string;
    phone: string;
    location: string;
    workPermit: string;
    availability: string;
    github: string;
    linkedin: string;
    resumePdf: string;
    bio: string;
  };
  metrics: Array<{ label: string; value: string; detail: string }>;
  skills: {
    languages: string[];
    backend: string[];
    cloudDevOps: string[];
    aiMl: string[];
    databases: string[];
    security: string[];
  };
  projects: Project[];
  experiences: Experience[];
  education: Array<{
    degree: string;
    institution: string;
    location: string;
    period: string;
    grade?: string;
    coursework?: string;
    notes?: string;
  }>;
  certifications: Certification[];
  publications: Publication[];
}

export const PORTFOLIO_DATA: PortfolioData = {
  personal: {
    name: 'Vatsal Maisuria',
    title: 'Full-Stack Software Engineer & Systems Architect',
    headline: 'Engineering resilient distributed microservices, autonomous AI pipelines, and high-throughput cloud infrastructure.',
    email: 'vatsalmaisuria.77@gmail.com',
    phone: '+49 1621630552',
    location: 'Ingolstadt, Bayern, Germany',
    workPermit: 'EU Blue Card Eligibility',
    availability: 'Available for Q4/2026 Full-Time Roles',
    github: 'https://github.com/Vatsal031177',
    linkedin: 'https://www.linkedin.com/in/vatsal-maisuria/',
    resumePdf: './assets/aistudio/all_CV_01171a6c.pdf',
    bio: 'Former Master of Engineering student in AI for Autonomous Systems at Technische Hochschule Ingolstadt who deliberately transitioned out of academia to dedicate 100% of his focus to practical, high-velocity engineering in companies. Proven track record of architecting gRPC/REST microservices serving 10,000+ users with 99.9% uptime, deploying production LLM agents with 45% manual latency reduction, and enforcing zero-day vulnerability remediation across enterprise infrastructure.',
  },

  metrics: [
    { label: 'System Uptime', value: '99.9%', detail: 'Maintained across production microservices' },
    { label: 'Latency Reduction', value: '45%', detail: 'Achieved with structured LLM workflow orchestration' },
    { label: 'Active Users Served', value: '10k+', detail: '50k+ daily API calls with zero P1 incidents' },
    { label: 'Automated Test Coverage', value: '85%+', detail: 'Multi-layer CI/CD test gates preventing regressions' },
  ],

  skills: {
    languages: ['TypeScript', 'Python', 'Dart', 'C++', 'Java', 'SQL', 'Bash', 'HTML5/CSS3'],
    backend: ['Node.js', 'Express', 'FastAPI', 'Flask', 'Spring Boot', 'gRPC', 'REST APIs', 'OpenAPI 3.0'],
    cloudDevOps: ['Docker', 'Kubernetes', 'GCP Cloud Run', 'AWS', 'Ubuntu VPS', 'GitHub Actions', 'Prometheus', 'Grafana'],
    aiMl: ['LLM Agents', 'QLoRA Fine-Tuning', 'PyTorch', 'TensorFlow', 'OpenCV', 'YOLO', 'NVIDIA Jetson Nano', 'MCP'],
    databases: ['PostgreSQL', 'Firebase', 'Redis', 'SQL Server', 'Vector DBs'],
    security: ['RBAC', 'Least Privilege Access', 'SOC Compliance', 'GDPR/HIPAA Auditing', 'API Penetration Testing'],
  },

  projects: [
    {
      id: 'automation-flow-studio',
      title: 'Automation Flow Studio',
      subtitle: 'Zero-to-One Agentic Workflow Builder & ATS Optimizer',
      category: 'ai',
      featured: true,
      description: 'Production B2B SaaS workflow engine that orchestrates multi-step LLM agents for automated job-application tailoring, dynamic task execution, and ATS scoring.',
      problem: 'Enterprise workflow processing suffered from high manual latency and frequent API hallucinations when integrating non-deterministic LLM responses into production databases.',
      solution: 'Engineered a human-in-the-loop (HITL) step-by-step pipeline with strict JSON Schema function calling, containerized on GCP Cloud Run with automated GitHub release pipelines.',
      metrics: ['45% manual latency reduction', 'Zero API hallucinations', '98% test validation coverage'],
      techStack: ['React', 'Python', 'Flask', 'Gemini API', 'GCP Cloud Run', 'Docker', 'PostgreSQL'],
      liveUrl: 'https://automation-flow-studio-42001982949.europe-west2.run.app',
      githubUrl: 'https://github.com/Vatsal031177/Vatsal031177',
      architecture: {
        client: 'React 19 SPA + Tailwind CSS',
        gateway: 'GCP Cloud Run Ingress + TLS Termination',
        services: ['Task Graph Dispatcher', 'Agent Execution Worker (Python)', 'Evaluation & Guardrail Filter'],
        dataStores: ['PostgreSQL (User State & Graph Topology)', 'Redis (Task Queue & Cache)'],
        flowDescription: 'Client submits workflow graph -> Gateway verifies JWT -> Task Dispatcher triggers Python agent workers with schema-enforced Gemini function calling -> Results verified against guardrail before writing to PostgreSQL.',
      },
    },
    {
      id: 'super-teams',
      title: 'Super Teams & Multilingual Bridge',
      subtitle: 'Zero-Latency Real-Time Audio-Video Translation Platform',
      category: 'ai',
      featured: true,
      description: 'Scalable live collaboration application supporting multi-user video routing and real-time speech translation across global languages with sub-80ms captioning latency.',
      problem: 'Cross-border engineering squads face communication friction and severe latency when relying on post-call transcripts or slow translation bridges.',
      solution: 'Architected continuous WebRTC audio streaming pipeline with WebSocket audio chunking, OpenAI streaming transcription, and real-time cross-language subtitle broadcast.',
      metrics: ['<80ms caption latency', 'Auto-language detection', 'Multi-user concurrent video routing'],
      techStack: ['TypeScript', 'WebRTC', 'WebSockets', 'OpenAI Audio API', 'Node.js', 'Docker'],
      githubUrl: 'https://github.com/Vatsal031177/teams-super',
      architecture: {
        client: 'WebRTC Browser Media Stream API',
        gateway: 'WebSocket Gateway + SFU Video Router',
        services: ['Audio Chunk Buffer', 'Continuous Streaming Translation Service', 'Room State Coordinator'],
        dataStores: ['Redis Pub/Sub (Audio packet distribution)', 'In-Memory Ephemeral Sessions'],
        flowDescription: 'WebRTC audio stream chunked at 50ms intervals -> Streamed via WebSockets to translation worker -> Low-latency Whisper/GPT pipeline translates -> Subtitles broadcast via Redis Pub/Sub to all meeting participants.',
      },
    },
    {
      id: 'ros-lidar-qlora',
      title: 'ROS LiDAR Perception & QLoRA LLM Pipeline',
      subtitle: 'Edge Autonomous Vehicle Detection & Quantized LLM Inference',
      category: 'systems',
      featured: true,
      description: 'End-to-end autonomous perception and fine-tuning pipeline combining LiDAR 3D color point-cloud detection with an edge-served QLoRA quantized language model.',
      problem: 'Autonomous systems on embedded compute struggle to run real-time point-cloud spatial reasoning while generating contextual operational diagnostics.',
      solution: 'Created an end-to-end pipeline fine-tuning open-source LLMs with QLoRA, merging/quantizing adapters into GGUF/AWQ, and serving behind FastAPI on Kubernetes with autoscaling.',
      metrics: ['80% inference latency cut', 'Sub-50ms LiDAR segmentation', 'Zero-downtime rolling K8s deployment'],
      techStack: ['Python', 'FastAPI', 'ROS', 'QLoRA', 'PyTorch', 'Kubernetes', 'Docker'],
      liveUrl: 'https://ai.studio/apps/1b5ade24-c32b-400a-a214-da4bb2fc32bf',
      architecture: {
        client: 'ROS 2 PointCloud2 Sensor Stream',
        gateway: 'Kubernetes Ingress (Traefik)',
        services: ['Point Cloud Spatial Filter', 'FastAPI Quantized LLM Inference Worker', 'Prometheus Metric Exporter'],
        dataStores: ['Shared Volume Model Cache', 'Time-Series Telemetry (Prometheus)'],
        flowDescription: 'LiDAR point-cloud packets stream into ROS node -> Sensor filtering extracts bounding coordinates -> FastAPI container executes quantized model inference -> Telemetry exported to Prometheus dashboard.',
      },
    },
    {
      id: 'annextech-microservices',
      title: 'Annextech Microservices Platform',
      subtitle: 'High-Availability Spring Boot & gRPC Production Architecture',
      category: 'cloud',
      featured: false,
      description: 'Core enterprise backend platform supporting 10,000+ active users with 50,000+ daily API transactions and three consecutive years of 99.9% uptime.',
      problem: 'Legacy monolithic architecture suffered from scaling bottlenecks, deployment lockouts, and 15% regression rates.',
      solution: 'Decomposed monolith into resilient REST & gRPC microservices with JWT/OAuth2, OpenAPI 3.0 specs, circuit breakers, and GitHub Actions caching reducing build times by 40%.',
      metrics: ['99.9% uptime', '50,000+ daily API calls', 'Zero P1 incidents in 3 years', '40% faster CI/CD builds'],
      techStack: ['Spring Boot', 'Java', 'gRPC', 'Flutter', 'PostgreSQL', 'Docker', 'GitHub Actions'],
      architecture: {
        client: 'Flutter Cross-Platform Client (iOS, Android, Web)',
        gateway: 'Spring Cloud Gateway with Rate Limiting',
        services: ['Identity & Auth Service', 'Transaction Engine (gRPC)', 'Notification Dispatcher'],
        dataStores: ['PostgreSQL Cluster (Primary/Replica)', 'Redis Cache Layer'],
        flowDescription: 'Flutter clients connect through Spring Cloud Gateway -> Circuit breaker protects downstream services -> gRPC handles high-throughput internal transactions -> PostgreSQL stores persistent records with read replicas.',
      },
    },
    {
      id: 'contabo-cms-security',
      title: 'Contabo CMS Security Hardening',
      subtitle: 'Zero-Day Remediation, RBAC & GDPR/HIPAA Compliance',
      category: 'security',
      featured: false,
      description: 'Enterprise access control overhaul and vulnerability remediation across high-traffic content management platforms on Ubuntu VPS clusters.',
      problem: 'Privilege escalation risks and compliance audits required rigorous migration mapping to prevent data spills and eliminate unauthorized lateral movement.',
      solution: 'Enforced Least Privilege Access models, integrated Multi-Factor Authentication, performed continuous API penetration tests, and mapped schemas for strict GDPR & HIPAA compliance.',
      metrics: ['40% lateral risk reduction', 'Zero data spills', '100% compliance audit clearance'],
      techStack: ['PostgreSQL', 'Ubuntu VPS', 'RBAC', 'Docker', 'Bash', 'Linux', 'SOC Compliance'],
      architecture: {
        client: 'Enterprise Admin Console',
        gateway: 'Hardened Nginx Reverse Proxy with ModSecurity WAF',
        services: ['MFA Verification Engine', 'Audit Logging Daemon', 'Schema Validator'],
        dataStores: ['Encrypted PostgreSQL Database', 'Immutable Audit Trails'],
        flowDescription: 'Admin requests pass through Nginx WAF -> MFA token verified -> RBAC engine inspects least-privilege role permissions -> Database transactions encrypted at rest and in transit.',
      },
    },
    {
      id: 'brand-analytics',
      title: 'Personal Brand Analytics Engine',
      subtitle: 'Real-Time Social Sentiment & Optimal Engagement Predictor',
      category: 'ai',
      featured: false,
      description: 'Full-stack predictive analytics platform providing sentiment scoring of social content and optimal posting time predictions to maximize organic audience reach.',
      problem: 'Creators and brand managers lacked data-driven signals to identify post timing and emotional resonance of content before publishing.',
      solution: 'Built an asynchronous processing pipeline that scrapes metrics, analyzes sentiment vectors, and visualizes engagement curves in real time.',
      metrics: ['Real-time curve visualization', 'Automated sentiment scoring', 'Sub-100ms analytics queries'],
      techStack: ['React', 'TypeScript', 'Python', 'PostgreSQL', 'Tailwind CSS'],
      githubUrl: 'https://github.com/Vatsal031177/Personal-Brand-Analytics-Platform',
      architecture: {
        client: 'React Dashboard with Real-Time Charting',
        gateway: 'Express API Proxy',
        services: ['Sentiment Scoring Engine', 'Time-Series Predictor'],
        dataStores: ['PostgreSQL Time-Series Tables'],
        flowDescription: 'User inputs text content -> Express routes to Python NLP worker -> Sentiment score calculated -> Historical engagement curves retrieved from PostgreSQL and rendered via SVG sparklines.',
      },
    },
  ],

  experiences: [
    {
      id: 'freelance',
      role: 'Full-Stack Developer (Agentic AI & Distributed Systems)',
      company: 'Freelance / Consulting',
      location: 'Ingolstadt, Germany',
      period: '04/2024 – Present',
      type: 'Part-Time / Contract',
      highlights: [
        'Reduced manual workflow processing latency by 45% by developing production-ready LLM agents using Python, function calling, and schema-enforced structured output.',
        'Engineered human-in-the-loop (HITL) assessment pipelines and step-by-step audit tracking, eliminating API hallucinations across critical business operations.',
        'Delivered zero-to-one B2B SaaS workflow builders using React, Python, Flask, and GCP Cloud Run for dynamic task graph execution.',
        'Maintained 99.9% system uptime integrating custom AI agents with PostgreSQL databases, CRM systems (HubSpot), and external REST APIs.',
        'Achieved 98% test validation coverage by containerizing client platforms with Docker and establishing automated GitHub/GitLab release pipelines.',
      ],
      technologies: ['React', 'Python', 'Flask', 'GCP Cloud Run', 'Docker', 'PostgreSQL', 'Gemini API', 'CI/CD'],
    },
    {
      id: 'contabo',
      role: 'Content Management System Developer & Security Analyst',
      company: 'Contabo',
      location: 'Ingolstadt, Germany',
      period: '12/2025 – 04/2026',
      type: 'Contract',
      highlights: [
        'Enforced Least Privilege Access models and integrated Multi-Factor Authentication across Content Management Systems, reducing lateral movement risks by 40%.',
        'Audited and mapped migrated data structures to guarantee strict compliance with GDPR, HIPAA, and PCI-DSS standards, successfully avoiding data spills.',
        'Conducted continuous API penetration testing and configuration audits on target systems to remediate zero-day vulnerabilities prior to production release.',
      ],
      technologies: ['PostgreSQL', 'Ubuntu VPS', 'RBAC', 'SOC Compliance', 'Bash', 'Linux', 'Docker'],
    },
    {
      id: 'annextech-pm',
      role: 'Project Manager & Lead Systems Engineer',
      company: 'Annextech Software',
      location: 'Gujarat, India',
      period: '07/2022 – 03/2024',
      type: 'Full-Time',
      highlights: [
        'Led development of a Flutter and Spring Boot platform serving 10,000+ users with 99.9% uptime, 50,000+ daily API calls, and zero P1 incidents.',
        'Architected REST and gRPC microservices with JWT/OAuth2, OpenAPI 3.0, and circuit-breaker resilience patterns, supporting three years in production.',
        'Built a multi-layer test suite achieving 85%+ coverage, preventing 60% of regressions before staging deployments.',
        'Optimized GitHub Actions CI/CD with intelligent layer caching, delivering 40% faster builds and same-day production releases.',
        'Mentored three junior engineers through pair programming, increasing team-wide first-pass code review acceptance rate to 78%.',
      ],
      technologies: ['Flutter', 'Spring Boot', 'Java', 'gRPC', 'JWT/OAuth2', 'PostgreSQL', 'GitHub Actions'],
    },
    {
      id: 'annextech-dev',
      role: 'Software Developer',
      company: 'Annextech Software',
      location: 'Gujarat, India',
      period: '07/2021 – 06/2022',
      type: 'Full-Time',
      highlights: [
        'Expanded product reach across iOS, Android, and desktop platforms by migrating legacy native Android applications (Java/C++) to cross-platform Flutter architecture, increasing user adoption by 60%.',
        'Ensured 95% system uptime and reliable data flow by integrating front-end frameworks with backend cloud services and validating API contracts with JUnit and Postman.',
      ],
      technologies: ['Flutter', 'Dart', 'Android SDK', 'Java', 'Postman', 'JUnit', 'Firebase'],
    },
  ],

  education: [
    {
      degree: 'Master of Engineering in AI for Autonomous Systems (Did Not Complete — Dropped for Industry Engineering)',
      institution: 'Technische Hochschule Ingolstadt',
      location: 'Ingolstadt, Germany',
      period: '2024 – 2025',
      notes: 'Did not complete the Master degree. Completed graduate coursework in Autonomous Perception, Reinforcement Learning, and GPU Computing before deliberately leaving academia to focus 100% on practical engineering and production systems in companies.',
    },
    {
      degree: 'Bachelor of Engineering in Computer Science and Engineering',
      institution: 'S. N. Patel Institute of Technology',
      location: 'Surat, India',
      period: '2019 – 2023',
      grade: 'Final Grade: 8.32 / 10 | Thesis Grade: 10 / 10',
      coursework: 'Distributed Systems, Data Structures & Algorithms, Theory of Computation, Compiler Design, Database Management Systems, Computer Networks, Cybersecurity & Cryptography.',
    },
  ],

  certifications: [
    {
      id: 'cisco-cyber',
      title: 'Cyber-Security Specialization',
      issuer: 'CISCO',
      date: '2026',
      verifyUrl: 'https://www.credly.com/badges/090b211c-fc84-4e8a-bae9-fc942164449b/linked_in?t=tk4pc7',
    },
    {
      id: 'anthropic-mcp',
      title: 'Model Context Protocol: Advanced Topics',
      issuer: 'Anthropic',
      date: '2026',
      verifyUrl: 'https://verify.skilljar.com/c/b43hufe8h953',
    },
    {
      id: 'anthropic-claude',
      title: 'Deploying Claude Enterprise with Confidence',
      issuer: 'Anthropic',
      date: '2026',
      verifyUrl: 'https://verify.skilljar.com/c/frqkgmtp86ei',
    },
    {
      id: 'gcp-ml',
      title: 'Build, Train & Deploy ML Models with Keras on GCP',
      issuer: 'Google Cloud',
      date: '2022',
      verifyUrl: 'https://www.coursera.org/account/accomplishments/verify/2BWRHMFB3YYM',
    },
    {
      id: 'gcp-feature',
      title: 'Feature Engineering & Vertex AI Store',
      issuer: 'Google Cloud',
      date: '2022',
      verifyUrl: 'https://www.coursera.org/account/accomplishments/verify/DX3JUZEAQTQ8',
    },
    {
      id: 'comptia-sec',
      title: 'CompTIA Security+ 701 Preparation',
      issuer: 'Coursera / CompTIA',
      date: '2022',
      verifyUrl: 'https://www.coursera.org',
    },
  ],

  publications: [
    {
      id: 'pub-hpc',
      title: 'Heterogeneous High Performance Computing: CPU-GPU Offloading Benchmarks',
      year: '2024',
      publisher: 'Vatsal Kishorkumar Maisuria (Research Paper)',
      summary: 'Authored peer-reviewed research examining performance trade-offs across multi-processor and GPU hardware combinations using C++, CUDA, and OpenMP offloading.',
      technologies: ['C++', 'CUDA', 'OpenMP', 'MATLAB', 'GPU Computing'],
    },
    {
      id: 'pub-seg',
      title: 'Pixel-Wise Image Segmentation & Object Detection Pipeline',
      year: '2022',
      publisher: 'Vatsal Kishorkumar Maisuria',
      summary: 'Implemented pixel-wise segmentation and FCN-based encoder-decoder architectures with bounding box tracking deployed to on-device mobile environments.',
      technologies: ['Python', 'YOLO', 'OpenCV', 'TensorFlow Lite', 'Dart'],
    },
  ],
};
