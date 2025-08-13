import React from "react";

const IXLHomePage = () => {
  // Data for cloud elements
  const clouds = [
    {
      id: 1,
      title: "Comprehensive\ncurriculum",
      description: "Maths • English",
      borderColor: "#0096D6",
      iconColor: "#0096D6",
    },
    {
      id: 2,
      title: "Trusted by\neducators and parents",
      description:
        "Over 160 billion questions answered\nMore than 17 million students use IXL",
      borderColor: "#8B3FAE",
      iconColor: "#8B3FAE",
    },
    {
      id: 3,
      title: "Immersive\nlearning experience",
      description: "Analytics • Standards • Awards",
      borderColor: "#3CC6C6",
      iconColor: "#3CC6C6",
    },
  ];

  // Data for grade cards
  const gradeCards = [
    {
      id: 1,
      letter: "L",
      title: "LKG",
      color: "#1D9CD1",
      description:
        "Counting objects, inside and outside, longer and shorter, letter names, rhyming words and more.",
      subjects: [
        { name: "Maths", skills: 55 },
        { name: "English", skills: 78 },
      ],
    },
    {
      id: 2,
      letter: "U",
      title: "UKG",
      color: "#F7941D",
      description:
        "Comparing numbers, names of shapes, consonant and vowel sounds, sight words and more.",
      subjects: [
        { name: "Maths", skills: 144 },
        { name: "English", skills: 131 },
      ],
    },
    {
      id: 3,
      letter: "I",
      title: "Class I",
      color: "#5CB800",
      description:
        "Adding and subtracting, greater than and less than, categories, nouns, verb tense, time order and more.",
      subjects: [
        { name: "Maths", skills: 164 },
        { name: "English", skills: 169 },
      ],
    },
    {
      id: 4,
      letter: "II",
      title: "Class II",
      color: "#8B3FAE",
      description:
        "Place-value models, measurement, synonyms, antonyms, homophones and more.",
      subjects: [
        { name: "Maths", skills: 200 },
        { name: "English", skills: 185 },
      ],
    },
    {
      id: 5,
      letter: "III",
      title: "Class III",
      color: "#3CC6C6",
      description:
        "Multiplication, division, bar graphs, pronouns, possessives, weather and climate and more.",
      subjects: [
        { name: "Maths", skills: 225 },
        { name: "English", skills: 210 },
      ],
    },
    {
      id: 6,
      letter: "IV",
      title: "Class IV",
      color: "#0096D6",
      description:
        "Fractions, decimals, line plots, adjectives, adverbs, punctuation, geography and more.",
      subjects: [
        { name: "Maths", skills: 250 },
        { name: "English", skills: 230 },
      ],
    },
  ];

  // Data for grade table
  const gradeTable = [
    { code: "L", name: "LKG", code2: "YI", name2: "Class VI" },
    { code: "U", name: "UKG", code2: "YII", name2: "Class VII" },
    { code: "I", name: "Class I", code2: "VIII", name2: "Class VIII" },
    { code: "II", name: "Class II", code2: "IX", name2: "Class IX" },
    { code: "III", name: "Class III", code2: "X", name2: "Class X" },
    { code: "IV", name: "Class IV", code2: "XI", name2: "Class XI" },
    { code: "V", name: "Class V", code2: "XII", name2: "Class XII" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative w-full min-h-[400px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="https://in.ixl.com/dv3/WTVWZ3rDtffsT5NzXGe4jwM-TpI/yui3/home-page/assets/home-2019/header/high-school-header-bg-1920-2x.webp"
            alt="Learning background"
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-50/70 to-teal-50/70"></div>
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 text-center py-12 z-10">
          <h1 className="text-3xl sm:text-4xl font-serif font-normal text-blue-600 mb-8">
            <span className="font-bold">IXL is</span> personalised learning
          </h1>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8">
            {clouds.map((cloud) => (
              <div
                key={cloud.id}
                className="bg-white rounded-full px-6 py-4 sm:px-8 sm:py-6 text-center border-2 max-w-xs backdrop-blur-sm bg-white/90"
                style={{
                  borderColor: cloud.borderColor,
                  clipPath: "ellipse(100% 100% at 50% 50%)",
                }}
              >
                <h3
                  className="font-semibold text-base sm:text-lg leading-tight mb-2"
                  style={{ color: cloud.iconColor }}
                >
                  {cloud.title.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </h3>
                <p className="text-xs text-gray-600 whitespace-pre-line mb-2">
                  {cloud.description}
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke={cloud.iconColor}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            ))}
          </div>

          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md text-sm transition-colors duration-200">
            Become a member!
          </button>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Grade Cards Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">
            Comprehensive curriculum
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gradeCards.map((card) => (
              <div
                key={card.id}
                className="border rounded-lg p-4 bg-white"
                style={{ borderColor: card.color }}
              >
                <div className="flex items-center mb-3">
                  <div
                    className="text-white font-semibold rounded-full w-8 h-8 flex items-center justify-center mr-2"
                    style={{ backgroundColor: card.color }}
                  >
                    {card.letter}
                  </div>
                  <h3
                    className="font-serif font-semibold text-lg"
                    style={{ color: card.color }}
                  >
                    {card.title}
                  </h3>
                </div>
                <p className="text-xs text-gray-600 mb-4">{card.description}</p>
                <hr className="border-gray-200 mb-3" />
                <div className="space-y-2">
                  {card.subjects.map((subject, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="text-gray-700">{subject.name}</span>
                      <a
                        href="/lessons"
                        className="font-semibold hover:underline"
                        style={{ color: card.color }}
                      >
                        {subject.skills} skills &gt;&gt;
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Grade Table Section */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">
            Trusted by educators and parents
          </h2>
          <p className="text-gray-600 mb-6">
            Over 160 billion questions answered
            <br />
            More than 17 million students use IXL
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <tbody>
                {gradeTable.map((row, i) => (
                  <tr key={i} className="border-b border-gray-200">
                    <td className="px-4 py-2 font-medium">{row.code}</td>
                    <td className="px-4 py-2">{row.name}</td>
                    <td className="px-4 py-2 font-medium">{row.code2}</td>
                    <td className="px-4 py-2">{row.name2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default IXLHomePage;
