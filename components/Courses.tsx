import React from 'react';

const COURSES = [
  {
    title: "Mastering Data Structures",
    description: "Deep dive into Arrays, Trees, Graphs, and DP with Python.",
    tags: ["DSA", "Python", "Interview"],
    level: "Intermediate",
    links: [
      { name: "Big O Cheatsheet", url: "https://www.bigocheatsheet.com/" },
      { name: "NeetCode Roadmap", url: "https://neetcode.io/roadmap" }
    ]
  },
  {
    title: "Machine Learning A-Z",
    description: "From Linear Regression to Deep Neural Networks.",
    tags: ["ML", "AI", "Data Science"],
    level: "Advanced",
    links: [
      { name: "Google ML Crash Course", url: "https://developers.google.com/machine-learning/crash-course" },
      { name: "Fast.ai", url: "https://course.fast.ai/" }
    ]
  },
  {
    title: "System Design for Scale",
    description: "Learn how to design scalable systems like Uber, Twitter, etc.",
    tags: ["Architecture", "Backend"],
    level: "Advanced",
    links: [
      { name: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer" }
    ]
  },
  {
    title: "Advanced React Patterns",
    description: "Hooks, Context, Performance, and Custom Design Systems.",
    tags: ["Frontend", "React"],
    level: "Expert",
    links: [
      { name: "React Docs", url: "https://react.dev/" }
    ]
  },
  {
    title: "Docker & Kubernetes Mastery",
    description: "Containerization and orchestration for modern DevOps.",
    tags: ["DevOps", "Infrastructure"],
    level: "Intermediate",
    links: [
      { name: "Docker Curriculum", url: "https://docker-curriculum.com/" }
    ]
  },
  {
    title: "Microservices Architecture",
    description: "Breaking down monoliths into scalable services.",
    tags: ["Backend", "Design"],
    level: "Advanced",
    links: [
      { name: "Microservices.io", url: "https://microservices.io/" }
    ]
  },
  {
    title: "Graph Algorithms Deep Dive",
    description: "BFS, DFS, Dijkstra, A* and Network Flow problems.",
    tags: ["DSA", "Algorithms"],
    level: "Hard",
    links: [
      { name: "CP Algorithms", url: "https://cp-algorithms.com/" }
    ]
  },
  {
    title: "Behavioral Interview Mastery",
    description: "How to answer 'Tell me about a time...' using STAR method.",
    tags: ["Soft Skills", "HR"],
    level: "All Levels",
    links: [
      { name: "STAR Method", url: "https://www.indeed.com/career-advice/interviewing/how-to-use-the-star-interview-response-technique" }
    ]
  }
];

export const Courses: React.FC = () => {
  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
           <h2 className="text-4xl font-extrabold text-white mb-3 tracking-tight">Learning Library</h2>
           <p className="text-slate-400 text-lg">Curated resources to bridge your knowledge gaps.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
          {COURSES.map((course, idx) => (
            <div key={idx} className="group relative bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10 flex flex-col h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none"></div>
              
              <div className="flex justify-between items-start mb-4">
                 <div className="flex flex-wrap gap-2">
                  {course.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-300 text-[10px] uppercase tracking-wider font-bold rounded-md group-hover:bg-blue-900/20 group-hover:text-blue-300 group-hover:border-blue-800 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                    course.level === 'Expert' || course.level === 'Hard' ? 'border-red-900 text-red-400 bg-red-900/10' :
                    course.level === 'Advanced' ? 'border-orange-900 text-orange-400 bg-orange-900/10' :
                    'border-green-900 text-green-400 bg-green-900/10'
                }`}>
                    {course.level}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{course.title}</h3>
              <p className="text-slate-400 text-sm mb-6 flex-grow leading-relaxed">{course.description}</p>
              
              <div className="mt-auto pt-4 border-t border-slate-800/50">
                <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Resources</h4>
                <ul className="space-y-2">
                  {course.links.map(link => (
                    <li key={link.url} className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-blue-400 transition-colors hover:underline decoration-blue-500/50 underline-offset-4">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};