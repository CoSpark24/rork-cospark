import { SkillCategory } from "@/types";

export const skillCategories: SkillCategory[] = [
  {
    name: "Technical",
    skills: [
      "Frontend Development",
      "Backend Development",
      "Mobile Development",
      "Data Science",
      "Machine Learning",
      "DevOps",
      "Blockchain",
      "UI/UX Design",
      "Product Management",
      "QA & Testing",
    ],
  },
  {
    name: "Business",
    skills: [
      "Business Development",
      "Sales",
      "Marketing",
      "Finance",
      "Operations",
      "Strategy",
      "Customer Success",
      "HR & Recruitment",
      "Legal",
      "Fundraising",
    ],
  },
  {
    name: "Domain Expertise",
    skills: [
      "Healthcare",
      "Fintech",
      "E-commerce",
      "Education",
      "Real Estate",
      "Travel",
      "Food & Beverage",
      "Manufacturing",
      "Logistics",
      "Entertainment",
    ],
  },
];

export const allSkills = skillCategories.flatMap(category => category.skills);